import dotenv from "dotenv";
import mongoose from "mongoose";
import transporter from "./services/mailer.js";
import Vaccine from "./models/vaccineModel.js";
import Profile from "./models/profileModel.js";
import User from "./models/userModel.js";

dotenv.config();

console.log("=== FORCE SEND REMINDER TEST ===\n");

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

async function forceSendReminder() {
  try {
    console.log("🔍 Looking for ANY vaccine with a remindMeDate set...\n");
    
    // Find ANY vaccine with remindMeDate (ignore date/time matching)
    const vaccines = await Vaccine.find({
      remindMeDate: { $exists: true, $ne: null }
    }).populate('profileId').limit(5);
    
    console.log(`📋 Found ${vaccines.length} vaccines with remindMeDate set\n`);
    
    if (vaccines.length === 0) {
      console.log("❌ No vaccines found with remindMeDate!");
      console.log("\n💡 Please:");
      console.log("1. Go to your app");
      console.log("2. Add a vaccine");
      console.log("3. Set 'Remind Me On' to any date");
      console.log("4. Run this test again\n");
      process.exit(0);
    }
    
    // Show all vaccines found
    vaccines.forEach((v, i) => {
      console.log(`${i + 1}. ${v.vaccineName}`);
      console.log(`   Profile: ${v.profileId?.name || 'N/A'}`);
      console.log(`   Due Date: ${formatDate(v.dueDate)}`);
      console.log(`   Remind Me Date: ${formatDate(v.remindMeDate)}`);
      console.log(`   Remind Me Time: ${v.remindMeTime || '(not set)'}`);
      console.log(`   Reminder Sent: ${v.reminderSent ? 'Yes' : 'No'}`);
      console.log();
    });
    
    // Pick the first one
    const vaccine = vaccines[0];
    
    console.log(`📤 Attempting to send email for: ${vaccine.vaccineName}\n`);
    
    if (!vaccine.profileId) {
      console.error("❌ No profile found for this vaccine");
      process.exit(1);
    }
    
    const profile = vaccine.profileId;
    const user = await User.findById(profile.userId);
    
    if (!user) {
      console.error("❌ No user found for this profile");
      process.exit(1);
    }
    
    if (!user.email) {
      console.error("❌ User has no email address");
      process.exit(1);
    }
    
    console.log(`📧 Sending to: ${user.email}`);
    console.log(`👤 User: ${user.name}`);
    console.log(`👶 Profile: ${profile.name}\n`);
    
    const reminderTime = vaccine.remindMeTime || "09:00";
    
    const message = `Hi ${user.name},

🔔 TEST: Custom Reminder for ${profile.name}

This is a TEST email to verify your reminder system is working.

Vaccine: ${vaccine.vaccineName}
Due Date: ${formatDate(vaccine.dueDate)}
${vaccine.doctorName ? `Doctor: ${vaccine.doctorName}` : ''}
${vaccine.notes ? `Notes: ${vaccine.notes}` : ''}
Reminder Time: ${reminderTime}

If you receive this email, your reminder system is working correctly!

Best regards,
Vaccine Reminder System`;

    console.log("📨 Sending email...\n");
    
    const info = await transporter.sendMail({
      from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🔔 TEST: Custom Reminder - ${vaccine.vaccineName}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🔔 TEST: Custom Reminder</h2>
          <p>Hi ${user.name},</p>
          <p><strong>This is a TEST email to verify your reminder system is working.</strong></p>
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">${vaccine.vaccineName}</h3>
            <p style="margin: 5px 0;"><strong>Profile:</strong> ${profile.name}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${formatDate(vaccine.dueDate)}</p>
            ${vaccine.doctorName ? `<p style="margin: 5px 0;"><strong>Doctor:</strong> ${vaccine.doctorName}</p>` : ''}
            ${vaccine.notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${vaccine.notes}</p>` : ''}
            <p style="margin: 5px 0; color: #2563eb;"><strong>⏰ Reminder Time:</strong> ${reminderTime}</p>
          </div>
          <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>✅ If you receive this email, your reminder system is working correctly!</strong>
          </p>
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Vaccine Reminder System</p>
        </div>
      `
    });
    
    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Check your inbox: ${user.email}\n`);
    
    console.log("=== SUCCESS ===");
    console.log("Your email system is working!");
    console.log("The issue is likely with time matching in the cron job.\n");
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nFull error:");
    console.error(error);
    
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check EMAIL_USER in .env:", process.env.EMAIL_USER);
    console.log("2. Check EMAIL_PASS exists:", process.env.EMAIL_PASS ? "Yes" : "No");
    console.log("3. Verify Gmail App Password is correct");
    console.log("4. Make sure 2FA is enabled on Gmail\n");
    
    process.exit(1);
  }
}

setTimeout(forceSendReminder, 1000);
