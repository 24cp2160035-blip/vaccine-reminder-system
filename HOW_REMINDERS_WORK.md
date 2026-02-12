# 📧 How Email Reminders Work

## Current Status

Right now, your reminders are being **logged to the backend console** instead of sent as real emails because Gmail authentication needs to be fixed.

## How the Reminder System Works

### 1. Automatic Checks (3 Cron Jobs)

**Hourly Check (Every hour at :00 minutes)**
- Scans all profiles with reminders enabled
- Checks if current time matches the profile's reminder time
- Finds vaccines due in X days (based on profile settings)
- Sends email notification

**Midnight Check (Every day at 00:00)**
- Updates all pending vaccines past their due date to "overdue"
- Keeps your vaccine statuses accurate

**Morning Alert (Every day at 08:00)**
- Finds all overdue vaccines
- Sends urgent notification emails
- Groups by user for efficiency

### 2. How to Set Up Reminders

**For Each Profile:**
1. Go to a profile page
2. Click "Notification Settings" (or similar button)
3. Configure:
   - **Reminder Time**: What time to send (e.g., 09:00 for 9 AM)
   - **Days Before**: How many days before due date (e.g., 3 days)
   - **Enable/Disable**: Turn reminders on/off

**Example:**
- Reminder Time: 09:00
- Days Before: 3
- Vaccine Due: January 20, 2026

**Result:** You'll get an email on January 17, 2026 at 9:00 AM

### 3. Where Reminders Appear

**Currently (Test Mode):**
- ✅ Backend console (terminal where you ran `npm start`)
- You'll see: `📧 [EMAIL WOULD BE SENT]`

**After Fixing Gmail:**
- ✅ Your email inbox (tmugilan44@gmail.com)
- ✅ HTML formatted emails with vaccine details
- ✅ Professional looking notifications

## 🔧 How to Get Real Emails

### Option 1: Fix Gmail (Recommended - 2 minutes)

1. **Generate Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Enable 2-Step Verification if not already enabled
   - Generate new app password for "Mail"
   - Copy the 16-character password (remove spaces)

2. **Update backend/.env:**
   ```env
   EMAIL_PASS=your16characterpassword
   ```

3. **Restart Backend:**
   ```bash
   # In backend terminal, press Ctrl+C, then:
   npm start
   ```

4. **Verify It Works:**
   - Visit: http://localhost:5050/test-email
   - Check your inbox for test email
   - Should see: ✅ Gmail service ready

### Option 2: Keep Test Mode

- Reminders will be logged to console
- You can see what would be sent
- All other features work perfectly
- Good for development/testing

## 🧪 Testing Reminders

### Quick Test (Without Waiting)

1. **Create a Profile**
2. **Set Reminder Time to Current Time**
   - If it's 2:30 PM now, set reminder to "14:30"
3. **Add a Vaccine Due in 3 Days**
   - Set due date to 3 days from today
4. **Wait for Next Hour**
   - Cron runs every hour at :00
   - Or modify cron to run every minute (see below)

### Modify Cron for Instant Testing

Edit `backend/services/reminderService.js`:

```javascript
// Change from hourly to every minute (line ~18)
cron.schedule("* * * * *", async () => {
  // ... rest of code
```

**Remember to change it back to `"0 * * * *"` after testing!**

## 📊 Reminder Examples

### Example 1: Upcoming Vaccine
```
To: tmugilan44@gmail.com
Subject: 🔔 Vaccine Reminder for Baby Arjun

Hi Mugilan,

This is a reminder for Baby Arjun's upcoming vaccination(s):

• Pentavalent-2 - Due: Jan 20, 2026
  Doctor: Dr. Smith

Please schedule an appointment if you haven't already.
```

### Example 2: Overdue Alert
```
To: tmugilan44@gmail.com
Subject: ⚠️ URGENT: Overdue Vaccinations

Hi Mugilan,

⚠️ You have overdue vaccinations:

• BCG for Baby Arjun - Was due: Jan 10, 2026
• Rabies for Max - Was due: Jan 15, 2026

Please schedule appointments immediately.
```

## 🎯 Best Practices

1. **Set Realistic Reminder Times**
   - Choose a time when you check email (e.g., 8 AM or 6 PM)
   - Same time for all profiles or customize per profile

2. **Days Before Setting**
   - 3 days: Good for planning appointments
   - 7 days: Better for busy schedules
   - 1 day: Last-minute reminder

3. **Multiple Profiles**
   - Each profile can have different settings
   - Baby might need 7 days notice
   - Pet might need 3 days notice

4. **Check Dashboard Regularly**
   - See overdue/due today/upcoming at a glance
   - Don't rely only on emails

## 🐛 Troubleshooting

**Not Receiving Emails?**
1. Check backend console for "✅ Gmail service ready"
2. Verify reminder time matches current hour
3. Ensure vaccine is due in X days (based on settings)
4. Check spam folder
5. Verify email address is correct

**Emails Going to Console Instead?**
- This is normal if Gmail auth failed
- Follow "Option 1: Fix Gmail" above
- Or keep using test mode

**Want to Test Immediately?**
- Set reminder time to current time
- Add vaccine due in configured days
- Wait for next hour (or modify cron)

## 📝 Summary

✅ **Reminders work automatically** - No manual action needed  
✅ **3 types of notifications** - Upcoming, overdue, daily alerts  
✅ **Customizable per profile** - Time and frequency  
✅ **Currently in test mode** - Logged to console  
🔧 **Fix Gmail for real emails** - 2-minute setup  

---

**Your reminder system is fully functional!** It's just logging to console instead of sending emails. Fix Gmail authentication to get real email notifications.
