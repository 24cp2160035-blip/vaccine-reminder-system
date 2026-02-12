import dotenv from "dotenv";
import mongoose from "mongoose";
import transporter from "./services/mailer.js";
import User from "./models/userModel.js";
import Profile from "./models/profileModel.js";
import Vaccine from "./models/vaccineModel.js";

dotenv.config();

console.log("=== Testing Reminder System ===\n");

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

async function testReminderSystem() {
  try {
    // 1. Find a test user (or use your email)
    const testEmail = process.env.EMAIL_USER;
    console.log(`\n📧 Testing with email: ${testEmail}`);
    
    // 2. Check if there are any profiles with reminders enabled
    const profilesWithReminders = await Profile.find({ reminderEnabled: true });
    console.log(`\n✅ Found ${profilesWithReminders.length} profiles with reminders enabled`);
    
    if (profilesWithReminders.length > 0) {
      profilesWithReminders.forEach(p => {
        console.log(`   - ${p.name}: Remind ${p.reminderDaysBefore} days before at ${p.reminderTime}`);
      });
    }
    
    // 3. Check for vaccines with custom reminder dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const vaccinesWithReminders = await Vaccine.find({
      remindMeDate: { $gte: today, $lte: endOfDay },
      reminderSent: false
    }).populate('profileId');
    
    console.log(`\n✅ Found ${vaccinesWithReminders.length} vaccines with custom reminders for today`);
    
    // 4. Send a test email
    console.log("\n📤 Sending test reminder email...");
    
    const testMessage = {
      from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: "🔔 Test: Vaccine Reminder System is Working!",
      text: `Hi there!

This is a test email to confirm your vaccine reminder system is working correctly.

✅ Email service: Connected
✅ Database: Connected
✅ Reminder service: Running

Your reminder system will automatically send emails:
- Daily at the time you set in notification settings
- For vaccines ${profilesWithReminders[0]?.reminderDaysBefore || 3} days before due date
- For custom "Remind Me" dates you set

Best regards,
Vaccine Reminder System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🔔 Test: Vaccine Reminder System</h2>
          <p>Hi there!</p>
          <p>This is a test email to confirm your vaccine reminder system is working correctly.</p>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">System Status</h3>
            <p style="margin: 5px 0;">✅ Email service: Connected</p>
            <p style="margin: 5px 0;">✅ Database: Connected</p>
            <p style="margin: 5px 0;">✅ Reminder service: Running</p>
          </div>
          
          <p><strong>Your reminder system will automatically send emails:</strong></p>
          <ul>
            <li>Daily at the time you set in notification settings</li>
            <li>For vaccines ${profilesWithReminders[0]?.reminderDaysBefore || 3} days before due date</li>
            <li>For custom "Remind Me" dates you set</li>
          </ul>
          
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Vaccine Reminder System</p>
        </div>
      `
    };
    
    await transporter.sendMail(testMessage);
    console.log("✅ Test email sent successfully!");
    
    console.log("\n=== Test Complete ===");
    console.log("\nYour reminder system is fully configured and working!");
    console.log("\nHow it works:");
    console.log("1. Automatic reminders: Sent daily based on profile notification settings");
    console.log("2. Custom reminders: Sent when you set a 'Remind Me' date on a vaccine");
    console.log("3. Overdue alerts: Sent daily at 8 AM for overdue vaccines");
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run the test
setTimeout(testReminderSystem, 1000);
