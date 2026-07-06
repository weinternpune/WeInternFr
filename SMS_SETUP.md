# SMS OTP Setup Guide for WeIntern

## Overview
WeIntern phone verification system supports multiple SMS providers:
- **MSG91** (Recommended for India)
- **Twilio** (International)
- **Fast2SMS** (Alternative for India)

## Option 1: MSG91 Setup (Recommended for India)

### Step 1: Create MSG91 Account
1. Visit https://msg91.com/
2. Sign up for a free account
3. Complete verification process
4. Get free credits (₹20-50 typically)

### Step 2: Get API Credentials
1. Go to MSG91 Dashboard
2. Navigate to **API** section
3. Copy your **Auth Key**
4. Create an OTP template:
   - Template Name: `WeIntern OTP`
   - Template: `Your WeIntern OTP is ##OTP##. Valid for 10 minutes. Do not share.`
   - Copy the **Template ID**

### Step 3: Configure Environment Variables
Add to your `backend/.env` file:

```env
# MSG91 SMS Configuration
MSG91_AUTH_KEY=your_msg91_auth_key_here
MSG91_TEMPLATE_ID=your_template_id_here
```

### Step 4: Test
1. Restart backend server: `npm run dev`
2. Try phone verification on frontend
3. OTP will be sent to the actual phone number!

---

## Option 2: Twilio Setup (International)

### Step 1: Create Twilio Account
1. Visit https://www.twilio.com/
2. Sign up (free trial includes $15 credit)
3. Complete verification

### Step 2: Get Credentials
1. Go to Twilio Console
2. Copy **Account SID**
3. Copy **Auth Token**
4. Get a Twilio phone number

### Step 3: Install Twilio SDK
```bash
cd backend
npm install twilio
```

### Step 4: Configure Environment Variables
Add to your `backend/.env` file:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Step 5: Test
1. Restart backend: `npm run dev`
2. OTP will be sent via Twilio!

---

## Option 3: Fast2SMS Setup (Alternative for India)

### Step 1: Create Account
1. Visit https://www.fast2sms.com/
2. Sign up and verify
3. Get free SMS credits

### Step 2: Get API Key
1. Go to Dashboard
2. Navigate to **Dev API**
3. Copy your **API Key**

### Step 3: Configure Environment Variables
Add to your `backend/.env` file:

```env
# Fast2SMS Configuration
FAST2SMS_API_KEY=your_fast2sms_api_key
```

### Step 4: Test
Restart backend and test!

---

## Development Mode (No SMS Service)

If no SMS service is configured, the system will:
1. Log OTP to backend console (development only)
2. Include OTP in API response (development only)
3. This allows testing without SMS credits

---

## Production Recommendations

### For Indian Users: MSG91
- ✅ Best rates for India
- ✅ High delivery rate
- ✅ Easy setup
- ✅ Template-based OTP
- **Cost**: ~₹0.15-0.20 per SMS

### For International: Twilio
- ✅ Global coverage
- ✅ Reliable delivery
- ✅ Good documentation
- **Cost**: ~$0.0075 per SMS

---

## Testing Steps

1. **Configure** one of the SMS providers above
2. **Restart** backend server
3. **Visit** WeIntern homepage
4. **Wait** 15 seconds on "Explore Programs" section
5. **Popup** will appear
6. **Enter** real 10-digit phone number
7. **Click** "Send OTP"
8. **Receive** OTP on actual phone number! 📱
9. **Enter** OTP and complete verification

---

## Troubleshooting

### OTP not received?
1. Check backend console for errors
2. Verify API credentials in `.env`
3. Ensure phone number is valid (10 digits)
4. Check SMS service balance/credits
5. Check spam/promotional folder in messages

### API Error?
1. Verify API key is correct
2. Check if SMS service is active
3. Ensure template is approved (MSG91)
4. Check rate limits

### Development Mode?
- If no SMS service configured, check backend console
- OTP will be printed there for testing

---

## Current Status

✅ Backend API endpoints ready
✅ Multiple SMS providers supported
✅ Fallback to console in development
✅ Frontend integration complete
✅ 15-second timer implemented
✅ Interest selection working
✅ Content blur protection active

**Next Step**: Choose an SMS provider and configure your `.env` file!

---

## Recommended: MSG91 Quick Start

**Fastest way to get started with real SMS:**

1. Visit: https://msg91.com/signup
2. Sign up with email
3. Get Auth Key from dashboard
4. Create OTP template
5. Add to `.env`:
   ```
   MSG91_AUTH_KEY=your_key
   MSG91_TEMPLATE_ID=your_template_id
   ```
6. Restart backend: `npm run dev`
7. Test with real phone number!

**That's it! OTP will be sent to actual phone numbers! 🎉**
