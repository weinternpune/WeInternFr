# Email Configuration Setup for WeIntern

Registration OTP aur forgot password feature ke liye email configuration set karna zaroori hai. Follow these steps:

## 🚨 Current Issue
- **Registration**: OTP email nahi aa rahi
- **Forgot Password**: Reset link email nahi aa rahi
- **Root Cause**: Email configuration missing hai

## 1. Gmail App Password Generate Karein

1. **Google Account Settings** mein jaayein: https://myaccount.google.com/
2. **Security** section mein jaayein
3. **2-Step Verification** enable karein (agar already enabled nhi hai)
4. **App Passwords** section mein jaayein
5. **Select app** → "Mail"
6. **Select device** → "Other (custom name)" → "WeIntern Backend"
7. **Generate** button click karein
8. **16-character password** copy karein (jaise: `abcd efgh ijkl mnop`)

## 2. .env File Update Karein

Backend ke `.env` file mein yeh lines add/update karein:

```env
# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM="WeIntern <your_gmail_address@gmail.com>"
ADMIN_EMAIL=admin@weintern.com
```

**Replace करें:**
- `your_gmail_address@gmail.com` → Apka actual Gmail address
- `abcd efgh ijkl mnop` → App password jo aapne generate kiya (spaces ke saath)

## 3. Backend Server Restart Karें

```bash
cd backend
npm run dev
# या
npm start
```

## 4. Test Registration & Forgot Password

### Registration Test:
1. Frontend open करें: http://localhost:3000
2. **Sign Up** page par jaayें
3. Account details enter करें
4. **Create Account** click करें
5. **Success**: OTP email receive hoga
6. **Development Mode**: Backend console mein OTP dikhega

### Forgot Password Test:
1. **Sign In** page par jaayें
2. **Forgot password?** link click करें
3. Email address enter करें
4. **Send Reset Link** click करें
5. **Success**: Reset link email receive hoga
6. **Development Mode**: Backend console mein reset link dikhega

## 🔧 Development Mode (Without Email Setup)

Agar email configure nahi karna chaahte, toh development mode use kar sakte hain:

### Backend Console Monitor Karें:
```bash
cd backend
npm run dev
```

**Console mein yeh dikhega:**
```
📧 DEVELOPMENT MODE - OTP Details:
👤 Name: Test User
📧 Email: test@example.com
🔢 OTP: 123456
⏰ Expires: 12/13/2024, 3:45:23 PM

📝 Note: Use this OTP to verify account
```

### Steps:
1. Registration करें frontend se
2. Backend console mein OTP copy करें
3. Frontend mein OTP enter करें
4. Account verify ho jaayega

## 🐛 Common Issues & Solutions

### Issue 1: "Email service not configured"
**Solution:**
- `.env` file mein EMAIL_USER aur EMAIL_PASS set करें
- Backend restart करें

### Issue 2: "Authentication failed" 
**Solution:**
- Gmail mein 2-Step Verification enable करें
- New app password generate करें
- Spaces के साथ app password use करें

### Issue 3: Email nhi aa rhi
**Solution:**
- Spam folder check करें
- Gmail address correctly spelled hai check करें
- Backend console mein logs देखें

### Issue 4: OTP expire ho gaya
**Solution:**
- OTP verification page mein **Resend OTP** click करें
- Development mode मein backend console से new OTP copy करें

## 📋 Quick Setup Checklist

- [ ] Gmail App Password generate kiya
- [ ] `.env` file mein email credentials add kiye
- [ ] Backend server restart kiya
- [ ] Registration test kiya (OTP mili ya console mein dekhi)
- [ ] Forgot password test kiya (Reset link mila ya console mein dekha)

## 🚀 Production Ready Setup

Email configuration complete karne ke baad:
- ✅ Real emails jayenge users ko
- ✅ OTP aur reset links proper email mein milenge
- ✅ No console dependencies

## 💡 Pro Tip

Development mein console se OTP/reset links use karna safe aur fast hai. Production mein proper email setup zaroor karें!