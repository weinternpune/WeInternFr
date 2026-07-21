const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Application = require('../models/Application');
const { Enrollment, HireRequest } = require('../models/Enrollment');
const User = require('../models/User');
const { UserActivity, UserProgress } = require('../models/UserActivity');

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

    // Calculate real revenue from paid enrollments
    const paidEnrollmentsData = await Enrollment.find({ paymentStatus: 'paid' }).select('coursePrice createdAt');
    const totalRevenue = paidEnrollmentsData.reduce((sum, enrollment) => sum + (enrollment.coursePrice || 0), 0);

    // Calculate students per course
const enrollments = await Enrollment.find().select("courseName");

const courseMap = {};

enrollments.forEach((enrollment) => {
  const course = enrollment.courseName;

  if (!courseMap[course]) {
    courseMap[course] = 0;
  }

  courseMap[course]++;
});

const courseData = Object.entries(courseMap).map(([name, students]) => ({
  name,
  students,
}));


    // Calculate monthly data for the last 8 months
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const monthApplications = await Application.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      const monthEnrollments = await Enrollment.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      const monthRevenue = await Enrollment.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: date, $lt: nextDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$coursePrice' }
          }
        }
      ]);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        applications: monthApplications,
        enrollments: monthEnrollments,
        revenue: monthRevenue[0]?.total || 0
      });
    }

    const recentApplications = await Application.find().sort('-createdAt').limit(5);
    const recentEnrollments = await Enrollment.find().sort('-createdAt').limit(5).populate('user', 'name email');

    // Calculate real weekly signups
const weeklyUsers = [];
const today = new Date();

// Start from Monday
const currentDay = today.getDay(); // Sunday = 0
const monday = new Date(today);

monday.setHours(0, 0, 0, 0);

const diff = currentDay === 0 ? 6 : currentDay - 1;
monday.setDate(today.getDate() - diff);

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

for (let i = 0; i < 7; i++) {
  const start = new Date(monday);
  start.setDate(monday.getDate() + i);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const users = await User.countDocuments({
    role: "student",
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });

  weeklyUsers.push({
    day: dayNames[i],
    users,
  });
}

console.log("Weekly Users:", weeklyUsers);
    
    res.json({
      success: true,
      data: {
        stats: { 
          totalUsers, 
          totalApplications, 
          totalEnrollments, 
          
          totalHireRequests, 
          pendingApplications, 
          paidEnrollments, 
          totalAdmins,
          totalRevenue 
        },
        monthlyData,
        courseData,
        weeklyUsers,
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

// Get user activity data for admin view
router.get('/users/:id/activity', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user enrollments count
    const enrollmentCount = await Enrollment.countDocuments({ user: userId });
    
    // Get user progress data
    const userProgress = await UserProgress.findOne({ user: userId });
    
    // Get recent user activities
    const recentActivities = await UserActivity.find({ user: userId })
      .sort('-createdAt')
      .limit(20)
      .populate('user', 'name');
    
    // Calculate stats based on actual data
    const totalHours = userProgress ? Math.floor(userProgress.totalStudyHours / 60) : 0; // Convert minutes to hours
    const attendanceRate = userProgress && userProgress.sessionsTotal > 0 
      ? Math.round((userProgress.sessionsAttended / userProgress.sessionsTotal) * 100) 
      : 0;
    
    const activityData = {
      courses: enrollmentCount,
      hoursLogged: totalHours,
      attendance: attendanceRate,
      assignments: userProgress ? userProgress.assignmentsCompleted : 0,
      averageScore: userProgress ? userProgress.averageScore : 0,
      dayStreak: userProgress ? userProgress.currentStreak : 0,
      sessionsAttended: userProgress ? userProgress.sessionsAttended : 0,
      recentActivities: recentActivities
    };
    
    res.json({ success: true, data: activityData });
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

module.exports = router;
