#!/bin/bash
# Setup Verification Script
# Run this after cloning/merging to verify everything is ready

echo "🔍 WeIntern Setup Verification"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "1. Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found!"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi

# Check npm
echo -n "2. Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} Found: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found!"
    exit 1
fi

# Check MongoDB (optional)
echo -n "3. Checking MongoDB... "
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | grep "db version" | cut -d' ' -f3)
    echo -e "${GREEN}✓${NC} Found: $MONGO_VERSION"
else
    echo -e "${YELLOW}⚠${NC} MongoDB not found (optional if using Atlas)"
fi

# Check Backend folder
echo -n "4. Checking backend folder... "
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${RED}✗${NC} backend/ folder not found!"
    exit 1
fi

# Check Frontend folder
echo -n "5. Checking frontend folder... "
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${RED}✗${NC} frontend/ folder not found!"
    exit 1
fi

# Check Backend package.json
echo -n "6. Checking backend/package.json... "
if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${RED}✗${NC} backend/package.json not found!"
    exit 1
fi

# Check Frontend package.json
echo -n "7. Checking frontend/package.json... "
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${RED}✗${NC} frontend/package.json not found!"
    exit 1
fi

# Check Backend .env
echo -n "8. Checking backend/.env... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${YELLOW}⚠${NC} backend/.env not found!"
    echo "   Copy backend/.env.example to backend/.env and configure"
fi

# Check Frontend .env
echo -n "9. Checking frontend/.env... "
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} Exists"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env not found!"
    echo "   Copy frontend/.env.example to frontend/.env and configure"
fi

# Check Backend node_modules
echo -n "10. Checking backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "   Run: cd backend && npm install"
fi

# Check Frontend node_modules
echo -n "11. Checking frontend dependencies... "
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "   Run: cd frontend && npm install"
fi

# Check important backend files
echo -n "12. Checking backend routes... "
MISSING_ROUTES=0
if [ ! -f "backend/src/routes/admin.js" ]; then MISSING_ROUTES=$((MISSING_ROUTES+1)); fi
if [ ! -f "backend/src/routes/mentor.js" ]; then MISSING_ROUTES=$((MISSING_ROUTES+1)); fi
if [ ! -f "backend/src/routes/user.js" ]; then MISSING_ROUTES=$((MISSING_ROUTES+1)); fi

if [ $MISSING_ROUTES -eq 0 ]; then
    echo -e "${GREEN}✓${NC} All routes found"
else
    echo -e "${RED}✗${NC} $MISSING_ROUTES route files missing!"
fi

# Check important frontend files
echo -n "13. Checking frontend components... "
MISSING_COMPONENTS=0
if [ ! -f "frontend/src/components/Admin/Admin.jsx" ]; then MISSING_COMPONENTS=$((MISSING_COMPONENTS+1)); fi
if [ ! -f "frontend/src/components/Mentor/MentorDashboard.jsx" ]; then MISSING_COMPONENTS=$((MISSING_COMPONENTS+1)); fi

if [ $MISSING_COMPONENTS -eq 0 ]; then
    echo -e "${GREEN}✓${NC} All components found"
else
    echo -e "${RED}✗${NC} $MISSING_COMPONENTS component files missing!"
fi

# Check today's changes
echo ""
echo "14. Verifying today's changes:"
echo "   --------------------------------"

# Check multiple file upload changes
echo -n "   - Multiple file upload... "
if grep -q "attachmentUrls" "backend/src/models/MentorAssignment.js" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Model not updated"
fi

# Check mentor delete
echo -n "   - Mentor delete endpoint... "
if grep -q "DELETE.*mentors/:id" "backend/src/routes/mentor.js" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Route not found"
fi

# Check user activity fix
echo -n "   - User activity fix... "
if grep -q "getDashboardAnalytics" "backend/src/utils/dashboardAnalytics.js" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Analytics not found"
fi

# Check application delete logging
echo -n "   - Application delete logs... "
if grep -q "console.log.*DELETE.*applications" "backend/src/routes/admin.js" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} Logs not found"
fi

echo ""
echo "=============================="
echo "📊 Verification Summary"
echo "=============================="

# Final recommendation
if [ $MISSING_ROUTES -eq 0 ] && [ $MISSING_COMPONENTS -eq 0 ]; then
    echo -e "${GREEN}✅ Setup looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure .env files if needed"
    echo "2. Install dependencies:"
    echo "   cd backend && npm install"
    echo "   cd frontend && npm install"
    echo "3. Start development servers:"
    echo "   Terminal 1: cd backend && npm run dev"
    echo "   Terminal 2: cd frontend && npm start"
else
    echo -e "${RED}⚠️  Some issues found!${NC}"
    echo ""
    echo "Please fix the issues above before running."
fi

echo ""
echo "📖 For detailed setup instructions, read:"
echo "   DEPLOYMENT_GUIDE_COMPLETE.md"
echo ""
