const express = require('express');
const router = express.Router();
const { HireRequest } = require('../models/Enrollment');
const { sendHireInquiryNotification } = require('../utils/email');

router.post('/hire', async (req, res) => {
  try {
    const hire = await HireRequest.create(req.body);
    await sendHireInquiryNotification(req.body);
    res.status(201).json({ success: true, message: 'Inquiry sent! We\'ll respond within 24 hours.', data: hire });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
