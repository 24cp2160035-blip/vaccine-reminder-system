# ⚡ Quick Start Guide

Get your Vaccine Reminder System running in 5 minutes!

## Prerequisites

- Node.js installed
- MongoDB Atlas account (free tier)
- Gmail account

## 🚀 Fast Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Configure Backend

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vaccineDB
JWT_SECRET=your_secret_key_here
PORT=5050
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free cluster
3. Get connection string
4. Replace `<password>` and add `/vaccineDB` at the end

**Get Gmail App Password:**
1. Enable 2FA on Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate password for "Mail"
4. Copy 16-character code

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 4. Test It Out

1. Open `http://localhost:3000`
2. Click "Register" → Create account
3. Add a profile (child or pet)
4. Add a vaccine with future due date
5. Check dashboard for timeline view

### 5. Test Email

Visit: `http://localhost:5050/test-email`

Check your inbox for test email.

## ✅ You're Done!

Your Vaccine Reminder System is now running.

## 📚 Next Steps

- Read [README.md](README.md) for full feature list
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Review [FEATURES_COMPLETED.md](FEATURES_COMPLETED.md) for what's built

## 🐛 Common Issues

**Backend won't start?**
- Check MongoDB URI is correct
- Verify .env file exists in backend folder

**Frontend shows network error?**
- Ensure backend is running on port 5050
- Check browser console for errors

**Email not working?**
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Google account

## 🎯 Key Features to Try

1. **Dashboard** - View overdue, due today, and upcoming vaccines
2. **Timeline** - See next 6 vaccines with countdown
3. **Vaccine Library** - Browse and add standard vaccines
4. **Info Center** - Learn about vaccines and side effects
5. **Export** - Download vaccination history
6. **Reminders** - Configure per-profile notification settings

---

**Need Help?** Check SETUP_GUIDE.md for detailed troubleshooting.
