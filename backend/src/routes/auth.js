const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendOTPEmail, sendResetPasswordEmail } = require('../utils/email');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const { trackActivity } = require('../utils/progressTracker');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const trySendEmail = async (fn) => {
  try { await fn(); } catch (e) { console.warn('Email failed (non-fatal):', e.message); }
};

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({ name, email, password, otp, otpExpiry, isVerified: false });

    // Check if email configuration is set up
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email configuration missing in .env file');
      
      // In development, log the OTP to console
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📧 DEVELOPMENT MODE - OTP Details:');
        console.log('👤 Name:', name);
        console.log('📧 Email:', email);
        console.log('🔢 OTP:', otp);
        console.log('⏰ Expires:', otpExpiry.toLocaleString());
        console.log('\n📝 Note: Use this OTP to verify account\n');
        
        return res.status(201).json({ 
          success: true, 
          message: 'Development mode: OTP logged to console', 
          userId: user._id 
        });
      }
      
      // Delete the user if email can't be sent in production
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        success: false, 
        message: 'Email service is not configured. Please contact administrator.' 
      });
    }
    
    try {
      await sendOTPEmail(email, name, otp);
      console.log('✅ OTP email sent successfully to:', email);
      res.status(201).json({ success: true, message: 'OTP sent to email', userId: user._id });
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError.message);
      
      // In development, fallback to console logging
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📧 EMAIL FAILED - OTP Details (Development):');
        console.log('👤 Name:', name);
        console.log('📧 Email:', email);
        console.log('🔢 OTP:', otp);
        console.log('⏰ Expires:', otpExpiry.toLocaleString());
        console.log('\n📝 Note: Use this OTP to verify account\n');
        
        return res.status(201).json({ 
          success: true, 
          message: 'Email failed, but OTP is available in server console', 
          userId: user._id 
        });
      }
      
      // Delete the user if email fails in production
      await User.findByIdAndDelete(user._id);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP email. Please try again later.' 
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Resend OTP
router.post('/resend-otp', otpLimiter, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }
    
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    // Check if email configuration is set up
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email configuration missing in .env file');
      
      // In development, log the OTP to console
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📧 DEVELOPMENT MODE - Resend OTP:');
        console.log('👤 Name:', user.name);
        console.log('📧 Email:', user.email);
        console.log('🔢 New OTP:', otp);
        console.log('⏰ Expires:', user.otpExpiry.toLocaleString());
        console.log('\n📝 Note: Use this new OTP to verify account\n');
        
        return res.json({ 
          success: true, 
          message: 'Development mode: New OTP logged to console' 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Email service is not configured. Please contact administrator.' 
      });
    }
    
    try {
      await sendOTPEmail(user.email, user.name, otp);
      console.log('✅ OTP resent successfully to:', user.email);
      res.json({ success: true, message: 'OTP resent' });
    } catch (emailError) {
      console.error('❌ Failed to resend OTP email:', emailError.message);
      
      // In development, fallback to console logging
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📧 EMAIL FAILED - Resend OTP (Development):');
        console.log('👤 Name:', user.name);
        console.log('📧 Email:', user.email);
        console.log('🔢 New OTP:', otp);
        console.log('⏰ Expires:', user.otpExpiry.toLocaleString());
        console.log('\n📝 Note: Use this new OTP to verify account\n');
        
        return res.json({ 
          success: true, 
          message: 'Email failed, but new OTP is available in server console' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Failed to resend OTP. Please try again later.' 
      });
    }
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked. Contact support.' });
    }
    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await trySendEmail(() => sendOTPEmail(email, user.name, otp));
      return res.status(403).json({ success: false, message: 'Email not verified. OTP sent.', userId: user._id, needsVerification: true });
    }
    
    // Track login activity
    try {
      await trackActivity(user._id, 'login', { duration: 0 });
    } catch (error) {
      console.warn('Failed to track login activity:', error);
    }
    
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      // For security, always return success even if user doesn't exist
      return res.json({ success: true, message: 'If email exists, reset link sent.' });
    }
    
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;
    
    // Check if email configuration is set up
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email configuration missing in .env file');
      
      // In development, log the reset link to console
      if (process.env.NODE_ENV === 'development') {
        console.log('\n🔗 DEVELOPMENT MODE - Reset Link:');
        console.log('📧 Email:', email);
        console.log('🔑 Link:', resetLink);
        console.log('⏰ Expires:', new Date(user.resetPasswordExpiry).toLocaleString());
        console.log('\n📝 Note: Copy this link and paste it in browser to reset password\n');
        
        return res.json({ 
          success: true, 
          message: 'Development mode: Reset link logged to console' 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Email service is not configured. Please contact administrator.' 
      });
    }
    
    try {
      await sendResetPasswordEmail(email, user.name, resetLink);
      console.log('✅ Reset email sent successfully to:', email);
      res.json({ success: true, message: 'Reset link sent to email' });
    } catch (emailError) {
      console.error('❌ Failed to send reset email:', emailError.message);
      
      // In development, fallback to console logging
      if (process.env.NODE_ENV === 'development') {
        console.log('\n🔗 EMAIL FAILED - Reset Link (Development):');
        console.log('📧 Email:', email);
        console.log('🔑 Link:', resetLink);
        console.log('⏰ Expires:', new Date(user.resetPasswordExpiry).toLocaleString());
        console.log('\n📝 Note: Copy this link and paste it in browser to reset password\n');
        
        return res.json({ 
          success: true, 
          message: 'Email failed, but reset link is available in server console' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send reset email. Please try again later.' 
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

module.exports = router;


// Phone OTP verification routes
const phoneOtpStore = new Map(); // In-memory store for OTPs (use Redis in production)
const axios = require('axios');

// Send SMS OTP using MSG91 or Twilio
const sendSMSOTP = async (phone, otp) => {
  try {
    // MSG91 Integration (Popular in India)
    if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
      const msg91Url = `https://control.msg91.com/api/v5/otp`;
      const response = await axios.post(msg91Url, {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: `91${phone}`,
        authkey: process.env.MSG91_AUTH_KEY,
        otp: otp
      });
      console.log('✅ OTP sent via MSG91 to:', phone);
      return { success: true, provider: 'MSG91' };
    }
    
    // Twilio Integration (Alternative)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await twilioClient.messages.create({
        body: `Your WeIntern OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`
      });
      console.log('✅ OTP sent via Twilio to:', phone);
      return { success: true, provider: 'Twilio' };
    }

    // Fast2SMS Integration (Best for India)
    if (process.env.FAST2SMS_API_KEY) {
      const fast2smsUrl = 'https://www.fast2sms.com/dev/bulkV2';
      const message = `Your WeIntern OTP is ${otp}. Valid for 10 minutes. Do not share with anyone. - WeIntern`;
      
      const response = await axios.post(fast2smsUrl, {
        route: 'v3',
        sender_id: 'WEINTN',
        message: message,
        language: 'english',
        flash: 0,
        numbers: phone
      }, {
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY
        }
      });
      
      console.log('\n════════════════════════════════════════');
      console.log('✅ SMS SENT SUCCESSFULLY via Fast2SMS');
      console.log('════════════════════════════════════════');
      console.log('📞 Phone: +91', phone);
      console.log('🔢 OTP:', otp);
      console.log('📱 Provider: Fast2SMS');
      console.log('📊 Response:', response.data);
      console.log('════════════════════════════════════════\n');
      
      return { success: true, provider: 'Fast2SMS' };
    }

    // If no SMS service configured, return false
    return { success: false, provider: 'none' };
  } catch (error) {
    console.error('SMS sending error:', error.response?.data || error.message);
    throw error;
  }
};

