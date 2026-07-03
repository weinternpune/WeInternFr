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
