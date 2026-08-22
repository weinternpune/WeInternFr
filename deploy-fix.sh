#!/bin/bash
# Quick Deploy Script for Application Delete Fix

echo "🚀 Starting deployment fix for Application Delete..."

# Step 1: Backend
echo ""
echo "📦 Step 1: Backend"
echo "==================="
cd backend
echo "✅ Backend directory"

# Restart backend (uncomment based on your setup)
# pm2 restart weintern-backend
# OR
# npm restart

# Step 2: Frontend
echo ""
echo "📦 Step 2: Frontend"
echo "==================="
cd ../frontend
echo "🗑️  Clearing old build..."
rm -rf build
rm -rf node_modules/.cache

echo "🔨 Building fresh frontend..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy the new build/ folder to your hosting"
echo "2. Restart your backend server if not auto-restarted"
echo "3. Clear browser cache (Ctrl+Shift+R)"
echo "4. Test the delete button"
echo ""
echo "🎯 Build location: frontend/build/"
echo "✨ Done!"
