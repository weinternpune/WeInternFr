# Clear Course Cache Instructions

## The courses have been updated to include Python, Java, and C/C++ programming courses!

### What Changed?
- **Python Programming**: ₹5,999 → ₹3,999 (Offer Price)
- **Java Programming**: ₹3,999
- **C/C++ Programming**: ₹5,999 → ₹3,999 (Offer Price)

### To See All Courses on Your Website:

**Option 1: Use Browser Console (RECOMMENDED)**
1. Open your browser and go to `http://localhost:3000`
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Paste this command and press Enter:
```javascript
localStorage.clear(); location.reload();
```

**Option 2: Hard Refresh**
- Windows: Press `Ctrl + Shift + R`
- Mac: Press `Cmd + Shift + R`

**Option 3: Clear Storage Manually**
1. Press `F12` to open Developer Tools
2. Go to **Application** tab (in Chrome) or **Storage** tab (in Firefox)
3. Expand **Local Storage** on the left
4. Click on `http://localhost:3000`
5. Right-click and select **Clear**
6. Refresh the page

---

## Verification

After clearing cache, you should see **13 courses total** in the courses section:

1. ✅ Full Stack Web Development - ₹7,999 (was ₹9,999)
2. ✅ Mobile App Development - ₹12,999 (was ₹15,999)
3. ✅ AI & Automation - ₹7,999 (was ₹9,999)
4. ✅ Cloud Solutions & DevOps - ₹12,999 (was ₹15,999)
5. ✅ UI/UX Design - ₹3,999
6. ✅ Digital Marketing - ₹2,999
7. ✅ Data Science & Analytics - ₹7,999 (was ₹9,999)
8. ✅ Video Editing & Content Creation - ₹4,499
9. ✅ Cloud Computing - ₹6,499
10. ✅ DevOps Engineering - ₹6,999
11. ✅ **Python Programming** - ₹3,999 (was ₹5,999) 🆕
12. ✅ **Java Programming** - ₹3,999 🆕
13. ✅ **C/C++ Programming** - ₹3,999 (was ₹5,999) 🆕

---

## What Was Done Behind the Scenes:

1. ✅ Updated storage key from `v3` to `v4` to force cache refresh
2. ✅ All 13 courses are defined in `CoursesContext.jsx`
3. ✅ Python, Java, and C/C++ courses added with proper pricing
4. ✅ Course prices updated for all existing courses

The code is ready - you just need to clear your browser cache! 🚀
