# WeIntern – Full Stack React App

> Where Students Don't Wait for Opportunity. They Build It.

## 🗂️ Project Structure

```
weintern/
├── frontend/          # React app (CRA)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Auth/          # Login, Register, OTP, Forgot/Reset Password
│       │   ├── Admin/         # Admin dashboard
│       │   ├── Dashboard/     # Student dashboard
│       │   ├── Layout/        # Navbar, Footer
│       │   └── Sections/      # Hero, Courses, Forms, etc.
│       ├── context/           # AuthContext
│       ├── hooks/             # useReveal
│       ├── pages/             # Home page
│       ├── styles/            # global.css
│       └── utils/             # api.js (axios)
│
└── backend/           # Node.js + Express API
    └── src/
        ├── config/            # database.js, passport.js
        ├── middleware/        # auth.js, rateLimiter.js
        ├── models/            # User, Application, Enrollment
        ├── routes/            # auth, user, applications, courses, payments, admin, contact
        └── utils/             # email.js
```

---

## ⚙️ Features

### Authentication
- ✅ Email + Password registration with OTP email verification
- ✅ Login with JWT tokens
- ✅ Forgot password / Reset password via email link
- ✅ Google OAuth (Sign in with Google)
- ✅ GitHub OAuth (Sign in with GitHub)
- ✅ Protected routes (student + admin)

### Student
- ✅ Internship application (3-month / 6-month)
- ✅ Course enrollment with Razorpay payment
- ✅ Student dashboard with application status tracking
- ✅ Profile management
- ✅ Password change

### Admin
- ✅ Admin dashboard with platform stats
- ✅ View, search and update all applications
- ✅ View all enrollments
- ✅ View and manage hire requests
- ✅ User management

### Business
- ✅ Hire a team form with email notification to admin

---

## 🚀 Setup Instructions

### 1. Clone / Extract the project

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in all values in .env
npm run dev
```

**Required `.env` values:**
- `MONGODB_URI` – your MongoDB connection string
- `JWT_SECRET` – any long random string
- `EMAIL_USER` / `EMAIL_PASS` – Gmail + App Password (enable 2FA → App Passwords)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – from Google Cloud Console
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` – from GitHub Developer Settings
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` – from Razorpay Dashboard
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – for seeding admin account

### 3. Seed Admin Account

After backend is running, POST to create admin:
```bash
# Use Thunder Client / Postman / curl:
POST http://localhost:5000/api/auth/register
{ "name": "Admin", "email": "admin@weintern.in", "password": "Admin@123456" }

# Then manually set role in MongoDB:
# db.users.updateOne({ email: "admin@weintern.in" }, { $set: { role: "admin", isVerified: true } })
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill REACT_APP_RAZORPAY_KEY_ID
npm start
```

### 5. OAuth Setup

**Google:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:5000/api/auth/google/callback` as authorized redirect URI

**GitHub:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Callback URL: `http://localhost:5000/api/auth/github/callback`

### 6. Add Logo

Place `welogo.png` in `frontend/public/`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password` | Reset password |
| GET  | `/api/auth/google` | Google OAuth |
| GET  | `/api/auth/github` | GitHub OAuth |
| GET  | `/api/user/profile` | Get my profile |
| PUT  | `/api/user/profile` | Update profile |
| POST | `/api/applications` | Submit internship application |
| GET  | `/api/applications/my` | Get my applications |
| POST | `/api/courses/enroll` | Enroll in course |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| POST | `/api/contact/hire` | Submit hire inquiry |
| GET  | `/api/admin/stats` | Admin stats |
| GET  | `/api/admin/applications` | All applications |
| PATCH| `/api/admin/applications/:id` | Update status |
| GET  | `/api/admin/enrollments` | All enrollments |
| GET  | `/api/admin/hire-requests` | All hire requests |
| GET  | `/api/admin/users` | All users |

---

## 📦 Tech Stack

**Frontend:** React 18, React Router v6, Axios, React Hot Toast, CSS Modules

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, Bcrypt, Nodemailer, Passport.js (Google + GitHub OAuth), Razorpay, Express Rate Limiter

---

## 🔒 Security

- JWT authentication with expiry
- Bcrypt password hashing
- Rate limiting on auth routes
- OTP with 10-minute expiry
- Helmet.js for HTTP headers
- CORS configured for frontend origin only

---

Built with ❤️ by the WeIntern Team
