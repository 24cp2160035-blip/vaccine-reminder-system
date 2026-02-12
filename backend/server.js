import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Import services to ensure they start running
import "./services/reminderService.js";

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
console.log("-----------------------------------");

// ---------------- CREATE APP ----------------
const app = express();
app.use(express.json());

// ---------------- CORS CONFIG ----------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://vaccine-reminder.vercel.app" // Replace with your actual Vercel URL after deployment
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

// CONNECT DATABASE
connectDB();

// ------------------ ROUTES ------------------
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/vaccines", vaccineRoutes);
app.use("/api/vaccine-library", vaccineMasterRoutes);
app.use("/api/vaccine-library/add", vaccineLibraryAddRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ---------------- TEST EMAIL ROUTE ----------------
app.get("/test-email", async (_, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Vaccine App Test",
      text: "If you see this, the email service is working!"
    });

    res.send("✔ Mail Sent Successfully");
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// ---------------- MANUAL REMINDER TRIGGER ----------------
app.get("/trigger-reminders", async (_, res) => {
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
          text: `Hi ${user.name},

Reminder for ${vaccine.vaccineName}
Due Date: ${vaccine.dueDate.toLocaleDateString()}

Please make sure to complete it on time.`,
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
    res.status(500).json({ error: e.toString() });
  }
});

// ---------------- 404 FALLBACK ----------------
app.use((req, res) =>
  res.status(404).json({ message: "Route Not Found" })
);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5050;

app.listen(PORT, () =>
  console.log(`🚀 Server running on Port ${PORT}`)
);