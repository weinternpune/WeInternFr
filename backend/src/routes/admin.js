const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Application = require('../models/Application');
const { Enrollment, HireRequest } = require('../models/Enrollment');
const User = require('../models/User');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalApplications, totalEnrollments, totalHireRequests,
      pendingApplications, paidEnrollments, totalAdmins] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Application.countDocuments(),
      Enrollment.countDocuments(),
      HireRequest.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Enrollment.countDocuments({ paymentStatus: 'paid' }),
      User.countDocuments({ role: 'admin' })
    ]);
    const recentApplications = await Application.find().sort('-createdAt').limit(5);
    const recentEnrollments = await Enrollment.find().sort('-createdAt').limit(5).populate('user', 'name email');
    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalApplications, totalEnrollments, totalHireRequests, pendingApplications, paidEnrollments, totalAdmins },
        recentApplications,
        recentEnrollments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { college: { $regex: search, $options: 'i' } }
    ];
    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: applications, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update application status
router.patch('/applications/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { courseName: { $regex: search, $options: 'i' } }
    ];
    const total = await Enrollment.countDocuments(query);
    const enrollments = await Enrollment.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'name email');
    res.json({ success: true, data: enrollments, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all hire requests
router.get('/hire-requests', async (req, res) => {
  try {
    const hireRequests = await HireRequest.find().sort('-createdAt');
    res.json({ success: true, data: hireRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update hire request status
router.patch('/hire-requests/:id', async (req, res) => {
  try {
    const hr = await HireRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: hr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'student' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -otp -resetPasswordToken')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email phone college createdAt isVerified authProvider').sort('-createdAt');
    res.json({ success: true, data: admins, total: admins.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Block / Unblock user
router.patch('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot block admin' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: user.isBlocked ? 'User blocked' : 'User unblocked', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Change user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Role updated', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reset user password by admin
router.patch('/users/:id/reset-password', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.password = password;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Block / Unblock user
router.patch('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot block admin' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: user.isBlocked ? 'Blocked' : 'Unblocked', data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Change role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Reset password
router.patch('/users/:id/reset-password', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.password = req.body.password;
    await user.save();
    res.json({ success: true, message: 'Password reset' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
