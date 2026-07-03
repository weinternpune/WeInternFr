const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { trackActivity, getUserStats, initializeUserProgress } = require('../utils/progressTracker');

// Get profile
router.get('/profile', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, college, year, interest } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, college, year, interest },
      { new: true }
    ).select('-password -otp -resetPasswordToken');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const stats = await getUserStats(req.user._id);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Track user activity (for logging sessions, practice, etc.)
router.post('/track-activity', protect, async (req, res) => {
  try {
    const { activityType, details } = req.body;
    const result = await trackActivity(req.user._id, activityType, details);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Initialize user progress (for existing users)
router.post('/initialize-progress', protect, async (req, res) => {
  try {
    const progress = await initializeUserProgress(req.user._id);
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
