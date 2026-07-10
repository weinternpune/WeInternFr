# 📱 SMS OTP Setup Guide - Fast2SMS

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Fast2SMS Account
1. Go to: https://www.fast2sms.com/
2. Click "Sign Up" (Top right)
3. Enter your details:
   - Name
   - Email
   - Mobile Number
   - Password
4. Verify your mobile number with OTP
5. Login to dashboard

### Step 2: Get API Key
1. After login, go to: https://www.fast2sms.com/dashboard/dev-api
2. You'll see your **API KEY** at the top
3. Copy this API key (looks like: `xxxxxxxxxxxxxxxxxxx`)

### Step 3: Add Credits (For Testing)
1. Go to: https://www.fast2sms.com/dashboard/wallet
2. Add ₹20-50 for testing (each SMS costs ~₹0.20)
3. Payment options: UPI, Card, Net Banking

### Step 4: Configure Backend
1. Open `backend/.env` file
2. Find this line:
   ```
   # FAST2SMS_API_KEY=your_fast2sms_api_key
   ```
3. Replace with your actual API key:
   ```
   FAST2SMS_API_KEY=your_actual_api_key_here
   ```
4. Save the file

### Step 5: Restart Backend
```bash
cd backend
npm start
```

---

## ✅ Testing

1. Open your website: http://localhost:3000
2. Go to Courses section
3. Click "Enroll Now" on any course
4. Enter your 10-digit mobile number
5. Click "Send OTP"
6. **You will receive SMS on your phone!** 📱
7. Enter OTP and verify

---

## 💰 Pricing

- **Per SMS**: ₹0.20 (20 paise)
- **Minimum Recharge**: ₹20
- **100 SMS**: ₹20 only
- **1000 SMS**: ₹200 only

---

## 🔍 Troubleshooting

### Issue: OTP Not Received

**Check 1: Balance**
- Go to dashboard: https://www.fast2sms.com/dashboard/wallet
- Check if you have balance

**Check 2: API Key**
- Verify API key is correct in `.env`
- No spaces before/after the key
- Remove `#` from the line

**Check 3: Phone Number**
- Use 10 digits only (no +91)
- Example: `9876543210` ✅
- Not: `+919876543210` ❌

**Check 4: Backend Logs**
- Check backend terminal for errors
- Should see: `✅ OTP sent via Fast2SMS to: XXXXXXXXXX`

### Issue: "Invalid API Key"

**Solution:**
1. Login to Fast2SMS
2. Go to: https://www.fast2sms.com/dashboard/dev-api
3. Copy API key again
4. Update in `.env` file
5. Restart backend

### Issue: "Insufficient Balance"

**Solution:**
1. Add credits: https://www.fast2sms.com/dashboard/wallet
2. Minimum ₹20 recharge

---

## 🎯 Alternative: MSG91 (Better for Production)

MSG91 is more reliable for production use.

### Setup MSG91:
1. Go to: https://msg91.com/
2. Sign Up for free account
3. Get 100 free credits for testing
4. Go to: https://control.msg91.com/app/setting/authkey
5. Copy your **Auth Key**
6. Create OTP Template:
   - Go to Templates
   - Create new template
   - Get **Template ID**

### Configure in .env:
```env
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_TEMPLATE_ID=your_msg91_template_id
```

---

## 📝 Current Configuration

After setup, your `.env` should have:

```env
# SMS OTP Configuration
FAST2SMS_API_KEY=your_actual_api_key_here
```

OR

```env
# SMS OTP Configuration  
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_TEMPLATE_ID=your_msg91_template_id
```

---

## 🔐 Security Notes

1. ✅ Never commit `.env` file to git
2. ✅ Keep API key secret
3. ✅ Add `.env` to `.gitignore`
4. ✅ Use different keys for dev/production
5. ✅ Rotate keys periodically

---

## 📊 Backend Behavior

### With Fast2SMS Configured:
- ✅ Sends actual SMS to phone
- ✅ Backend logs: "✅ OTP sent via Fast2SMS"
- ✅ User receives SMS within 5-10 seconds

### Without Fast2SMS:
- ⚠️ OTP only prints to console
- ⚠️ Backend logs: "OTP sent successfully (console only)"
- ⚠️ User has to check backend terminal

---

## 🎯 Summary

1. **Sign up**: https://www.fast2sms.com/
2. **Get API Key**: Dashboard → Dev API
3. **Add Credits**: ₹20 for testing
4. **Update .env**: `FAST2SMS_API_KEY=your_key`
5. **Restart Backend**: `npm start`
6. **Test**: OTP will come on phone! 📱

---

## 📞 Fast2SMS Support

- Website: https://www.fast2sms.com/
- Support: https://www.fast2sms.com/dashboard/support
- Docs: https://docs.fast2sms.com/
- Pricing: https://www.fast2sms.com/pricing

---

## ✨ Quick Commands

```bash
# Install backend dependencies (if needed)
cd backend
npm install axios

# Restart backend after .env changes
npm start

# Check if Fast2SMS is working
# Look for this in backend logs:
# ✅ OTP sent via Fast2SMS to: XXXXXXXXXX
```

Done! 🚀
