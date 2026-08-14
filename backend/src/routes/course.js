const express = require('express');
const router = express.Router();
const { Enrollment } = require('../models/Enrollment');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const { sendEnrollmentConfirmation } = require('../utils/email');

// Enroll in course
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseName, coursePrice, name, email, phone, college, degree, year } = req.body;
    const enrollment = await Enrollment.create({
      user: req.user._id,
      courseName,
      coursePrice,
      name,
      email,
      phone,
      college,
      degree,
      year
    });

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          enrolledCourses: enrollment._id
        }
      }
    );

    res.status(201).json({
      success: true,
      message:
        'Enrollment created. Payment is pending.',
      data: enrollment
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my enrollments
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete enrollment (pending only)
router.delete('/enroll/:id', protect, adminOnly, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Enrollment deleted successfully'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
