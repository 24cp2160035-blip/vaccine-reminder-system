import dotenv from "dotenv";
import cron from "node-cron";
import mongoose from "mongoose";
import transporter from "./services/mailer.js";
import Vaccine from "./models/vaccineModel.js";
import Profile from "./models/profileModel.js";
import User from "./models/userModel.js";

dotenv.config();

console.log("=== Testing Cron - Runs Every Minute ===\n");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

console.log("⏰ Starting cron job that runs EVERY MINUTE");
console.log("📝 This will check for reminders every minute instead of every hour");
console.log("🛑 Press Ctrl+C to stop\n");

// Run every minute for testing
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  console.log(`\n🔔 [${now.toLocaleTimeString()}] Checking reminders for time: ${currentTime}...`);
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const allVaccinesForToday = await Vaccine.find({
      remindMeDate: { $gte: today, $lte: endOfDay },
      reminderSent: false,
      status: { $ne: "completed" }
    }).populate('profileId');
    
    console.log(`   Found ${allVaccinesForToday.length} total vaccines with reminders for today`);
    
    if (allVaccinesForToday.length > 0) {
      allVaccinesForToday.forEach(v => {
        const vTime = v.remindMeTime || "09:00";
        const matches = v.remindMeTime ? (v.remindMeTime === currentTime) : (currentTime === "09:00");
        console.log(`   - ${v.vaccineName}: time=${vTime}, matches=${matches ? '✅' : '❌'}`);
      });
    }
    
    const vaccinesWithReminders = allVaccinesForToday.filter(vaccine => {
      if (vaccine.remindMeTime) {
        return vaccine.remindMeTime === currentTime;
      }
      return currentTime === "09:00";
    });
    
    console.log(`   Filtered to ${vaccinesWithReminders.length} vaccines matching time ${currentTime}`);
    
    for (const vaccine of vaccinesWithReminders) {
      if (!vaccine.profileId) continue;
      
      const profile = vaccine.profileId;
      const user = await User.findById(profile.userId);
      
      if (!user || !user.email) continue;
      
      const reminderTime = vaccine.remindMeTime || "09:00";
      
      console.log(`   📤 Sending reminder to ${user.email} for ${vaccine.vaccineName}`);
      
      try {
        await transporter.sendMail({
          from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `🔔 Custom Reminder: ${vaccine.vaccineName} for ${profile.name}`,
          text: `Hi ${user.name},\n\nReminder for ${vaccine.vaccineName}\nDue: ${formatDate(vaccine.dueDate)}\nReminder Time: ${reminderTime}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🔔 Custom Reminder</h2>
              <p>Hi ${user.name},</p>
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">${vaccine.vaccineName}</h3>
                <p><strong>Profile:</strong> ${profile.name}</p>
                <p><strong>Due Date:</strong> ${formatDate(vaccine.dueDate)}</p>
                <p><strong>Reminder Time:</strong> ${reminderTime}</p>
              </div>
            </div>
          `
        });

        vaccine.reminderSent = true;
        await vaccine.save();
        
        console.log(`   ✅ Email sent successfully!`);
      } catch (emailError) {
        console.log(`   ❌ Failed to send: ${emailError.message}`);
      }
    }
    
    if (vaccinesWithReminders.length === 0) {
      console.log(`   ℹ️  No reminders to send at ${currentTime}`);
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
});

console.log("✅ Cron job started! Waiting for next minute...\n");
