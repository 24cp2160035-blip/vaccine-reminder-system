# ChatGPT Memory Update Prompt

Copy and paste this to ChatGPT to update its memory about your project:

---

Please remember the following about my Vaccine Reminder System project:

## Project Overview
I built a full-stack Vaccine Reminder System for tracking vaccinations for children and pets with automated email reminders.

## Tech Stack
- **Frontend:** React.js with Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** MongoDB Atlas
- **Email Service:** Gmail SMTP with Nodemailer
- **Cron Jobs:** node-cron for automated reminders

## Project Structure
```
vaccine-reminder-system/
├── backend/
│   ├── server.js (main server file)
│   ├── models/ (Mongoose schemas)
│   ├── controllers/ (business logic)
│   ├── routes/ (API endpoints)
│   ├── services/
│   │   ├── mailer.js (Gmail email service)
│   │   └── reminderService.js (cron jobs)
│   └── .env (environment variables)
└── frontend/
    ├── src/
    │   ├── pages/ (React components)
    │   ├── components/ (reusable components)
    │   ├── api/api.js (Axios configuration)
    │   └── context/AuthContext.jsx
    └── package.json
```

## Key Features Implemented
1. **User Authentication:** JWT-based login/register
2. **Profile Management:** Add/edit/delete profiles (children/pets)
3. **Vaccine Tracking:** Add vaccines with due dates, doctor names, notes
4. **Status Management:** Pending, Completed, Overdue statuses
5. **Dashboard:** Overview with statistics and upcoming vaccines
6. **Export Feature:** Download vaccination history as JSON
7. **Notification Settings:** Configure reminder time and days before due date per profile
8. **Custom Reminders:** Set specific date AND time for individual vaccine reminders
9. **Automated Email Reminders:**
   - Profile-based reminders (hourly check, sends at configured time)
   - Custom "Remind Me" reminders (hourly check, sends at specified time)
   - Overdue alerts (daily at 8 AM)
   - Auto status updates (daily at midnight)

## Database Models
1. **User:** name, email, password (hashed)
2. **Profile:** userId, name, type (child/pet), dob, gender, reminderTime, reminderDaysBefore, reminderEnabled
3. **Vaccine:** profileId, vaccineName, dueDate, status, doctorName, notes, remindMeDate, remindMeTime, reminderSent
4. **VaccineMaster:** Vaccine library with standard vaccines
5. **VaccineLibrary:** User's custom vaccine library

## Email Configuration
- **Service:** Gmail SMTP
- **User:** tmugilan44@gmail.com
- **Authentication:** App Password (16 characters)
- **Files:** backend/services/mailer.js, backend/services/reminderService.js

## Cron Jobs Schedule
- Profile reminders: Every hour (0 * * * *)
- Custom reminders: Every hour (0 * * * *)
- Overdue alerts: Daily at 8 AM (0 8 * * *)
- Status updates: Daily at midnight (0 0 * * *)

## API Endpoints
- `/api/users` - Authentication (register, login)
- `/api/profiles` - Profile CRUD operations
- `/api/vaccines` - Vaccine CRUD operations
- `/api/vaccine-library` - Vaccine library management
- `/api/notifications` - Notification settings
- `/api/export/:profileId` - Export vaccination history
- `/api/dashboard/:userId` - Dashboard statistics
- `/test-email` - Test email service
- `/trigger-reminders` - Manual reminder trigger

## Environment Variables
```
MONGO_URI=mongodb+srv://tmugilan44:VaccineApp2026@cluster0.yhioq.mongodb.net/
JWT_SECRET=qazwsxedc
PORT=5050
EMAIL_USER=tmugilan44@gmail.com
EMAIL_PASS=jhjwloqxgjrfkuqx
```

## Testing Scripts
- `test-email.js` - Test basic email functionality
- `test-reminder-system.js` - Test complete reminder system
- `test-custom-reminder-now.js` - Test custom reminders with current data
- `force-send-reminder.js` - Force send reminder ignoring time matching
- `test-cron-every-minute.js` - Test cron with minute-by-minute checks

## Current Status
✅ All features working
✅ Email reminders working with date and time
✅ Cron jobs running correctly
✅ Ready for deployment

## Deployment Plan
- **Backend:** Render.com (Node.js web service)
- **Frontend:** Vercel (React static site)
- **Database:** MongoDB Atlas (already configured)

## Important Notes
- Cron jobs run at the TOP of each hour (:00)
- Custom reminders match exact time (HH:MM format)
- If no time set, defaults to 9:00 AM
- reminderSent flag prevents duplicate emails
- CORS configured for localhost and production URLs

## Common Commands
```bash
# Backend
cd backend
npm start                    # Start server
node test-email.js          # Test email
node force-send-reminder.js # Force send test

# Frontend
cd frontend
npm start                   # Start dev server
npm run build              # Build for production
```

## My Preferences
- I prefer minimal, concise responses
- I like step-by-step guides with clear commands
- I appreciate when you create test scripts for debugging
- I want code that's production-ready and well-documented

---

This is my complete Vaccine Reminder System. Remember all these details for future conversations about this project.

