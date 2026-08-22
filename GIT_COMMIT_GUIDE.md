# Git Commit & Push Guide

## 📋 Pre-Commit Checklist

Before committing, make sure:
- [ ] All files saved
- [ ] Code tested locally
- [ ] No console errors
- [ ] Backend runs without errors
- [ ] Frontend builds successfully
- [ ] Documentation updated

---

## 🚀 Step-by-Step Git Commands

### Step 1: Check Status
```bash
git status
```
**You should see:**
- Modified files (backend/frontend code)
- New files (documentation)

### Step 2: Add All Changes
```bash
git add .
```

**Or add specific files:**
```bash
# Backend changes
git add backend/src/models/MentorAssignment.js
git add backend/src/routes/mentor.js
git add backend/src/routes/admin.js
git add backend/src/utils/dashboardAnalytics.js

# Frontend changes
git add frontend/src/components/Admin/Admin.jsx
git add frontend/src/components/Mentor/MentorDashboard.jsx
git add frontend/src/components/Dashboard/AssignmentsTab.jsx
git add frontend/src/components/Dashboard/Dashboard.jsx
git add frontend/src/utils/api.js

# Documentation
git add *.md
git add *.sh
git add *.bat
```

### Step 3: Commit with Message
```bash
git commit -m "feat: Multiple file upload, mentor delete, admin fixes

✨ Features:
- Multiple file upload for mentor assignments
- Mentor delete functionality (admin only)

🐛 Fixes:
- Admin user activity view error
- Application delete production logging

📝 Documentation:
- Complete deployment guides
- Setup verification scripts
- Feature documentation

✅ Status:
- All features tested
- Backward compatible
- Production ready"
```

### Step 4: Push to Remote
```bash
git push origin main
```

**Or if you're using a different branch:**
```bash
git push origin your-branch-name
```

---

## 📝 Alternative: Shorter Commit Message

If you want a shorter message:

```bash
git commit -m "feat: Add multiple file upload, mentor delete, and admin fixes

- Multiple file upload for assignments
- Mentor delete with confirmation
- Fixed user activity view
- Enhanced logging for production
- Complete documentation added

Tested and production ready ✅"
```

---

## 🔍 Verify Your Commit

### Check what will be committed:
```bash
git diff --cached
```

### Check commit history:
```bash
git log --oneline -5
```

### Check remote status:
```bash
git remote -v
```

---

## 🌿 Working with Branches

### Create a new feature branch:
```bash
git checkout -b feature/file-upload-mentor-delete
git add .
git commit -m "feat: Multiple file upload and mentor delete"
git push origin feature/file-upload-mentor-delete
```

### Merge to main:
```bash
git checkout main
git merge feature/file-upload-mentor-delete
git push origin main
```

---

## 🔄 If You Need to Update

### Pull latest changes first:
```bash
git pull origin main
```

### If conflicts occur:
```bash
# Fix conflicts in files
git add .
git commit -m "merge: Resolved conflicts"
git push origin main
```

---

## 📦 Create a Release Tag (Optional)

```bash
git tag -a v1.0.0 -m "Release v1.0.0 - Multiple file upload and admin features"
git push origin v1.0.0
```

---

## 🚨 If Something Goes Wrong

### Undo last commit (keep changes):
```bash
git reset --soft HEAD~1
```

### Undo last commit (discard changes):
```bash
git reset --hard HEAD~1
```

### Undo changes to a file:
```bash
git checkout -- filename
```

### View what changed:
```bash
git diff
```

---

## ✅ Final Verification

After pushing, verify on GitHub/GitLab:

1. Go to your repository
2. Check latest commit appears
3. Verify all files updated
4. Check commit message is clear
5. Ensure no sensitive data committed (.env files should be gitignored)

---

## 🔒 Security Reminder

**NEVER commit:**
- `.env` files with real credentials
- `node_modules/` folders
- `build/` or `dist/` folders (frontend build)
- Database backups
- API keys or secrets

**Check .gitignore includes:**
```
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.production

# Build
build/
dist/

# Uploads
uploads/*
!uploads/.gitkeep

# Logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
```

---

## 📊 What Gets Committed

### ✅ Should be committed:
- Source code (.js, .jsx files)
- Documentation (.md files)
- Scripts (.sh, .bat files)
- Config examples (.env.example)
- Package configs (package.json)

### ❌ Should NOT be committed:
- node_modules/
- .env (real credentials)
- build/ or dist/
- Uploaded files
- Log files
- IDE configs

---

## 🎯 Quick Command Summary

```bash
# Basic workflow
git status                    # Check what changed
git add .                     # Add all changes
git commit -m "message"       # Commit with message
git push origin main          # Push to remote

# View changes
git diff                      # Changes not staged
git diff --cached             # Changes staged
git log --oneline -5          # Recent commits

# Branches
git branch                    # List branches
git checkout -b new-branch    # Create new branch
git merge branch-name         # Merge branch

# Undo
git reset --soft HEAD~1       # Undo commit, keep changes
git checkout -- file          # Discard file changes
```

---

## 📱 Collaborator Instructions

For team members pulling your changes:

```bash
# Pull latest
git pull origin main

# Install dependencies (if package.json changed)
cd backend && npm install
cd frontend && npm install

# Run locally
cd backend && npm run dev
cd frontend && npm start
```

---

## 🎉 Done!

Your code is now:
- ✅ Committed to Git
- ✅ Pushed to remote repository
- ✅ Ready for deployment
- ✅ Documented for team
- ✅ Version controlled

**Next:** Deploy to production following `DEPLOYMENT_GUIDE_COMPLETE.md`

---

## 📞 Need Help?

Common issues:

**"Permission denied"** → Check SSH keys or use HTTPS  
**"Conflict"** → Pull first, resolve conflicts, then push  
**"Up to date"** → No changes to commit  
**"Rejected"** → Pull first, then push again  

Read documentation files for more help!
