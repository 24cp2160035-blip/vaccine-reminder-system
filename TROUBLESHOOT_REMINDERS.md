# 🔧 Troubleshooting Custom Reminders

## Quick Debug Steps

### Step 1: Check if vaccine is in database
```bash
cd backend
node test-custom-reminder-now.js
```

This will show:
- ✅ All vaccines with reminders for today
- ✅ Their reminder times
- ✅ Whether they match current time
- ✅ Send emails immediately if they match

### Step 2: Check server logs

When your backend is running, you should see:
```
⏰ Smart Reminder Service Loaded
📋 Active Cron Jobs:
   - Profile reminders: Every hour (0 * * * *)
   - Custom reminders: Every hour (0 * * * *)
   - Overdue alerts: Daily at 8 AM (0 8 * * *)
   - Status updates: Daily at midnight (0 0 * * *)
```

Every hour at :00, you should see:
```
🔔 Checking custom 'Remind Me' dates for time: 14:00...
Found 2 total vaccines with reminders for today
Filtered to 1 vaccines matching time 14:00
📤 Sending reminder to user@email.com for Flu Shot at 14:00
✅ Custom reminder sent to user@email.com for Flu Shot at 14:00
```

## Common Issues

### Issue 1: "No vaccines found with reminders for today"

**Cause**: No vaccine has `remindMeDate` set to today

**Fix**:
1. Go to your app
2. Add a vaccine
3. Set "Remind Me On" to TODAY's date
4. Set "Remind Me At" to current time (or leave empty for 9 AM)
5. Save

### Issue 2: "Found vaccines but filtered to 0"

**Cause**: Time doesn't match

**Example**:
```
Current time: 14:30
Vaccine reminder time: 14:00
Result: No match ❌
```

**Fix**:
- Cron runs at the TOP of each hour (14:00, 15:00, etc.)
- Set reminder time to match: 14:00, 15:00, etc.
- Or wait until the next hour

### Issue 3: "Email not sending"

**Cause**: Email service issue

**Fix**:
```bash
cd backend
node test-email.js
```

If this fails, check:
- EMAIL_USER in .env
- EMAIL_PASS in .env (must be App Password)
- Gmail 2FA is enabled

### Issue 4: "Cron not running"

**Cause**: Server not started or crashed

**Fix**:
1. Make sure backend is running: `cd backend && npm start`
2. Check for errors in terminal
3. Restart server if needed

## Testing Strategy

### Test 1: Immediate Test (Manual)
```bash
cd backend
node test-custom-reminder-now.js
```
This sends emails RIGHT NOW if conditions match.

### Test 2: Wait for Cron (Automatic)
1. Add vaccine with reminder time = current hour + 1
2. Wait for next hour
3. Check email

### Test 3: Use Current Time
1. Check current time (e.g., 14:30)
2. Add vaccine with reminder time = 15:00 (next hour)
3. Wait 30 minutes
4. Check email at 15:00

## Debug Checklist

- [ ] Backend server is running
- [ ] Email test works (`node test-email.js`)
- [ ] Vaccine exists in database with remindMeDate = today
- [ ] Vaccine has remindMeTime set (or empty for 9 AM default)
- [ ] Current time matches reminder time (or is 9:00 AM for empty time)
- [ ] reminderSent = false (not already sent)
- [ ] Vaccine status ≠ "completed"
- [ ] Profile exists and is populated
- [ ] User exists with valid email

## Expected Behavior

### Scenario 1: Time Set
```
Vaccine:
├─ remindMeDate: Feb 12, 2026 (today)
├─ remindMeTime: "14:00"
└─ reminderSent: false

System:
├─ At 14:00: ✅ Email sent
├─ At 14:30: ❌ No email (already sent)
└─ At 15:00: ❌ No email (already sent)
```

### Scenario 2: No Time Set
```
Vaccine:
├─ remindMeDate: Feb 12, 2026 (today)
├─ remindMeTime: null or ""
└─ reminderSent: false

System:
├─ At 08:00: ❌ No email (waiting for 9 AM)
├─ At 09:00: ✅ Email sent (default time)
└─ At 10:00: ❌ No email (already sent)
```

### Scenario 3: Wrong Time
```
Vaccine:
├─ remindMeDate: Feb 12, 2026 (today)
├─ remindMeTime: "14:00"
└─ reminderSent: false

System at 15:00:
└─ ❌ No email (time doesn't match)
```

## Quick Fixes

### Fix 1: Force Send Now
Edit `backend/services/reminderService.js` temporarily:

Change:
```javascript
cron.schedule("0 * * * *", async () => {  // Every hour
```

To:
```javascript
cron.schedule("* * * * *", async () => {  // Every minute (TESTING ONLY!)
```

⚠️ **Remember to change it back!**

### Fix 2: Check Database Directly
```javascript
// Add this to test-custom-reminder-now.js
console.log("Raw vaccine data:");
console.log(JSON.stringify(vaccine, null, 2));
```

### Fix 3: Manual Email Send
```javascript
// In test-custom-reminder-now.js, remove the time check:
const vaccinesWithReminders = allVaccinesForToday; // Send to ALL
```

## Still Not Working?

Run this complete diagnostic:

```bash
cd backend

# 1. Test email service
node test-email.js

# 2. Test reminder system
node test-reminder-system.js

# 3. Test custom reminders
node test-custom-reminder-now.js

# 4. Check server logs
npm start
# (Watch for cron job messages)
```

If all tests pass but cron doesn't work:
- Restart your backend server
- Check system time is correct
- Verify cron syntax in reminderService.js

## Contact Info

If you're still stuck, check:
1. Server terminal for error messages
2. Browser console for frontend errors
3. Database to verify vaccine was saved correctly
