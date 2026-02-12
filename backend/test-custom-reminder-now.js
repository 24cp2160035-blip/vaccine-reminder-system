import dotenv from "dotenv";
import mongoose from "mongoose";
import transporter from "./services/mailer.js";
import Vaccine from "./models/vaccineModel.js";
import Profile from "./models/profileModel.js";
import User from "./models/userModel.js";

dotenv.config();

console.log("=== Testing Custom Reminder (Immediate Send) ===\n");

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

async function testCustomReminder() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    console.log(`📅 Today: ${today.toLocaleDateString()}`);
    console.log(`⏰ Current Time: ${currentTime}\n`);
    
    // Find ALL vaccines with remindMeDate = today
    const allVaccinesForToday = await Vaccine.find({
      remindMeDate: { $gte: today, $lte: endOfDay },
      reminderSent: false,
      status: { $ne: "completed" }
    }).populate('profileId');
    
    console.log(`📋 Found ${allVaccinesForToday.length} vaccines with reminders for today:\n`);
    
    if (allVaccinesForToday.length === 0) {
      console.log("❌ No vaccines found with reminders for today!");
      console.log("\n💡 To test:");
      console.log("1. Go to your app");
      console.log("2. Add a vaccine");
      console.log("3. Set 'Remind Me On' to TODAY");
      console.log("4. Set 'Remind Me At' to current time or leave empty");
      console.log("5. Run this test again\n");
      process.exit(0);
    }
    
    for (const vaccine of allVaccinesForToday) {
      const reminderTime = vaccine.remindMeTime || "09:00";
      const matches = !vaccine.remindMeTime ? (currentTime === "09:00") : (vaccine.remindMeTime === currentTime);
      
      console.log(`\n📌 Vaccine: ${vaccine.vaccineName}`);
      console.log(`   Profile: ${vaccine.profileId?.name || 'N/A'}`);
      console.log(`   Due Date: ${formatDate(vaccine.dueDate)}`);
      console.log(`   Remind Me Date: ${formatDate(vaccine.remindMeDate)}`);
      console.log(`   Remind Me Time: ${vaccine.remindMeTime || '(not set, defaults to 09:00)'}`);
      console.log(`   Current Time: ${currentTime}`);
      console.log(`   Time Match: ${matches ? '✅ YES' : '❌ NO'}`);
      console.log(`   Reminder Sent: ${vaccine.reminderSent ? 'Yes' : 'No'}`);
    }
    
    // Filter for matching time
    const vaccinesWithReminders = allVaccinesForToday.filter(vaccine => {
      if (vaccine.remindMeTime) {
        return vaccine.remindMeTime === currentTime;
      }
      return currentTime === "09:00";
    });
    
    console.log(`\n🎯 ${vaccinesWithReminders.length} vaccines match current time (${currentTime})\n`);
    
    if (vaccinesWithReminders.length === 0) {
      console.log("ℹ️  No vaccines match the current time.");
      console.log(`\n💡 Tips:`);
      console.log(`   - Current time is ${currentTime}`);
      console.log(`   - Set 'Remind Me At' to ${currentTime} to test now`);
      console.log(`   - Or wait until the time matches one of your reminders`);
      console.log(`   - Or leave time empty and test at 09:00\n`);
      process.exit(0);
    }
    
    // Send emails for matching vaccines
    console.log("📤 Sending reminder emails...\n");
    
    for (const vaccine of vaccinesWithReminders) {
      if (!vaccine.profileId) continue;
      
      const profile = vaccine.profileId;
      const user = await User.findById(profile.userId);
      
      if (!user || !user.email) {
        console.log(`⚠️  Skipping ${vaccine.vaccineName} - no user/email found`);
        continue;
      }
      
      const reminderTime = vaccine.remindMeTime || "09:00";
      
      console.log(`📧 Sending to: ${user.email}`);
      console.log(`   Vaccine: ${vaccine.vaccineName}`);
      console.log(`   Profile: ${profile.name}`);
      console.log(`   Time: ${reminderTime}`);
      
      const message = `Hi ${user.name},

🔔 Custom Reminder for ${profile.name}

You asked to be reminded about:

Vaccine: ${vaccine.vaccineName}
Due Date: ${formatDate(vaccine.dueDate)}
${vaccine.doctorName ? `Doctor: ${vaccine.doctorName}` : ''}
${vaccine.notes ? `Notes: ${vaccine.notes}` : ''}

This is your custom reminder that you set for today at ${reminderTime}.

Best regards,
Vaccine Reminder System`;

      try {
        await transporter.sendMail({
          from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `🔔 Custom Reminder: ${vaccine.vaccineName} for ${profile.name}`,
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🔔 Custom Reminder</h2>
              <p>Hi ${user.name},</p>
              <p>You asked to be reminded about <strong>${profile.name}'s</strong> vaccination:</p>
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">${vaccine.vaccineName}</h3>
                <p style="margin: 5px 0;"><strong>Due Date:</strong> ${formatDate(vaccine.dueDate)}</p>
                ${vaccine.doctorName ? `<p style="margin: 5px 0;"><strong>Doctor:</strong> ${vaccine.doctorName}</p>` : ''}
                ${vaccine.notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${vaccine.notes}</p>` : ''}
                <p style="margin: 5px 0; color: #2563eb;"><strong>⏰ Reminder Time:</strong> ${reminderTime}</p>
              </div>
              <p>This is your custom reminder that you set for today at ${reminderTime}.</p>
              <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Vaccine Reminder System</p>
            </div>
          `
        });

        // Mark reminder as sent
        vaccine.reminderSent = true;
        await vaccine.save();
        
        console.log(`   ✅ Email sent successfully!\n`);
      } catch (emailError) {
        console.log(`   ❌ Failed to send: ${emailError.message}\n`);
      }
    }
    
    console.log("=== Test Complete ===\n");
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setTimeout(testCustomReminder, 1000);
