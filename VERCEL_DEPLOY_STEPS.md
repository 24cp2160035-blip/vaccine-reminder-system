# 🚀 Deploy Frontend to Vercel - Step by Step

## Prerequisites ✅
- Backend is live: https://vaccine-reminder-system.onrender.com
- Code is pushed to GitHub
- Frontend configured with production API URL

---

## Step 1: Go to Vercel

1. Open [vercel.com](https://vercel.com) in your browser
2. Click "Sign Up" (or "Login" if you have an account)
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

---

## Step 2: Import Your Project

1. Click "Add New..." button (top right)
2. Click "Project"
3. Find your repository: `vaccine-reminder-system`
4. Click "Import"

---

## Step 3: Configure Project Settings

### Framework Preset
- **Select:** Create React App
- (Vercel should auto-detect this)

### Root Directory
- Click "Edit" next to Root Directory
- Enter: `frontend`
- Click "Continue"

### Build and Output Settings
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `build` (auto-filled)
- **Install Command:** `npm install` (auto-filled)

Leave these as default - Vercel knows how to build React apps!

---

## Step 4: Environment Variables

Click "Environment Variables" section

Add this variable:

**Key:** `REACT_APP_API_URL`
**Value:** `https://vaccine-reminder-system.onrender.com`

Click "Add"

---

## Step 5: Deploy!

1. Click "Deploy" button
2. Wait 2-3 minutes while Vercel:
   - Installs dependencies
   - Builds your React app
   - Deploys to CDN

You'll see a progress screen with logs.

---

## Step 6: Success! 🎉

When deployment completes, you'll see:

```
🎉 Congratulations!
Your project has been deployed
```

You'll get a URL like:
```
https://vaccine-reminder-system.vercel.app
```

Click "Visit" to see your live app!

---

## Step 7: Test Your App

1. **Visit your Vercel URL**
2. **Register a new account**
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!

3. **Login**

4. **Add a profile**
   - Name: Baby John
   - Type: Child
   - Date of Birth: 2024-01-01

5. **Add a vaccine**
   - Vaccine: MMR
   - Due Date: Tomorrow
   - Doctor: Dr. Smith

6. **Check Dashboard**
   - Should show statistics
   - Should show upcoming vaccines

---

## Troubleshooting

### Issue: "Network Error" or "Failed to fetch"

**Cause:** Backend URL is wrong or backend is down

**Fix:**
1. Check backend is running: https://vaccine-reminder-system.onrender.com
2. Check environment variable in Vercel:
   - Go to Project Settings → Environment Variables
   - Verify `REACT_APP_API_URL` is correct
   - Redeploy if you changed it

### Issue: "CORS Error" in browser console

**Cause:** Backend doesn't allow your Vercel domain

**Fix:**
1. Backend already allows all `.vercel.app` domains
2. If still failing, check Render logs for CORS errors

### Issue: Build fails

**Cause:** Missing dependencies or build errors

**Fix:**
1. Check build logs in Vercel
2. Make sure `frontend/package.json` has all dependencies
3. Test build locally: `cd frontend && npm run build`

---

## Update Backend CORS (Optional)

If you want to restrict CORS to only your Vercel URL:

1. Go to Render → Your Service → Environment
2. Add variable:
   ```
   FRONTEND_URL=https://vaccine-reminder-system.vercel.app
   ```
3. Backend will automatically allow this domain

---

## Custom Domain (Optional)

Want to use your own domain like `vaccinereminder.com`?

1. Go to Vercel → Your Project → Settings → Domains
2. Click "Add"
3. Enter your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

---

## Auto-Deploy on Push

Vercel automatically redeploys when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys! 🚀
```

---

## Your Live URLs

**Frontend:** https://vaccine-reminder-system.vercel.app (your actual URL)
**Backend:** https://vaccine-reminder-system.onrender.com

---

## What Works

✅ User registration and login
✅ Profile management (add/edit/delete)
✅ Vaccine tracking (add/edit/delete)
✅ Dashboard with statistics
✅ Notification settings
✅ Export vaccination history
✅ Custom reminders (date and time)
⚠️ Email notifications (blocked on Render free tier)

---

## Next Steps

1. **Test all features** on production
2. **Share your app** with friends/family
3. **Add SendGrid** for email notifications (optional)
4. **Set up UptimeRobot** to keep backend awake
5. **Add custom domain** (optional)

---

## Cost Summary

- **Frontend (Vercel):** Free ✅
- **Backend (Render):** Free ✅
- **Database (MongoDB Atlas):** Free ✅
- **Total:** $0/month 🎉

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Check Network tab in DevTools
4. Verify backend is running
5. Check environment variables

---

## Congratulations! 🎊

Your full-stack Vaccine Reminder System is now live!

Share it with the world! 🚀
