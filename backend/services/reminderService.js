import cron from "node-cron";
import transporter from "./mailer.js";
import Vaccine from "../models/vaccineModel.js";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Check if MongoDB is connected before starting cron jobs
if (mongoose.connection.readyState !== 1) {
  console.warn("⚠️  Reminder service loaded but MongoDB not connected yet");
}

console.log("⏰ Smart Reminder Service Loaded");
console.log("📋 Active Cron Jobs:");
console.log("   - Profile reminders: Every hour (0 * * * *)");
console.log("   - Custom reminders: Every hour (0 * * * *)");
console.log("   - Overdue alerts: Daily at 8 AM (0 8 * * *)");
console.log("   - Status updates: Daily at midnight (0 0 * * *)");
console.log("-----------------------------------");

// HOURLY CRON - Check for reminders
cron.schedule("0 * * * *", async () => {
  // Safety check: ensure MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    console.warn("⚠️  Skipping profile reminders - MongoDB not connected");
    return;
  }
  
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  console.log(`⏰ Checking reminders for time slot: ${currentTime}`);

  try {
    const profiles = await Profile.find({
      reminderEnabled: true,
      reminderTime: currentTime,
    });

    if (profiles.length === 0) return;

    for (const profile of profiles) {
      const user = await User.findById(profile.userId);
      if (!user || !user.email) continue;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + profile.reminderDaysBefore);
      targetDate.setHours(0, 0, 0, 0);

      const startOfDay = new Date(targetDate);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const upcomingVaccines = await Vaccine.find({
        profileId: profile._id,
        status: "pending",
        dueDate: { $gte: startOfDay, $lte: endOfDay },
      });

      if (upcomingVaccines.length > 0) {
        const vaccineList = upcomingVaccines
          .map((v) => `• ${v.vaccineName} - Due: ${formatDate(v.dueDate)}`)
          .join("\n");
        
        const message = `Hi ${user.name},

This is a reminder for ${profile.name}'s upcoming vaccination(s):

${vaccineList}

Please schedule an appointment if you haven't already.

Best regards,
Vaccine Reminder System`;

        try {
          await transporter.sendMail({
            from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `🔔 Vaccine Reminder for ${profile.name}`,
            text: message,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Vaccine Reminder</h2>
                <p>Hi ${user.name},</p>
                <p>This is a reminder for <strong>${profile.name}'s</strong> upcoming vaccination(s):</p>
                <ul style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
                  ${upcomingVaccines.map(v => `
                    <li style="margin: 10px 0;">
                      <strong>${v.vaccineName}</strong><br>
                      Due: ${formatDate(v.dueDate)}
                      ${v.doctorName ? `<br>Doctor: ${v.doctorName}` : ''}
                    </li>
                  `).join('')}
                </ul>
                <p>Please schedule an appointment if you haven't already.</p>
                <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Vaccine Reminder System</p>
              </div>
            `
          });

          console.log(`✅ Reminder sent to ${user.email} for ${profile.name}`);
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
        }
      }
    }
  } catch (error) {
    console.error("❌ Reminder Error:", error);
  }
});

// MIDNIGHT CRON - Update overdue statuses
cron.schedule("0 0 * * *", async () => {
  // Safety check
  if (mongoose.connection.readyState !== 1) {
    console.warn("⚠️  Skipping status update - MongoDB not connected");
    return;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    const result = await Vaccine.updateMany(
      { dueDate: { $lt: today }, status: "pending" },
      { $set: { status: "overdue" } }
    );
    console.log(`📉 Updated ${result.modifiedCount} vaccines to overdue status.`);
  } catch (e) {
    console.error("Error updating statuses:", e);
  }
});

// DAILY CRON at 8 AM - Send overdue alerts
cron.schedule("0 8 * * *", async () => {
  // Safety check
  if (mongoose.connection.readyState !== 1) {
    console.warn("⚠️  Skipping overdue alerts - MongoDB not connected");
    return;
  }
  
  console.log("🚨 Checking for overdue vaccines...");
  
  try {
    const overdueVaccines = await Vaccine.find({ status: "overdue" }).populate('profileId');
    
    const userVaccineMap = {};
    
    for (const vaccine of overdueVaccines) {
      if (!vaccine.profileId) continue;
      
      const profile = vaccine.profileId;
      const user = await User.findById(profile.userId);
      
      if (!user || !user.email) continue;
      
      if (!userVaccineMap[user.email]) {
        userVaccineMap[user.email] = {
          userName: user.name,
          vaccines: []
        };
      }
      
      userVaccineMap[user.email].vaccines.push({
        profileName: profile.name,
        vaccineName: vaccine.vaccineName,
        dueDate: vaccine.dueDate
      });
    }
    
    for (const [email, data] of Object.entries(userVaccineMap)) {
      const vaccineList = data.vaccines
        .map(v => `• ${v.vaccineName} for ${v.profileName} - Was due: ${formatDate(v.dueDate)}`)
        .join("\n");
      
      const message = `Hi ${data.userName},

⚠️ URGENT: You have overdue vaccinations:

${vaccineList}

Please schedule appointments immediately to ensure health protection.

Best regards,
Vaccine Reminder System`;

      try {
        await transporter.sendMail({
          from: `"Vaccine Reminder System" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `⚠️ URGENT: Overdue Vaccinations`,
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">⚠️ Urgent: Overdue Vaccinations</h2>
              <p>Hi ${data.userName},</p>
              <p>You have <strong>overdue vaccinations</strong> that require immediate attention:</p>
              <ul style="background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                ${data.vaccines.map(v => `
                  <li style="margin: 10px 0;">
                    <strong>${v.vaccineName}</strong> for ${v.profileName}<br>
                    Was due: ${formatDate(v.dueDate)}
                  </li>
                `).join('')}
              </ul>
              <p style="color: #dc2626; font-weight: bold;">Please schedule appointments immediately to ensure health protection.</p>
              <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Vaccine Reminder System</p>
            </div>
          `
        });

        console.log(`✅ Overdue alert sent to ${email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send overdue alert to ${email}:`, emailError.message);
      }
    }
  } catch (error) {
    console.error("❌ Overdue Alert Error:", error);
  }
});

