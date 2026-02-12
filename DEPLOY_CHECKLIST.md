# 🚀 Quick Deployment Checklist

## Pre-Deployment (5 minutes)

### 1. Update Frontend API URL
```bash
cd frontend
```

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Update `frontend/src/api/api.js`:
```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5050",
});
```

### 2. Update Backend CORS
Edit `backend/server.js`:
```javascript
app.use(cors({ 
  origin: [
    "http://localhost:3000",
    "https://vaccine-reminder.vercel.app",  // Add your Vercel URL
    "https://*.vercel.app"
  ], 
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
```

### 3. Create .gitignore
```bash
cd backend
echo "node_modules/
.env
.DS_Store
test-*.js" > .gitignore
```

### 4. Commit Changes
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Deploy Backend to Render (10 minutes)

1. ☐ Go to [render.com](https://render.com) → Sign up
2. ☐ Click "New +" → "Web Service"
3. ☐ Connect GitHub repository
4. ☐ Configure:
   - Name: `vaccine-reminder-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. ☐ Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/
   JWT_SECRET=qazwsxedc
   PORT=5050
   EMAIL_USER=tmugilan44@gmail.com
   EMAIL_PASS=jhjwloqxgjrfkuqx
   NODE_ENV=production
   ```
6. ☐ Click "Create Web Service"
7. ☐ Wait for deployment (5-10 min)
8. ☐ Copy backend URL (e.g., `https://vaccine-reminder-backend.onrender.com`)

---

## Deploy Frontend to Vercel (5 minutes)

1. ☐ Update `frontend/.env.production` with backend URL
2. ☐ Go to [vercel.com](https://vercel.com) → Sign up
3. ☐ Click "Add New" → "Project"
4. ☐ Import repository
5. ☐ Configure:
   - Framework: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. ☐ Add Environment Variable:
   ```
   REACT_APP_API_URL=https://vaccine-reminder-backend.onrender.com
   ```
7. ☐ Click "Deploy"
8. ☐ Wait for deployment (2-3 min)
9. ☐ Copy frontend URL (e.g., `https://vaccine-reminder.vercel.app`)

---

## Update Backend CORS (2 minutes)

1. ☐ Update `backend/server.js` with your Vercel URL
2. ☐ Commit and push:
   ```bash
   git add backend/server.js
   git commit -m "Update CORS for production"
   git push origin main
   ```
3. ☐ Render will auto-redeploy (or click "Manual Deploy")

---

## Configure MongoDB Atlas (2 minutes)

1. ☐ Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. ☐ Click "Network Access"
3. ☐ Click "Add IP Address"
4. ☐ Click "Allow Access from Anywhere" (0.0.0.0/0)
5. ☐ Click "Confirm"

---

## Test Deployment (5 minutes)

### Backend Tests:
1. ☐ Visit: `https://your-backend.onrender.com/test-email`
   - Should see: "✔ Mail Sent Successfully"
   - Check email inbox

2. ☐ Visit: `https://your-backend.onrender.com/trigger-reminders`
   - Should see JSON response with reminder status

### Frontend Tests:
1. ☐ Visit: `https://your-frontend.vercel.app`
2. ☐ Register new account
3. ☐ Login
4. ☐ Add a profile
5. ☐ Add a vaccine
6. ☐ Set notification settings
7. ☐ Check dashboard

### Email Tests:
1. ☐ Add vaccine with "Remind Me On" = today
2. ☐ Set "Remind Me At" = next hour
3. ☐ Wait for email (or trigger manually)

---

## Monitor Logs

### Render Logs:
1. ☐ Go to Render dashboard
2. ☐ Click your service
3. ☐ Click "Logs"
4. ☐ Watch for:
   ```
   ⏰ Smart Reminder Service Loaded
   🔔 Checking reminders for time: 14:00...
   ✅ Reminder sent to user@email.com
   ```

---

## Optional: Keep Backend Awake

Render free tier sleeps after 15 minutes of inactivity.

### Option 1: UptimeRobot (Free)
1. ☐ Go to [uptimerobot.com](https://uptimerobot.com)
2. ☐ Sign up
3. ☐ Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend.onrender.com/test-email`
   - Interval: 5 minutes
4. ☐ Save

### Option 2: Upgrade Render ($7/month)
- Always-on, no sleep
- Better for production

---

## Troubleshooting

### ❌ "Network Error" in frontend
**Fix:** Check CORS in backend includes your Vercel URL

### ❌ MongoDB connection failed
**Fix:** Check MongoDB Atlas IP whitelist (0.0.0.0/0)

### ❌ Emails not sending
**Fix:** Check environment variables on Render

### ❌ Cron jobs not running
**Fix:** Backend may be sleeping. Use UptimeRobot or upgrade.

---

## Success! 🎉

Your app is now live at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com

Share it with users and enjoy! 🚀

---

## Estimated Time: 30 minutes total
- Pre-deployment: 5 min
- Backend deploy: 10 min
- Frontend deploy: 5 min
- Configuration: 5 min
- Testing: 5 min
