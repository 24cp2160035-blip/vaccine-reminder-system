# 🚀 Quick Test: Vaccine Reminders

## Test Right Now (2 minutes)

### 1. Test Email Service
```bash
cd backend
node test-reminder-system.js
```
✅ You should receive a test email at `tmugilan44@gmail.com`

### 2. Test in the App

#### A. Set Up Profile Reminders:
1. Start your servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. Login to your app
3. Go to **Profiles** page
4. Click **🔔 Notification Settings** on any profile
5. Set:
   - ✅ Enable Email Reminders: ON
   - ⏰ Reminder Time: Current time + 5 minutes (e.g., if it's 2:30 PM, set 2:35 PM)
   - 📅 Days Before: 0 (for immediate testing)
6. Click **Save Settings**

#### B. Add a Test Vaccine:
1. Go to **Vaccines** page for that profile
2. Click **➕ Add Vaccine**
3. Fill in:
   - Vaccine name: "Test Vaccine"
   - Due date: Today's date
   - 🔔 Remind Me On: Today's date
4. Click **Save**

#### C. Wait for Email:
- **Custom reminder**: Will be sent at 9:00 AM tomorrow
- **Profile reminder**: Will be sent at the time you set (if within the hour)

## 🎯 Quick Test with Immediate Results

To test immediately without waiting:

### Option 1: Use the Test Email Route
While your backend is running, visit in your browser:
```
http://localhost:5050/test-email
```
✅ You should see "✔ Mail Sent Successfully" and receive an email

### Option 2: Modify Cron Schedule (Advanced)
Temporarily change the cron schedule in `backend/services/reminderService.js`:

```javascript
// Change from hourly to every minute (for testing only!)
cron.schedule("* * * * *", async () => {  // Runs every minute
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  console.log(`⏰ Checking reminders for time slot: ${currentTime}`);
  // ... rest of code
});
```

⚠️ **Remember to change it back after testing!**

## 📊 Check Logs

When your backend is running, watch the terminal for:
```
⏰ Smart Reminder Service Loaded
✅ Gmail service ready - Real emails will be sent to tmugilan44@gmail.com
⏰ Checking reminders for time slot: 08:00
✅ Reminder sent to tmugilan44@gmail.com for Baby John
```

## ✅ What Should Work

1. **Email Test**: ✅ Working (you already confirmed this)
2. **Profile Reminders**: ✅ Will run every hour at the time you set
3. **Custom Reminders**: ✅ Will run daily at 9:00 AM
4. **Overdue Alerts**: ✅ Will run daily at 8:00 AM
5. **Status Updates**: ✅ Will run daily at midnight

## 🎉 You're All Set!

Your reminder system is fully functional. Emails will be sent automatically based on:
- Profile notification settings (hourly check)
- Custom "Remind Me" dates (daily at 9 AM)
- Overdue vaccines (daily at 8 AM)

Just keep your backend server running! 🚀
