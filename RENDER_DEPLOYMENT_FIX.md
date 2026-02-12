# 🔧 Render Deployment Fix - Production Ready

## What Was Fixed

### 1. **Startup Sequence** ✅
Changed from:
```javascript
import "./services/reminderService.js";  // ❌ Runs immediately
connectDB();  // ❌ Async, not awaited
```

To:
```javascript
async function startServer() {
  await connectDB();  // ✅ Wait for DB first
  app.listen(PORT);   // ✅ Then start server
  await import("./services/reminderService.js");  // ✅ Then load cron jobs
}
```

### 2. **MongoDB Connection** ✅
- Added connection timeouts
- Added reconnection handlers
- Better error messages
- Throws error instead of process.exit()

### 3. **Cron Job Safety** ✅
Each cron job now checks if MongoDB is connected:
```javascript
if (mongoose.connection.readyState !== 1) {
  console.warn("⚠️  Skipping - MongoDB not connected");
  return;
}
```

### 4. **Error Handling** ✅
- Global error handler
- Uncaught exception handler
- Unhandled rejection handler
- Better logging

### 5. **Health Checks** ✅
Added endpoints:
- `GET /` - Basic status
- `GET /health` - Detailed health check

---

## Deploy to Render

### Step 1: Update Your Code

```bash
# Commit the fixes
git add .
git commit -m "Fix: Production-safe startup sequence for Render"
git push origin main
```

### Step 2: Render Configuration

1. **Go to Render Dashboard**
2. **Click your service**
3. **Settings → Build & Deploy:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Root Directory: Leave empty (or set to `backend`)

4. **Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/vaccine-reminder
   JWT_SECRET=qazwsxedc
   PORT=10000
   EMAIL_USER=tmugilan44@gmail.com
   EMAIL_PASS=jhjwloqxgjrfkuqx
   NODE_ENV=production
   ```

5. **Click "Manual Deploy" → "Deploy latest commit"**

---

## What to Expect in Logs

### ✅ Successful Startup:
```
-----------------------------------
📧 Email Config Check:
USER = tmugilan44@gmail.com
PASS = OK (Hidden)
NODE_ENV = production
-----------------------------------
🔄 Starting server...
📦 Connecting to MongoDB...
✅ MongoDB connected
✅ MongoDB Connected: cluster0-shard-00-00.yhioq.mongodb.net
🚀 Server running on Port 10000
🌍 Environment: production
⏰ Initializing reminder service...
⏰ Smart Reminder Service Loaded
📋 Active Cron Jobs:
   - Profile reminders: Every hour (0 * * * *)
   - Custom reminders: Every hour (0 * * * *)
   - Overdue alerts: Daily at 8 AM (0 8 * * *)
   - Status updates: Daily at midnight (0 0 * * *)
✅ Reminder service loaded
✅ Gmail service ready - Real emails will be sent to tmugilan44@gmail.com
```

### ❌ If You See Errors:
```
❌ MongoDB Connection Error:
   Message: connect ETIMEDOUT
   URI: Set
```
**Fix:** Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

---

## Test After Deployment

### 1. Health Check
```bash
curl https://your-app.onrender.com/
```
**Expected:**
```json
{
  "status": "ok",
  "message": "Vaccine Reminder API is running",
  "timestamp": "2026-02-12T..."
}
```

### 2. Test Email
```bash
curl https://your-app.onrender.com/test-email
```
**Expected:** `✔ Mail Sent Successfully`

### 3. Trigger Reminders
```bash
curl https://your-app.onrender.com/trigger-reminders
```
**Expected:**
```json
{
  "success": true,
  "currentTime": "14:30",
  "totalFound": 2,
  "matching": 1,
  "sent": 1,
  "results": ["✅ Sent to..."]
}
```

---

## MongoDB Atlas Configuration

### CRITICAL: IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Network Access"
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere"
5. Enter: `0.0.0.0/0`
6. Click "Confirm"

**Why:** Render uses dynamic IPs, so you need to allow all IPs.

---

## Render Free Tier Limitations

### Sleep After Inactivity
- Free tier sleeps after 15 minutes of no requests
- First request after sleep takes 30-60 seconds
- Cron jobs may not run while sleeping

### Solutions:

#### Option 1: UptimeRobot (Free)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-app.onrender.com/health`
   - Interval: 5 minutes
3. This keeps your app awake

#### Option 2: Upgrade to Paid ($7/month)
- Always-on, no sleep
- Better for production
- Guaranteed cron job execution

---

## Troubleshooting

### Issue: "Exited with status 1"

**Check Logs For:**
1. MongoDB connection error → Fix IP whitelist
2. Missing environment variables → Add them in Render
3. Import errors → Check file paths

**Common Causes:**
- MongoDB URI missing or wrong
- Email credentials missing
- Syntax error in code

### Issue: "502 Bad Gateway"

**Causes:**
- App is starting up (wait 30-60 seconds)
- App crashed (check logs)
- MongoDB connection timeout

**Fix:**
1. Check Render logs for errors
2. Verify MongoDB Atlas is accessible
3. Test locally first: `npm start`

### Issue: Cron jobs not running

**Causes:**
- App is sleeping (free tier)
- MongoDB not connected
- Timezone issues

**Fix:**
1. Use UptimeRobot to keep awake
2. Check logs for MongoDB connection
3. Cron runs in UTC timezone

---

## Environment Variables Checklist

```bash
# Required
MONGO_URI=mongodb+srv://...  # ✅ Must include database name
JWT_SECRET=...               # ✅ Any random string
PORT=10000                   # ✅ Render uses 10000
EMAIL_USER=...               # ✅ Gmail address
EMAIL_PASS=...               # ✅ Gmail App Password (16 chars)

# Optional
NODE_ENV=production          # ✅ Recommended
```

---

## Post-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] MongoDB IP whitelist configured (0.0.0.0/0)
- [ ] Deployment successful (check logs)
- [ ] Health check works (`/health`)
- [ ] Test email works (`/test-email`)
- [ ] API routes work (test login/register)
- [ ] Cron jobs initialized (check logs)
- [ ] UptimeRobot configured (optional)
- [ ] Frontend updated with backend URL

---

## Success Indicators

✅ **Logs show:**
- MongoDB Connected
- Server running on Port 10000
- Reminder service loaded
- Gmail service ready

✅ **Endpoints work:**
- `/` returns status
- `/health` returns health info
- `/test-email` sends email
- `/api/users/register` works

✅ **No crashes:**
- Service stays running
- No "Exited with status 1"
- No 502 errors

---

## Next Steps

1. **Update Frontend:**
   ```javascript
   // frontend/src/api/api.js
   const API = axios.create({
     baseURL: "https://your-backend.onrender.com"
   });
   ```

2. **Deploy Frontend to Vercel:**
   - Follow DEPLOYMENT_GUIDE.md
   - Add backend URL to environment variables

3. **Test End-to-End:**
   - Register user
   - Add profile
   - Add vaccine
   - Set reminder
   - Check email

---

## Support

If issues persist:
1. Check Render logs (click "Logs" tab)
2. Test locally: `cd backend && npm start`
3. Verify MongoDB Atlas connection
4. Check all environment variables are set

Your backend should now be stable on Render! 🚀
