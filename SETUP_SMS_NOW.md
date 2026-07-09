# 🚀 SETUP SMS IN 5 MINUTES

## आसान हिंदी में Setup Guide

### Step 1: Fast2SMS Account बनाओ (2 minutes)
1. खोलो: https://www.fast2sms.com/
2. Click करो "Sign Up" पर
3. भरो:
   - आपका नाम
   - Email
   - Mobile Number (10 digit)
   - Password
4. Mobile पर OTP आएगा, verify करो
5. Login करो

### Step 2: API Key लो (1 minute)
1. Login के बाद यहाँ जाओ: https://www.fast2sms.com/dashboard/dev-api
2. ऊपर दिखेगा **API KEY**
3. Copy करो (looks like: `ABcdefGHijKLmnop1234`)

### Step 3: Balance Add करो (1 minute)
1. जाओ: https://www.fast2sms.com/dashboard/wallet
2. ₹20-50 add करो (testing के लिए)
3. हर SMS = ₹0.20 (20 paise)
4. Payment: UPI / Card / Net Banking

### Step 4: Code में API Key डालो (30 seconds)
1. खोलो: `backend/.env` file
2. ढूंढो यह line:
   ```
   FAST2SMS_API_KEY=your_fast2sms_api_key_here
   ```
3. Replace करो अपनी actual API key से:
   ```
   FAST2SMS_API_KEY=ABcdefGHijKLmnop1234
   ```
4. Save करो file

### Step 5: Backend Restart करो (30 seconds)
```bash
cd backend
npm start
```

---

## ✅ Test करो

1. Website खोलो: http://localhost:3000
2. Courses section में जाओ
3. कोई course पर "Enroll Now" click करो
4. अपना 10-digit mobile number डालो
5. "Send OTP" click करो
6. **5-10 seconds में SMS आएगा आपके phone पर!** 📱
7. OTP enter करो और verify करो

---

## 🎯 Backend में देखोगे

Terminal में दिखेगा:

```
════════════════════════════════════════
✅ SMS SENT SUCCESSFULLY via Fast2SMS
════════════════════════════════════════
📞 Phone: +91 9876543210
🔢 OTP: 123456
📱 Provider: Fast2SMS
📊 Response: { return: true, ... }
════════════════════════════════════════
```

---

## ⚠️ अगर SMS नहीं आए

### Check 1: Balance
- Dashboard खोलो: https://www.fast2sms.com/dashboard/wallet
- Balance check करो (minimum ₹2-3 hona chahiye)

### Check 2: API Key सही है?
- `.env` file check करो
- API key में कोई space नहीं होना चाहिए
- `#` symbol हटा दो line के आगे से

### Check 3: Phone Number सही है?
- ✅ सही: `9876543210` (10 digits)
- ❌ गलत: `+919876543210` (with +91)
- ❌ गलत: `09876543210` (with 0)

### Check 4: Backend Running है?
```bash
cd backend
npm start
```

---

## 💰 Cost कितनी है?

- **हर SMS**: ₹0.20 (बस 20 paise!)
- **100 SMS**: ₹20
- **500 SMS**: ₹100
- **Testing**: ₹20 add करो, 100 SMS मिलेंगे

---

## 🔐 Important

1. ✅ `.env` file को कभी git पर upload मत करो
2. ✅ API key किसी को मत बताओ
3. ✅ `.gitignore` में `.env` add करो

---

## 📝 Example Configuration

आपकी `.env` file ऐसी दिखनी चाहिए:

```env
# SMS Configuration
FAST2SMS_API_KEY=ABcdefGHijKLmnop1234

# या अगर MSG91 use कर रहे हो
# MSG91_AUTH_KEY=your_msg91_key
# MSG91_TEMPLATE_ID=your_template_id
```

---

## ✨ Summary

1. ✅ Fast2SMS पर sign up करो: https://www.fast2sms.com/
2. ✅ API Key copy करो: Dashboard → Dev API
3. ✅ ₹20 add करो wallet में
4. ✅ `.env` में API key paste करो
5. ✅ Backend restart करो: `npm start`
6. ✅ Test करो - SMS आ जाएगा! 📱

---

## 🆘 Help Chahiye?

- Fast2SMS Dashboard: https://www.fast2sms.com/dashboard
- Support: https://www.fast2sms.com/dashboard/support
- Documentation: https://docs.fast2sms.com/

---

## 🎯 Alternative: MSG91 (Production के लिए Better)

अगर Fast2SMS काम नहीं कर रहा, MSG91 try करो:

1. Sign up: https://msg91.com/
2. 100 FREE credits मिलते हैं
3. Setup guide: `SMS_SETUP_GUIDE.md` देखो

---

**Done! Ab OTP phone पर आएगा! 📱🚀**