// NEW: HOURLY CRON - Check custom "Remind Me" dates with specific times
cron.schedule("0 * * * *", async () => {
  // Safety check
  if (mongoose.connection.readyState !== 1) {
    console.warn("⚠️  Skipping custom reminders - MongoDB not connected");
    return;
  }
  
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  
  console.log(`🔔 Checking custom 'Remind Me' dates for time: ${currentTime}...`);
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find ALL vaccines with remindMeDate = today and not yet sent
    const allVaccinesForToday = await Vaccine.find({
      remindMeDate: { $gte: today, $lte: endOfDay },
      reminderSent: false,
      status: { $ne: "completed" }
    }).populate('profileId');
    
    console.log(`Found ${allVaccinesForToday.length} total vaccines with reminders for today`);
    
    // Filter in JavaScript for time matching (more reliable than MongoDB query)
    const vaccinesWithReminders = allVaccinesForToday.filter(vaccine => {
      // If remindMeTime is set, it must match current time
      if (vaccine.remindMeTime) {
        return vaccine.remindMeTime === currentTime;
      }
      // If no time set, default to 9:00 AM
      return currentTime === "09:00";
    });
    
    console.log(`Filtered to ${vaccinesWithReminders.length} vaccines matching time ${currentTime}`);
    
    for (const vaccine of vaccinesWithReminders) {
      if (!vaccine.profileId) {
        console.log(`⚠️ Skipping vaccine ${vaccine.vaccineName} - no profile found`);
        continue;
      }
      
      const profile = vaccine.profileId;
      const user = await User.findById(profile.userId);
      
      if (!user || !user.email) {
        console.log(`⚠️ Skipping vaccine ${vaccine.vaccineName} - no user/email found`);
        continue;
      }
      
      const reminderTime = vaccine.remindMeTime || "09:00";
      
      console.log(`📤 Sending reminder to ${user.email} for ${vaccine.vaccineName} at ${reminderTime}`);
      
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
        
        console.log(`✅ Custom reminder sent to ${user.email} for ${vaccine.vaccineName} at ${reminderTime}`);
      } catch (emailError) {
        console.error(`❌ Failed to send custom reminder to ${user.email}:`, emailError.message);
      }
    }
    
    if (vaccinesWithReminders.length === 0) {
      console.log(`ℹ️  No reminders to send at ${currentTime}`);
    }
  } catch (error) {
    console.error("❌ Custom Reminder Error:", error);
  }
});