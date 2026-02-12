# 🚀 Deploy Frontend to Vercel

## Your Backend is Live! ✅
```
https://vaccine-reminder-system.onrender.com
```

## Now Deploy Frontend

### Step 1: Go to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository: `vaccine-reminder-system`

### Step 2: Configure Project

**Framework Preset:** Create React App

**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `build`

**Install Command:** `npm install`

### Step 3: Environment Variables

Click "Environment Variables" and add:

```
REACT_APP_API_URL=https://vaccine-reminder-system.onrender.com
```

### Step 4: Deploy

Click "Deploy"

Wait 2-3 minutes...

### Step 5: Get Your URL

After deployment, you'll get a URL like:
```
https://vaccine-reminder-system.vercel.app
```

## Test Your App

1. Visit your Vercel URL
2. Register a new account
3. Login
4. Add a profile
5. Add a vaccine
6. Set a reminder
7. Check your email!

## Update Backend CORS (Optional)

If you want to restrict CORS to only your Vercel URL:

1. Go to Render → Your Service → Environment
2. Add new variable:
   ```
   FRONTEND_URL=https://vaccine-reminder-system.vercel.app
   ```
3. Save changes

## Troubleshooting

### Issue: "Network Error" in frontend

**Check:**
1. Backend URL is correct in Vercel env vars
2. Backend is running (visit backend URL)
3. CORS allows your Vercel domain

**Fix:**
- Verify `REACT_APP_API_URL` in Vercel
- Check Render logs for CORS errors

### Issue: Can't login/register

**Check:**
1. API calls are going to correct backend
2. Check browser console for errors
3. Check Network tab in DevTools

**Fix:**
- Make sure backend URL doesn't have trailing slash
- Check MongoDB is connected (Render logs)

## Your App is Live! 🎉

**Backend:** https://vaccine-reminder-system.onrender.com
**Frontend:** https://your-app.vercel.app (after deployment)

Share it with users and enjoy! 🚀

## Keep Backend Awake (Optional)

Render free tier sleeps after 15 minutes.

**Use UptimeRobot:**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - URL: `https://vaccine-reminder-system.onrender.com/health`
   - Interval: 5 minutes
3. This keeps your backend awake 24/7

## Cost Summary

- **Backend (Render):** Free
- **Frontend (Vercel):** Free
- **Database (MongoDB Atlas):** Free
- **Total:** $0/month 🎉

## Next Steps

1. Test all features on production
2. Set up UptimeRobot to keep backend awake
3. Share your app!
4. Monitor Render logs for any issues

Congratulations on deploying your full-stack app! 🎊
