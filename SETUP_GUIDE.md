# 🚀 Complete Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB Atlas account - [Sign up](https://www.mongodb.com/cloud/atlas)
- ✅ Gmail account with 2FA enabled
- ✅ Code editor (VS Code recommended)
- ✅ Terminal/Command Prompt

### 2. MongoDB Atlas Setup

1. **Create a Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

2. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Atlas Admin"
   - Click "Add User"

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `vaccineDB`

### 3. Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"
   - Follow the setup wizard

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "Vaccine Reminder System"
   - Click "Generate"
   - Copy the 16-character password (save this!)

### 4. Backend Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env  # On Windows: type nul > .env
```

**Edit `backend/.env`:**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vaccineDB
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
PORT=5050
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

**Generate JWT Secret:**
```bash
# Run this in terminal to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Frontend Installation

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 6. Seed Vaccine Library (Optional)

```bash
cd backend
node data/seedVaccineLibrary.js
```

This populates the vaccine library with standard vaccines.

### 7. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on Port 5050
✅ MongoDB Connected
✅ Email service ready
⏰ Smart Reminder Service Loaded
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser should automatically open to `http://localhost:3000`

### 8. Test the Application

1. **Register a New Account**
   - Go to `http://localhost:3000/register`
   - Fill in name, email, password
   - Select role (parent or pet_owner)
   - Click "Register"

2. **Create a Profile**
   - Click "Profiles" in navbar
   - Click "+ Add Profile"
   - Enter name, select type (child/pet)
   - Enter date of birth
   - Click "Save"

3. **Add a Vaccine**
   - Click on a profile
   - Click "+ Add Vaccine"
   - Enter vaccine name and due date
   - Click "Save"

4. **Test Email Service**
   - Visit `http://localhost:5050/test-email`
   - Check your email inbox
   - You should receive a test email

5. **Configure Reminders**
   - Go to a profile
   - Click "Notification Settings"
   - Set reminder time (e.g., 09:00)
   - Set days before (e.g., 3)
   - Enable reminders
   - Click "Save"

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "MongoDB connection failed"**
- Check MONGO_URI in .env
- Verify password doesn't contain special characters (URL encode if needed)
- Ensure IP whitelist includes 0.0.0.0/0
- Check cluster is running in MongoDB Atlas

**Error: "Email service error"**
- Verify EMAIL_USER and EMAIL_PASS in .env
- Ensure 2FA is enabled on Gmail
- Regenerate App Password if needed
- Check for typos in credentials

### Frontend Won't Start

**Error: "Port 3000 already in use"**
```bash
# Kill process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: "Network Error" when making API calls**
- Ensure backend is running on port 5050
- Check `frontend/src/api/api.js` has correct baseURL
- Verify CORS is enabled in backend

### Email Reminders Not Working

1. **Check Cron Jobs are Running**
   - Look for "⏰ Checking reminders" in backend console
   - Should appear every hour

2. **Verify Reminder Settings**
   - Profile must have `reminderEnabled: true`
   - `reminderTime` must match current hour (e.g., "09:00")
   - Vaccine must be due in X days (based on `reminderDaysBefore`)

3. **Test Email Manually**
   ```bash
   curl http://localhost:5050/test-email
   ```

4. **Check Email Logs**
   - Backend console shows email send attempts
   - Look for "✅ Reminder sent" or "❌ Failed to send"

### Database Issues

**Clear all data and start fresh:**
```javascript
// In MongoDB Atlas → Collections → Browse Collections
// Delete all documents from:
- users
- profiles
- vaccines
```

Or use MongoDB Compass to connect and manage data visually.

## 📱 Testing Reminder System

### Quick Test (Without Waiting)

1. **Modify Cron Schedule** (for testing only)
   
   Edit `backend/services/reminderService.js`:
   ```javascript
   // Change from hourly to every minute
   cron.schedule("* * * * *", async () => {
   ```

2. **Set Reminder for Current Time**
   - Create a profile
   - Set reminder time to current time (e.g., if it's 14:35, set to "14:35")
   - Add a vaccine due in 3 days
   - Wait 1 minute
   - Check email

3. **Revert Changes**
   - Change cron back to `"0 * * * *"`
   - Restart backend

## 🎯 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5050
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_app_password
FRONTEND_URL=https://your-frontend-domain.com
```

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create vaccine-reminder-api

# Set environment variables
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_password

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Update API URL in src/api/api.js
# Change baseURL to your Heroku backend URL

# Deploy
vercel
```

## 📊 Monitoring

### Check Application Health

**Backend Health:**
```bash
curl http://localhost:5050/api/users/me
# Should return 401 (unauthorized) if working
```

**Database Connection:**
- Check backend console for "✅ MongoDB Connected"

**Email Service:**
- Check backend console for "✅ Email service ready"

**Cron Jobs:**
- Check backend console for "⏰ Smart Reminder Service Loaded"

### View Logs

**Backend Logs:**
```bash
cd backend
npm start
# All logs appear in console
```

**Frontend Logs:**
- Open browser DevTools (F12)
- Check Console tab for errors

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check backend console logs
4. Check browser console (F12)
5. Verify all environment variables
6. Ensure all services are running
7. Try restarting both backend and frontend

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can create a profile
- [ ] Can add a vaccine
- [ ] Can view dashboard with stats
- [ ] Can browse vaccine library
- [ ] Can access vaccine info center
- [ ] Test email endpoint works
- [ ] Reminder settings can be configured
- [ ] Can export vaccination history

---

**Setup Complete! 🎉**

Your Vaccine Reminder System is now ready to use.
