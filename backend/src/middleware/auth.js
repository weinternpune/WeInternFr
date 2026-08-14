const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    console.log("========== PROTECT ==========");

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ No token received");
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -otp -resetPasswordToken"
    );

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Authenticate when a token is present, but allow public requests.
// Useful for the public application form: logged-in applications
// are linked to the real User document, while guests can still apply.
const optionalProtect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user =
      await User.findById(
        decoded.id
      ).select(
        "-password -otp -resetPasswordToken"
      );

    if (user) {
      req.user = user;
    }

    next();
  } catch (err) {
    // Do not reject a public request because an optional token is bad.
    next();
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

const mentorOnly = (req, res, next) => {
  if (req.user?.role !== 'mentor') {
    return res.status(403).json({ success: false, message: 'Mentor access required' });
  }
  next();
};

const mentorOrAdmin = (req, res, next) => {
  if (!['mentor', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Mentor or admin access required' });
  }
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Only students can submit cohort applications.',
    });
  }
  next();
};

module.exports = { protect, optionalProtect, adminOnly, mentorOnly, mentorOrAdmin, studentOnly };