// Send phone OTP
router.post('/send-phone-otp', authLimiter, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit phone number required' });
    }

    // Generate random 6-digit OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in memory (use Redis in production)
    phoneOtpStore.set(phone, { otp, otpExpiry });

    // Log OTP to console for development
    console.log('\n════════════════════════════════════════');
    console.log('📱 PHONE OTP - DEVELOPMENT MODE');
    console.log('════════════════════════════════════════');
    console.log('📞 Phone Number: +91', phone);
    console.log('🔢 OTP Code:', otp);
    console.log('⏰ Expires At:', otpExpiry.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('════════════════════════════════════════\n');

    // Try to send SMS
    try {
      const smsResult = await sendSMSOTP(phone, otp);
      
      if (smsResult.success) {
        return res.json({ 
          success: true, 
          message: `OTP sent to +91${phone}`,
          provider: smsResult.provider
        });
      }
    } catch (smsError) {
      console.log('⚠️  SMS service not configured - using console OTP only');
    }

    // Return success (OTP is logged to console)
    return res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // In development, optionally return OTP in response for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify phone OTP
router.post('/verify-phone-otp', authLimiter, async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }

    const storedData = phoneOtpStore.get(phone);
    
    if (!storedData) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    const { otp: storedOtp, otpExpiry } = storedData;

    // Check if OTP expired
    if (new Date() > otpExpiry) {
      phoneOtpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one' });
    }

    // Ensure both OTPs are strings for comparison
    const receivedOtpStr = String(otp).trim();
    const storedOtpStr = String(storedOtp).trim();

    // Verify OTP
    if (receivedOtpStr !== storedOtpStr) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verified successfully
    phoneOtpStore.delete(phone); // Remove OTP after verification

    res.json({ 
      success: true, 
      message: 'Phone number verified successfully',
      phone 
    });
  } catch (error) {
    console.error('Verify phone OTP error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Save user interests
router.post('/save-interests', authLimiter, async (req, res) => {
  try {
    const { phone, interests } = req.body;
    
    if (!phone || !interests || !Array.isArray(interests)) {
      return res.status(400).json({ success: false, message: 'Phone and interests array required' });
    }

    // Store interests (you can extend this to save in database)
    console.log(`📝 User interests saved for phone ${phone}:`, interests);

    // TODO: Save to database with phone number and interests
    // You can create a PhoneVerification model to store this data

    res.json({ 
      success: true, 
      message: 'Interests saved successfully',
      phone,
      interests
    });
  } catch (error) {
    console.error('Save interests error:', error);
    res.status(500).json({ success: false, message: 'Failed to save interests' });
  }
});
