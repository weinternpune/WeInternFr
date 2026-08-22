@echo off
REM Quick Deploy Script for Application Delete Fix (Windows)

echo.
echo 🚀 Starting deployment fix for Application Delete...
echo.

REM Step 1: Frontend
echo.
echo 📦 Step 1: Frontend
echo ===================
cd frontend

echo 🗑️  Clearing old build...
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 🔨 Building fresh frontend...
call npm run build

echo.
echo ✅ Build complete!
echo.
echo 📋 Next Steps:
echo 1. Deploy the new build\ folder to your hosting
echo 2. Restart your backend server
echo 3. Clear browser cache (Ctrl+Shift+R)
echo 4. Test the delete button
echo.
echo 🎯 Build location: frontend\build\
echo ✨ Done!
echo.
pause
