# 🚀 Deployment Checklist - WeIntern

## ⚠️ Current Issues (Production)

### 1. College Name Not Showing
- **Status:** ❌ Not working in production
- **Root Cause:** Old applications don't have `college` field
- **Solution:** Run migration script

### 2. Delete Button Not Working  
- **Status:** ❌ Not working in production
- **Root Cause:** Backend code not deployed or cached
- **Solution:** Deploy backend + clear cache

---

## ✅ Deployment Steps

### **Step 1: Backend Deployment**

#### A. Update Environment Variables (Production)
```bash
# Already set - verify these exist:
MONGODB_URI=<production-mongodb-uri>
NODE_ENV=production
FRONTEND_URL=<production-frontend-url>
EMAIL_USER=weinternservice@gmail.com
EMAIL_PASS=bcmxotcspduqsity
```

#### B. Deploy Backend Code
```bash
# From backend directory
git add .
git commit -m "feat: Add delete application route and college field default"
git push origin main

# On production server (Render/Railway/etc):
# 1. Trigger manual deploy OR wait for auto-deploy
# 2. Verify deploy logs show no errors
```

#### C. Run Migration Script (One-time)
```bash
# SSH into production server or run via deployment platform
cd backend
node migrateApplications.js
```

Expected output:
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
✅ Migration complete!
📊 Updated X applications
```

---

### **Step 2: Frontend Deployment**

#### A. Build Frontend
```bash
# From frontend directory
npm run build
```

#### B. Deploy Frontend
```bash
git add .
git commit -m "feat: Add college field and improved duration display"
git push origin main

# Deploy to Vercel/Netlify/etc
```

#### C. Update API URL (if needed)
```bash
# In frontend/.env.production
REACT_APP_API_URL=https://your-backend-url.com
```

---

### **Step 3: Verification**

#### Test College Name:
1. ✅ Go to admin applications page
2. ✅ Old applications should show "Not Provided"
3. ✅ Apply for new internship with college name
4. ✅ Verify college name appears in admin

#### Test Delete Button:
1. ✅ Open admin applications page
2. ✅ Click delete (🗑️) button on any row
3. ✅ Confirm deletion dialog appears
4. ✅ Verify application is deleted
5. ✅ Check toast notification shows "Application deleted"

---

## 🐛 Troubleshooting

### Issue: Delete still not working

**Check 1: Verify backend deployment**
```bash
# Test delete endpoint directly
curl -X DELETE https://your-backend.com/api/admin/applications/TEST_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Expected response:
```json
{"success": true, "message": "Application deleted successfully"}
```

**Check 2: Check browser console**
- Open DevTools (F12)
- Go to Console tab
- Click delete button
- Look for errors (CORS, 404, 401, etc.)

**Check 3: Verify admin authentication**
- Make sure you're logged in as admin
- Check token in localStorage: `localStorage.getItem('token')`

### Issue: College name still "N/A"

**Check 1: Run migration script**
```bash
node migrateApplications.js
```

**Check 2: Verify new applications**
- Apply for a new internship
- Enter college name
- Check database directly
- Check admin page

**Check 3: Check backend logs**
- Look for "college" field in application creation logs
- Verify payload includes college in `/payments/internship/create-order`

---

## 📋 Files Changed (For Reference)

### Backend:
1. ✅ `backend/src/routes/admin.js` - Added DELETE /applications/:id
2. ✅ `backend/src/routes/payment.js` - Added college field to application
3. ✅ `backend/src/models/Application.js` - Added default value for college
4. ✅ `backend/migrateApplications.js` - New migration script

### Frontend:
1. ✅ `frontend/src/components/Admin/Admin.jsx` - Added delete button, phone & college columns
2. ✅ `frontend/src/components/Admin/Admin.css` - Added delete button styles
3. ✅ `frontend/src/pages/InternshipPage.jsx` - Added college field to form

---

## 🎯 Post-Deployment Commands

### On Production Server:

```bash
# 1. Run migration (one-time)
node backend/migrateApplications.js

# 2. Restart backend service
pm2 restart weintern-backend
# OR (if using systemd)
sudo systemctl restart weintern-backend

# 3. Clear any caching
# If using Nginx:
sudo nginx -s reload

# If using Cloudflare:
# Go to Cloudflare dashboard > Caching > Purge Everything
```

---

## ✅ Success Criteria

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Migration script executed
- [ ] Old applications show "Not Provided" for college
- [ ] New applications show actual college name
- [ ] Delete button works (with confirmation)
- [ ] Toast notifications appear
- [ ] No console errors
- [ ] Duration shows correctly (3 Month / 6 Month)

---

## 📞 Support

If issues persist after following this checklist:
1. Check deployment logs
2. Check browser console errors
3. Check backend error logs
4. Verify database connection
5. Test API endpoints directly with curl/Postman
