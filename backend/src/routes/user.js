const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

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

module.exports = router;
