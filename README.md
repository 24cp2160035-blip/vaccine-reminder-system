# 💉 Vaccine Reminder System

A full-stack web application for managing vaccination schedules for children and pets with automated email reminders.

## 🎯 Core Features

### 1. Smart Dashboard
- **Priority Status Cards**: Overdue, Due Today, and Upcoming (7 days) vaccines
- **Statistics Overview**: Total profiles, vaccines, pending, and completed counts
- **Timeline View**: Visual roadmap of upcoming vaccinations with countdown
- **Profile Filtering**: Switch between individual profiles or view all at once
- **Quick Actions**: Fast access to add profiles, browse library, and add vaccines

### 2. Automated Notification Engine
- **Multi-Tiered Reminders**: 
  - Hourly checks for scheduled reminder times
  - Customizable days-before notifications (default: 3 days)
  - Daily overdue alerts at 8 AM
- **Email Notifications**: HTML-formatted emails with vaccine details
- **Configurable Settings**: Per-profile reminder time and frequency
- **Smart Scheduling**: Automatic status updates (pending → overdue)

### 3. Vaccine Management
- **Multi-Profile Support**: Manage multiple children or pets under one account
- **Vaccine Library**: Pre-populated with standard vaccination schedules
- **Custom Vaccines**: Add one-off or travel-specific vaccines
- **Status Tracking**: Pending, Completed, Overdue with visual indicators
- **Export Functionality**: Download vaccination history as JSON

### 4. Information Resource Center
- **Vaccine Database**: Comprehensive information on 15+ vaccines
- **Search & Filter**: Find vaccines by name, purpose, or category (child/pet)
- **Detailed Information**: Purpose, recommended age, side effects, post-care tips
- **FAQ Section**: Common questions about vaccination safety and schedules
- **Educational Content**: Evidence-based information for informed decisions

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MongoDB** + **Mongoose**: Database and ODM
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing
- **nodemailer**: Email service integration
- **node-cron**: Scheduled task automation

### Frontend
- **React 19**: UI framework
- **React Router 7**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first styling
- **Context API**: State management

## 📁 Project Structure

```
vaccine-reminder-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js     # Auth logic
│   │   ├── profileController.js  # Profile CRUD
│   │   ├── vaccineController.js  # Vaccine CRUD
│   │   ├── dashboardController.js # Stats API
│   │   └── exportController.js   # Export history
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── profileModel.js       # Profile schema
│   │   ├── vaccineModel.js       # Vaccine schema
│   │   └── vaccineMasterModel.js # Library schema
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── vaccineRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── exportRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── mailer.js             # Email transport
│   │   └── reminderService.js    # Cron jobs
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── api.js            # Axios instance
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx     # Enhanced dashboard
    │   │   ├── Profiles.jsx
    │   │   ├── Vaccines.jsx
    │   │   ├── VaccineLibrary.jsx
    │   │   ├── VaccineInfo.jsx   # Resource center
    │   │   └── NotificationSettings.jsx
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- Gmail account for email notifications

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vaccine-reminder-system
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5050
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Note**: For Gmail, you need to generate an App Password:
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Generate a new app password for "Mail"
- Use this password in EMAIL_PASS

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm start
```
Server runs on `http://localhost:5050`

2. **Start Frontend Development Server**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

## 📧 Email Notification System

### How It Works

1. **Hourly Reminder Checks** (Every hour at :00)
   - Scans all profiles with reminders enabled
   - Checks if current time matches profile's reminder time
   - Finds vaccines due in X days (configurable per profile)
   - Sends formatted email with vaccine details

2. **Midnight Status Updates** (Daily at 00:00)
   - Updates all pending vaccines past due date to "overdue"
   - Ensures accurate status tracking

3. **Daily Overdue Alerts** (Daily at 08:00)
   - Identifies all overdue vaccines
   - Groups by user email
   - Sends urgent notification with all overdue items

### Email Configuration

The system uses Gmail SMTP. To enable:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password
3. Add credentials to `.env` file

### Testing Email Service

Visit `http://localhost:5050/test-email` to verify email configuration.

## 🔐 Authentication

- JWT-based authentication
- Protected routes require valid token
- Token stored in localStorage
- Auto-redirect to login if unauthorized

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)

### Profiles
- `GET /api/profiles` - Get all profiles for user (protected)
- `POST /api/profiles` - Create new profile (protected)
- `PUT /api/profiles/:id` - Update profile (protected)
- `DELETE /api/profiles/:id` - Delete profile (protected)

### Vaccines
- `GET /api/vaccines/:profileId` - Get vaccines for profile (protected)
- `POST /api/vaccines` - Add new vaccine (protected)
- `PUT /api/vaccines/:id` - Update vaccine (protected)
- `DELETE /api/vaccines/:id` - Delete vaccine (protected)

### Vaccine Library
- `GET /api/vaccine-library` - Get all library vaccines
- `POST /api/vaccine-library/add` - Add library vaccine to profile (protected)

### Notifications
- `PATCH /api/notifications/:id/notifications` - Update reminder settings (protected)

### Export
- `GET /api/export/:profileId` - Export vaccination history (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

## 🎨 UI Features

### Dashboard
- Color-coded priority cards (red=overdue, orange=today, blue=upcoming)
- Interactive timeline with countdown badges
- Profile filter dropdown
- Quick action buttons

### Vaccine Management
- Modal-based vaccine entry
- Status badges with color coding
- One-click status updates
- Export vaccination history

### Resource Center
- Searchable vaccine database
- Category filtering (children/pets/all)
- Modal detail view with comprehensive information
- FAQ section

## 🔄 Cron Job Schedule

```javascript
// Hourly reminder checks
"0 * * * *" → Every hour at minute 0

// Midnight status updates
"0 0 * * *" → Every day at 00:00

// Daily overdue alerts
"0 8 * * *" → Every day at 08:00
```

## 🐛 Troubleshooting

### Email Not Sending
- Verify Gmail App Password is correct
- Check 2FA is enabled on Google account
- Review console logs for SMTP errors
- Test with `/test-email` endpoint

### Database Connection Issues
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes your IP

### Frontend Not Loading
- Clear browser cache
- Check if backend is running
- Verify API base URL in `frontend/src/api/api.js`

## 📈 Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] Push notifications for mobile
- [ ] PDF export with vaccination certificates
- [ ] Clinic locator with Maps API
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Photo upload for profiles
- [ ] Vaccine batch/lot tracking
- [ ] Adverse reaction logging
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for preventative healthcare
