const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const { sendApplicationConfirmation } = require('../utils/email');

// Submit application
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, college, interest, year, duration } = req.body;
    const app = await Application.create({ ...req.body, user: req.user?._id });
    await sendApplicationConfirmation(email, name, duration === '3months' ? '3-Month' : '6-Month');
    res.status(201).json({ success: true, message: 'Application submitted!', data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my applications
router.get('/my', protect, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
