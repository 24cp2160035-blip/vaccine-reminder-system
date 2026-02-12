# 🔧 Fix Email Reminders - Step by Step

## Step 1: Test Basic Email (MUST WORK FIRST)

```bash
cd backend
node test-email.js
```

**Expected:** You receive an email at `tmugilan44@gmail.com`

**If this fails:** Your email credentials are wrong. Fix this FIRST before continuing.

---

## Step 2: Force Send a Reminder (Ignore Time Matching)

```bash
cd backend
node force-send-reminder.js
```

**What it does:**
- Finds ANY vaccine with a remindMeDate set
- Sends email immediately (ignores time matching)
- Shows detailed debug info

**Expected:** You receive a test reminder email

**If this fails:** 
- Check if you have any vaccines with "Remind Me On" date set
- Check the error message for details

---

## Step 3: Test via Browser (Manual Trigger)

1. Make sure your backend is running: `cd backend && npm start`
2. Open browser and go to: `http://localhost:5050/trigger-reminders`

**What it shows:**
```json
{
  "success": true,
  "currentTime": "14:30",
  "totalFound": 2,
  "matching": 1,
  "sent": 1,
  "results": [
    "✅ Sent to tmugilan44@gmail.com for Flu Shot"
  ]
}
```

**This tells you:**
- Current time
- How many vaccines have reminders for today
- How many match the current time
- Which emails were sent

---

## Step 4: Add a Test Vaccine

1. Go to your app (http://localhost:3000)
2. Login
3. Go to any profile's Vaccines page
4. Click "➕ Add Vaccine"
5. Fill in:
   - Vaccine name: "Test Reminder"
   - Due date: Tomorrow
   - **🔔 Remind Me On: TODAY** (very important!)
   - **⏰ Remind Me At: Leave EMPTY** (will default to 9:00 AM)
6. Click Save

---

## Step 5: Check What Time It Is

The cron job runs at the TOP of each hour:
- 08:00, 09:00, 10:00, 11:00, etc.

**Current time format:** HH:MM (24-hour)
- 2:00 PM = 14:00
- 9:00 AM = 09:00

---

## Step 6: Set Correct Time

### Option A: Test at 9 AM
1. Add vaccine with "Remind Me On" = TODAY
2. Leave "Remind Me At" EMPTY
3. Wait until 9:00 AM
4. Check email

### Option B: Test at Current Hour
1. Check current time (e.g., 2:45 PM)
2. Next full hour is 3:00 PM (15:00)
3. Add vaccine with:
   - "Remind Me On" = TODAY
   - "Remind Me At" = 15:00
4. Wait until 3:00 PM
5. Check email

### Option C: Force Send Now
```bash
cd backend
node force-send-reminder.js
```

---

## Step 7: Check Server Logs

When your backend is running, watch for:

```
⏰ Smart Reminder Service Loaded
📋 Active Cron Jobs:
   - Profile reminders: Every hour (0 * * * *)
   - Custom reminders: Every hour (0 * * * *)
```

At the top of each hour (e.g., 14:00), you should see:
```
🔔 Checking custom 'Remind Me' dates for time: 14:00...
Found 1 total vaccines with reminders for today
Filtered to 1 vaccines matching time 14:00
📤 Sending reminder to tmugilan44@gmail.com for Test Reminder at 14:00
✅ Custom reminder sent to tmugilan44@gmail.com for Test Reminder at 14:00
```

---

## Common Problems & Solutions

### Problem 1: "No vaccines found"
**Solution:** Add a vaccine with "Remind Me On" = TODAY

### Problem 2: "Found vaccines but filtered to 0"
**Reason:** Time doesn't match

**Example:**
- Current time: 14:30
- Vaccine time: 14:00
- Result: No match (cron already ran at 14:00)

**Solution:** 
- Set time to NEXT full hour (15:00)
- Or run `node force-send-reminder.js` to ignore time

### Problem 3: "Email sent but not received"
**Check:**
1. Spam folder
2. Email address is correct
3. Gmail isn't blocking

### Problem 4: "Cron not running"
**Solution:**
1. Restart backend: `cd backend && npm start`
2. Check for errors in terminal
3. Verify reminderService.js is imported in server.js

---

## Quick Debug Commands

```bash
# Test basic email
cd backend && node test-email.js

# Force send reminder (ignore time)
cd backend && node force-send-reminder.js

# Check what's in database
cd backend && node test-custom-reminder-now.js

# Manual trigger via browser
# Open: http://localhost:5050/trigger-reminders
```

---

## Expected Flow

```
1. User adds vaccine
   ├─ remindMeDate: Feb 12, 2026
   └─ remindMeTime: "14:00"

2. Cron runs at 14:00
   ├─ Finds vaccine
   ├─ Time matches: 14:00 = 14:00 ✓
   ├─ Sends email
   └─ Sets reminderSent = true

3. User receives email
   └─ Subject: "🔔 Custom Reminder: [Vaccine] for [Profile]"

4. Cron runs at 15:00
   └─ Skips vaccine (reminderSent = true)
```

---

## Still Not Working?

Run ALL tests in order:

```bash
cd backend

# 1. Basic email
node test-email.js

# 2. Force send
node force-send-reminder.js

# 3. Check database
node test-custom-reminder-now.js

# 4. Start server and check logs
npm start
```

Then:
1. Add a vaccine with "Remind Me On" = TODAY
2. Set "Remind Me At" = NEXT FULL HOUR
3. Go to: http://localhost:5050/trigger-reminders
4. Check the JSON response

If `"sent": 1`, check your email!
If `"sent": 0`, check `"matching"` - if 0, time doesn't match yet.

---

## Emergency: Send Email Right Now

```bash
cd backend
node force-send-reminder.js
```

This will send an email immediately to test the system, ignoring all time checks.
