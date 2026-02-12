import dotenv from "dotenv";
import mongoose from "mongoose";
import Vaccine from "./models/vaccineModel.js";
import Profile from "./models/profileModel.js";
import User from "./models/userModel.js";

dotenv.config();

console.log("=== Testing 'Remind Me' Feature ===\n");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

async function testRemindMe() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log("📅 Checking for vaccines with 'Remind Me' date set to TODAY...\n");
    
    // Find vaccines with remindMeDate = today
    const vaccinesWithReminders = await Vaccine.find({
      remindMeDate: { $gte: today, $lte: endOfDay },
      reminderSent: false,
      status: { $ne: "completed" }
    }).populate('profileId');
    
    console.log(`Found ${vaccinesWithReminders.length} vaccines with reminders for today\n`);
    
    if (vaccinesWithReminders.length > 0) {
      console.log("📋 Details:");
      for (const vaccine of vaccinesWithReminders) {
        if (vaccine.profileId) {
          const user = await User.findById(vaccine.profileId.userId);
          console.log(`\n  Vaccine: ${vaccine.vaccineName}`);
          console.log(`  Profile: ${vaccine.profileId.name}`);
          console.log(`  User Email: ${user?.email || 'N/A'}`);
          console.log(`  Due Date: ${vaccine.dueDate.toLocaleDateString()}`);
          console.log(`  Remind Me Date: ${vaccine.remindMeDate.toLocaleDateString()}`);
          console.log(`  Reminder Sent: ${vaccine.reminderSent ? 'Yes ✓' : 'No (will be sent at 9 AM)'}`);
        }
      }
      
      console.log("\n✅ These reminders will be sent automatically at 9:00 AM daily");
    } else {
      console.log("ℹ️  No vaccines with 'Remind Me' date set to today");
      console.log("\nTo test this feature:");
      console.log("1. Go to your app");
      console.log("2. Add a vaccine");
      console.log("3. Set 'Remind Me On' to today's date");
      console.log("4. Run this test again");
      console.log("5. The email will be sent at 9:00 AM");
    }
    
    // Show all vaccines with future remind me dates
    const futureReminders = await Vaccine.find({
      remindMeDate: { $gt: endOfDay },
      reminderSent: false
    }).populate('profileId');
    
    if (futureReminders.length > 0) {
      console.log(`\n📅 Found ${futureReminders.length} vaccines with future 'Remind Me' dates:`);
      for (const vaccine of futureReminders) {
        if (vaccine.profileId) {
          console.log(`  - ${vaccine.vaccineName} for ${vaccine.profileId.name} on ${vaccine.remindMeDate.toLocaleDateString()}`);
        }
      }
    }
    
    console.log("\n=== How 'Remind Me' Works ===");
    console.log("1. When adding a vaccine, set the 'Remind Me On' date");
    console.log("2. Every day at 9:00 AM, the system checks for reminders");
    console.log("3. If remindMeDate = today, an email is sent");
    console.log("4. The reminderSent flag is set to true to prevent duplicates");
    console.log("5. You receive a custom reminder email with vaccine details");
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

setTimeout(testRemindMe, 1000);
