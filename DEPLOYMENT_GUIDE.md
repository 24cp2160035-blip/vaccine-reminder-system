# 🚀 Deployment Guide - Vaccine Reminder System

## Overview

Your app has 3 parts that need to be deployed:
1. **Frontend** (React) → Vercel or Netlify
2. **Backend** (Node.js/Express) → Render or Railway
3. **Database** (MongoDB) → Already on MongoDB Atlas ✅

---

## Option 1: Deploy to Render + Vercel (Recommended)

### Step 1: Prepare Your Code

#### A. Update Backend for Production

1. **Create `.gitignore` in backend folder:**
```bash
cd backend
```

Create `backend/.gitignore`:
```
node_modules/
.env
.DS_Store
test-*.js
```

2. **Add production scripts to `backend/package.json`:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### B. Update Frontend API URL

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Update `frontend/src/api/api.js`:
```javascript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5050",
});

// ... rest of code
```

---

### Step 2: Deploy Backend to Render

1. **Go to [Render.com](https://render.com)** and sign up (free)

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository** (or upload code)

4. **Configure:**
   - Name: `vaccine-reminder-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Instance Type: `Free`

5. **Add Environment Variables:**
   Click "Environment" and add:
   ```
   MONGO_URI=mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/
   JWT_SECRET=qazwsxedc
   PORT=5050
   EMAIL_USER=tmugilan44@gmail.com
   EMAIL_PASS=jhjwloqxgjrfkuqx
   NODE_ENV=production
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL** (e.g., `https://vaccine-reminder-backend.onrender.com`)

---

### Step 3: Deploy Frontend to Vercel

1. **Update `frontend/src/api/api.js`:**
```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://vaccine-reminder-backend.onrender.com",
});
```

2. **Go to [Vercel.com](https://vercel.com)** and sign up (free)

3. **Click "Add New" → "Project"**

4. **Import your repository**

5. **Configure:**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

6. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://vaccine-reminder-backend.onrender.com
   ```

7. **Click "Deploy"**

8. **Wait for deployment** (2-3 minutes)

9. **Your app is live!** (e.g., `https://vaccine-reminder.vercel.app`)

---

### Step 4: Update Backend CORS

Update `backend/server.js`:
```javascript
app.use(cors({ 
  origin: [
    "http://localhost:3000",
    "https://vaccine-reminder.vercel.app",  // Your Vercel URL
    "https://*.vercel.app"  // Allow all Vercel preview deployments
  ], 
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
```

Redeploy backend on Render (it will auto-deploy if connected to GitHub).

---

## Option 2: Deploy to Railway (Alternative)

### Backend on Railway

1. **Go to [Railway.app](https://railway.app)** and sign up

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Configure:**
   - Root Directory: `backend`
   - Start Command: `npm start`

5. **Add Environment Variables** (same as above)

6. **Generate Domain** → Copy the URL

### Frontend on Vercel (same as above)

---

## Option 3: All-in-One on Render

You can deploy both frontend and backend on Render:

### Backend: Web Service (as above)

### Frontend: Static Site

1. **Click "New +" → "Static Site"**

2. **Configure:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

3. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=https://vaccine-reminder-backend.onrender.com
   ```

---

## Important: MongoDB Atlas Setup

Your MongoDB is already configured, but ensure:

1. **Go to MongoDB Atlas Dashboard**

2. **Network Access:**
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Database User:**
   - Verify user `tmugilan44` exists
   - Password: `VaccineApp2026`

---

## Post-Deployment Checklist

- [ ] Backend is running (visit `https://your-backend.onrender.com/test-email`)
- [ ] Frontend loads (visit your Vercel URL)
- [ ] Login works
- [ ] Can add profiles
- [ ] Can add vaccines
- [ ] Email reminders work (check Render logs)
- [ ] CORS is configured correctly
- [ ] MongoDB connection works

---

## Monitoring & Logs

### Render Logs:
1. Go to your Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Watch for cron job messages:
   ```
   ⏰ Checking reminders for time: 14:00...
   ✅ Reminder sent to user@email.com
   ```

### Vercel Logs:
1. Go to your Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Click on latest deployment
5. View build and runtime logs

---

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., `vaccinereminder.com`)
3. Update DNS records as instructed

### For Render (Backend):
1. Go to Service Settings → Custom Domain
2. Add your domain (e.g., `api.vaccinereminder.com`)
3. Update DNS records as instructed

---

## Troubleshooting

### Issue: "Network Error" in frontend
**Fix:** Check CORS settings in backend and API URL in frontend

### Issue: Cron jobs not running
**Fix:** Render free tier may sleep after inactivity. Upgrade to paid tier or use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes.

### Issue: MongoDB connection failed
**Fix:** Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

### Issue: Emails not sending
**Fix:** Check environment variables are set correctly on Render

---

## Cost Breakdown

### Free Tier (Recommended for Testing):
- **MongoDB Atlas:** Free (512 MB)
- **Render:** Free (750 hours/month, sleeps after 15 min inactivity)
- **Vercel:** Free (unlimited deployments)
- **Total:** $0/month

### Paid Tier (For Production):
- **MongoDB Atlas:** $9/month (Shared M2)
- **Render:** $7/month (always-on, no sleep)
- **Vercel:** Free (or $20/month for Pro)
- **Total:** ~$16-36/month

---

## Quick Deploy Commands

```bash
# 1. Prepare backend
cd backend
echo "node_modules/\n.env\n.DS_Store\ntest-*.js" > .gitignore

# 2. Prepare frontend
cd ../frontend
echo "REACT_APP_API_URL=https://your-backend-url.onrender.com" > .env.production

# 3. Commit changes
git add .
git commit -m "Prepare for deployment"
git push origin main

# 4. Deploy on Render and Vercel (via their dashboards)
```

---

## Environment Variables Summary

### Backend (.env on Render):
```
MONGO_URI=mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/
JWT_SECRET=qazwsxedc
PORT=5050
EMAIL_USER=tmugilan44@gmail.com
EMAIL_PASS=jhjwloqxgjrfkuqx
NODE_ENV=production
```

### Frontend (.env.production on Vercel):
```
REACT_APP_API_URL=https://vaccine-reminder-backend.onrender.com
```

---

## Next Steps After Deployment

1. **Test all features** on production
2. **Set up monitoring** (UptimeRobot for backend health checks)
3. **Enable HTTPS** (automatic on Render and Vercel)
4. **Share your app** with users!

---

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for API errors
4. Verify environment variables are set correctly

Your app is ready to go live! 🚀
