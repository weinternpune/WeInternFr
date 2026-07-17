# OAuth Setup Guide - WeIntern

## Current Status
- ✅ **Google OAuth**: Already configured and working
- ❌ **GitHub OAuth**: Needs setup

---

## GitHub OAuth Setup (5 Minutes)

### Step 1: Go to GitHub Developer Settings
Open this URL in your browser:
```
https://github.com/settings/developers
```
Or manually navigate:
- Click your profile picture (top right)
- Settings → Developer settings → OAuth Apps

### Step 2: Create New OAuth App
Click **"New OAuth App"** button and fill:

```
Application name: WeIntern
Homepage URL: http://localhost:3000
Application description: WeIntern - Student internship platform
Authorization callback URL: http://localhost:5000/api/auth/github/callback
```

Click **"Register application"**

### Step 3: Get Client ID and Secret
After creating the app:
1. Copy the **Client ID** (shows on the page)
2. Click **"Generate a new client secret"**
3. Copy the **Client secret** (⚠️ Only shown once!)

### Step 4: Update Backend .env
Open `backend/.env` and replace these lines:

```env
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here
```

### Step 5: Restart Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ Google OAuth configured
✅ GitHub OAuth configured
```

---

## Google OAuth - Already Working ✅

Your current Google credentials:
```
Client ID: 889075342182-j7goku4qtvr2g48sb4tmjls050uscnj7.apps.googleusercontent.com
```

If you need to reconfigure:
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Make sure redirect URI is: `http://localhost:5000/api/auth/google/callback`

---

## Testing OAuth

### Test Google Login:
1. Open frontend: http://localhost:3000
2. Click "Login"
3. Click "Continue with Google"
4. Should redirect to Google login
5. After login, redirects back to your app

### Test GitHub Login:
1. Open frontend: http://localhost:3000
2. Click "Login"
3. Click "Continue with GitHub"
4. Should redirect to GitHub login
5. After login, redirects back to your app

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Problem**: Callback URL doesn't match

**Solution**:
- Google: Check https://console.cloud.google.com → Credentials
- GitHub: Check https://github.com/settings/developers
- Make sure callback URL is exactly: `http://localhost:5000/api/auth/github/callback`

### Error: "Cannot GET /api/auth/google"
**Problem**: Backend not running

**Solution**:
```bash
cd backend
npm run dev
```

### GitHub email not found
GitHub might not share email. The backend handles this by creating a local email.

---

## Production Setup (When deploying)

### Google OAuth:
Update authorized redirect URI to:
```
https://your-domain.com/api/auth/google/callback
```

### GitHub OAuth:
Update callback URL to:
```
https://your-domain.com/api/auth/github/callback
```

### Update .env:
```env
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/github/callback
FRONTEND_URL=https://your-domain.com
```

---

## Security Notes

⚠️ **Never commit .env file to GitHub**
- `.env` is already in `.gitignore`
- Client secrets are sensitive

✅ **Safe to expose**:
- Client IDs (public)
- Callback URLs (public)

❌ **Keep private**:
- Client Secrets
- JWT Secret
- Database passwords

---

Built with ❤️ by WeIntern Team
