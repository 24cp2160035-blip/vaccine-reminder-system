# 🔧 Render Environment Variables - CRITICAL FIX

## The Problem

Your MongoDB URI is missing the database name at the end:
```
❌ WRONG: mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/
✅ RIGHT: mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/vaccine-reminder
```

## Fix in Render Dashboard

1. **Go to your Render service**
2. **Click "Environment" in left sidebar**
3. **Find `MONGO_URI` variable**
4. **Update it to:**
   ```
   mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/vaccine-reminder
   ```
   (Added `/vaccine-reminder` at the end)

5. **Click "Save Changes"**
6. **Service will auto-redeploy**

## All Environment Variables (Copy-Paste Ready)

```
MONGO_URI=mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/vaccine-reminder
JWT_SECRET=qazwsxedc
PORT=10000
EMAIL_USER=tmugilan44@gmail.com
EMAIL_PASS=jhjwloqxgjrfkuqx
NODE_ENV=production
```

## MongoDB Atlas IP Whitelist

**CRITICAL:** Make sure MongoDB Atlas allows Render's IPs

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere"
6. Enter: `0.0.0.0/0`
7. Description: "Render deployment"
8. Click "Confirm"

**Why:** Render uses dynamic IPs, so you must allow all IPs.

## Test Connection Locally

Before deploying, test the connection string:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/vaccine-reminder')
  .then(() => { console.log('✅ Connected'); process.exit(0); })
  .catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
"
```

## After Fixing

Push the updated db.js:
```bash
git add backend/config/db.js
git commit -m "Fix: Better MongoDB connection error handling"
git push origin main
```

Then update the environment variable in Render dashboard.

## Expected Logs After Fix

```
📦 Connecting to MongoDB...
Attempting to connect to MongoDB...
URI format check: ✓
✅ MongoDB Connected: cluster0-shard-00-00.yhioq.mongodb.net
✅ Database: vaccine-reminder
🚀 Server running on Port 10000
```

## If Still Failing

Check these in order:

1. **MongoDB Atlas IP Whitelist**
   - Must have 0.0.0.0/0 allowed
   - Check in Network Access tab

2. **MongoDB Atlas User**
   - Username: `tmugilan44`
   - Password: `VaccineApp2026`
   - Check in Database Access tab

3. **Connection String Format**
   - Must start with `mongodb+srv://`
   - Must include username and password
   - Must end with `/database-name`

4. **Render Environment Variables**
   - All variables set correctly
   - No extra spaces or quotes
   - Click "Save Changes" after editing

## Quick Fix Checklist

- [ ] Update MONGO_URI in Render to include `/vaccine-reminder`
- [ ] Save changes in Render
- [ ] Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- [ ] Push updated db.js to GitHub
- [ ] Wait for Render to redeploy
- [ ] Check logs for "✅ MongoDB Connected"

Your deployment should work after these fixes! 🚀
