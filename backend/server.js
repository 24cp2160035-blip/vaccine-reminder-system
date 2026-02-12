import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// ROUTES imports
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import vaccineRoutes from "./routes/vaccineRoutes.js";
import vaccineLibraryAddRoutes from "./routes/vaccineLibraryAddRoute.js";
import vaccineMasterRoutes from "./routes/vaccineLibraryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import transporter from "./services/mailer.js";

// Debug logs
console.log("-----------------------------------");
console.log("📧 Email Config Check:");
console.log("USER =", process.env.EMAIL_USER);
console.log("PASS =", process.env.EMAIL_PASS ? "OK (Hidden)" : "NOT FOUND");
console.log("NODE_ENV =", process.env.NODE_ENV || "development");
console.log("-----------------------------------");

// ---------------- CREATE APP ----------------
const app = express();
app.use(express.json());

// ---------------- CORS CONFIG ----------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://vaccine-reminder.vercel.app" // Replace with your actual Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman & server-to-server

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// ------------------ ROUTES ------------------
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/vaccines", vaccineRoutes);
app.use("/api/vaccine-library", vaccineMasterRoutes);
app.use("/api/vaccine-library/add", vaccineLibraryAddRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Vaccine Reminder API is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ---------------- TEST EMAIL ROUTE ----------------
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Vaccine App Test",
      text: "If you see this, the email service is working!"
    });

    res.send("✔ Mail Sent Successfully");
  } catch (e) {
    console.error("Test email error:", e);
    res.status(500).send(e.toString());
  }
});

// ---------------- MANUAL REMINDER TRIGGER ----------------
app.get("/trigger-reminders", async (req, res) => {
  try {
    const Vaccine = (await import("./models/vaccineModel.js")).default;
    const Profile = (await import("./models/profileModel.js")).default;
    const User = (await import("./models/userModel.js")).default;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const allVaccinesForToday = await Vaccine.find({
      remindMeDate: { $gte: today, $lte: endOfDay },
      reminderSent: false,
      status: { $ne: "completed" }
    }).populate("profileId");

    const vaccinesWithReminders = allVaccinesForToday.filter((vaccine) => {
      if (vaccine.remindMeTime) {
        return vaccine.remindMeTime === currentTime;
      }
      return currentTime === "09:00";
    });

    let sent = 0;
    const results = [];

    for (const vaccine of vaccinesWithReminders) {
      if (!vaccine.profileId) continue;

      const profile = vaccine.profileId;
      const user = await User.findById(profile.userId);

      if (!user || !user.email) continue;

      try {
        await transporter.sendMail({
          from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `🔔 Custom Reminder: ${vaccine.vaccineName} for ${profile.name}`,
          text: `Hi ${user.name},\n\nReminder for ${vaccine.vaccineName}\nDue Date: ${vaccine.dueDate.toLocaleDateString()}\n\nPlease make sure to complete it on time.`,
          html: `
            <h2>🔔 Vaccine Reminder</h2>
            <p><strong>Vaccine:</strong> ${vaccine.vaccineName}</p>
            <p><strong>Profile:</strong> ${profile.name}</p>
            <p><strong>Due Date:</strong> ${vaccine.dueDate.toLocaleDateString()}</p>
          `
        });

        vaccine.reminderSent = true;
        await vaccine.save();

        sent++;
        results.push(`✅ Sent to ${user.email} for ${vaccine.vaccineName}`);
      } catch (err) {
        results.push(`❌ Failed for ${vaccine.vaccineName}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      currentTime,
      totalFound: allVaccinesForToday.length,
      matching: vaccinesWithReminders.length,
      sent,
      results
    });
  } catch (e) {
    console.error("Trigger reminders error:", e);
    res.status(500).json({ error: e.toString() });
  }
});

// ---------------- 404 FALLBACK ----------------
app.use((req, res) =>
  res.status(404).json({ message: "Route Not Found" })
);

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: err.message 
  });
});

// ---------------- STARTUP SEQUENCE ----------------
const PORT = process.env.PORT || 5050;

async function startServer() {
  try {
    console.log("🔄 Starting server...");
    
    // 1. Connect to MongoDB FIRST
    console.log("📦 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");
    
    // 2. Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on Port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
    
    // 3. Import reminder service AFTER everything is ready
    console.log("⏰ Initializing reminder service...");
    await import("./services/reminderService.js");
    console.log("✅ Reminder service loaded");
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
