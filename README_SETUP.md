# 🚀 WeIntern - Quick Setup Guide

Welcome! This guide will help you set up the WeIntern project after cloning or merging.

---

## ⚡ Quick Start (5 Minutes)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WeInternFr
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configure Environment

**Backend** - Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weintern
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Frontend** - Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Open Browser
Visit: **http://localhost:3000**

---

## ✅ Verify Setup (Optional)

**Linux/Mac:**
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

**Windows:**
```bash
# Manually check:
# - Node.js installed (node -v)
# - npm installed (npm -v)
# - MongoDB running (optional)
# - .env files created
```

---

## 🆕 What's New in This Version

### 1. **Multiple File Upload** 📎
- Mentors can upload multiple PDFs/documents in assignments
- Students see all attached files
- **No migration needed** - works automatically

### 2. **Admin User Activity** 📊
- Fixed "Failed to load user activity" error
- Shows proper analytics for all users
- **No setup required** - works out of the box

### 3. **Delete Mentor** 🗑️
- Admins can delete mentor accounts
- Students automatically unassigned
- **Admin only** - mentors cannot delete

### 4. **Enhanced Logging** 📝
- Better error messages
- Production debugging made easy
- **Automatic** - logs to console

---

## 📚 Documentation Files

- **DEPLOYMENT_GUIDE_COMPLETE.md** - Full deployment guide
- **MULTIPLE_FILE_UPLOAD_UPDATE.md** - File upload feature details
- **ADMIN_USER_VIEW_FIX.md** - User activity fix details
- **MENTOR_DELETE_FEATURE.md** - Mentor delete feature details
- **FIX_APPLICATION_DELETE_PRODUCTION.md** - Production deployment tips

---

## 🐛 Troubleshooting

### "Module not found" error?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use?
```bash
# Change PORT in backend/.env
PORT=5001
```

### MongoDB connection error?
```bash
# Make sure MongoDB is running
mongod

# OR use MongoDB Atlas
# Update MONGODB_URI in .env with Atlas connection string
```

### Frontend API calls failing?
```bash
# Check backend is running
# Check REACT_APP_API_URL in frontend/.env
# Should be: http://localhost:5000
```

---

## 🎯 Test Features

After setup, test these:

1. **Login as Admin** (create admin account first)
2. **Go to Mentors section** → Try delete button
3. **Go to Applications section** → Try delete button
4. **Go to Users section** → Click "View" on any user
5. **Login as Mentor** → Create assignment → Upload multiple files

---

## 🚀 Production Deployment

### Frontend:
```bash
cd frontend
npm run build
# Deploy build/ folder to your hosting
```

### Backend:
```bash
cd backend
npm install --production
pm2 start src/server.js --name weintern-backend
```

**Full deployment guide:** `DEPLOYMENT_GUIDE_COMPLETE.md`

---

## 📞 Need Help?

1. Read documentation files (listed above)
2. Check troubleshooting section
3. Check browser console (F12) for errors
4. Check backend logs: `pm2 logs weintern-backend`

---

## 🔒 Security Notes

- All delete endpoints protected (admin only)
- File uploads authenticated
- No security vulnerabilities
- Backward compatible

---

## ✨ Requirements

- **Node.js:** 14+ recommended
- **MongoDB:** Local or Atlas
- **npm:** Latest version
- **Git:** For version control

---

## 🎉 You're Ready!

Everything is set up and ready to go. All new features are:
- ✅ Tested
- ✅ Documented
- ✅ Production ready
- ✅ Backward compatible

**Happy Coding! 🚀**

---

**Quick Commands Reference:**
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm start

# Production
cd frontend && npm run build
cd backend && pm2 start src/server.js
```
