const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../utils/dashboardAnalytics');
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
    const [
      totalUsers,
      totalApplications,
      totalEnrollments,
      totalHireRequests,
      pendingApplications,
      paidEnrollments,
      pendingEnrollments,
      totalAdmins,
      acceptedApplications,
      reviewingApplications,
      rejectedApplications
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Application.countDocuments(),
      Enrollment.countDocuments(),
      HireRequest.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Enrollment.countDocuments({ paymentStatus: 'paid' }),
      Enrollment.countDocuments({
        paymentStatus: { $in: ['pending', 'emi_1', 'emi_2'] }
      }),
      User.countDocuments({ role: 'admin' }),
      Application.countDocuments({ status: 'accepted' }),
      Application.countDocuments({ status: 'reviewing' }),
      Application.countDocuments({ status: 'rejected' })
    ]);

    /*
     * Revenue MUST come from successful payment events, not from
     * Enrollment.coursePrice. This is important for EMI and coupons.
     *
     * New records use paymentHistory.
     * The fallback keeps old MongoDB records working.
     */
    const enrollments = await Enrollment.find({})
      .select(
        'coursePrice finalPrice paymentStatus createdAt amountPaid paymentHistory emiInstallments'
      )
      .lean();

    const paymentEvents = [];

    for (const enrollment of enrollments) {
      if (Array.isArray(enrollment.paymentHistory) &&
          enrollment.paymentHistory.length > 0) {
        for (const payment of enrollment.paymentHistory) {
          if (Number(payment.amount) > 0) {
            paymentEvents.push({
              amount: Number(payment.amount),
              paidAt: payment.paidAt || enrollment.createdAt
            });
          }
        }
        continue;
      }

      // Legacy EMI records
      if (Array.isArray(enrollment.emiInstallments)) {
        for (const payment of enrollment.emiInstallments) {
          if (
            payment.status === 'paid' &&
            Number(payment.amount) > 0
          ) {
            paymentEvents.push({
              amount: Number(payment.amount),
              paidAt: payment.paidAt || enrollment.createdAt
            });
          }
        }
      }

      // Legacy full-payment records
      if (
        enrollment.paymentStatus === 'paid' &&
        (!enrollment.emiInstallments ||
          enrollment.emiInstallments.length === 0)
      ) {
        paymentEvents.push({
          amount: Number(
            enrollment.finalPrice ||
            enrollment.coursePrice ||
            0
          ),
          paidAt: enrollment.createdAt
        });
      }
    }

    const totalRevenue = paymentEvents.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const currentMonthRevenue = paymentEvents
      .filter(
        payment =>
          new Date(payment.paidAt) >= monthStart &&
          new Date(payment.paidAt) < nextMonthStart
      )
      .reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

    // Last 8 calendar months
    const monthlyData = [];

    for (let i = 7; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const nextDate = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        1
      );

      const [monthApplications, monthEnrollments] =
        await Promise.all([
          Application.countDocuments({
            createdAt: {
              $gte: date,
              $lt: nextDate
            }
          }),

          Enrollment.countDocuments({
            createdAt: {
              $gte: date,
              $lt: nextDate
            }
          })
        ]);

      const monthRevenue = paymentEvents
        .filter(payment => {
          const paidAt = new Date(payment.paidAt);
          return paidAt >= date && paidAt < nextDate;
        })
        .reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

      monthlyData.push({
        month: date.toLocaleDateString('en-US', {
          month: 'short'
        }),
        applications: monthApplications,
        enrollments: monthEnrollments,
        revenue: monthRevenue
      });
    }

    // Students per course
    const courseGroups = await Enrollment.aggregate([
      {
        $group: {
          _id: '$courseName',
          students: { $sum: 1 }
        }
      },
      {
        $sort: { students: -1 }
      }
    ]);

    const chartColors = [
      '#2196C9',
      '#E8A820',
      '#27ae60',
      '#6c3483',
      '#dc4545',
      '#1B2A4A'
    ];

    const courseData = courseGroups.map(
      (course, index) => ({
        name: course._id,
        students: course.students,
        color:
          chartColors[index % chartColors.length]
      })
    );

    const recentApplications =
      await Application.find()
        .sort('-createdAt')
        .limit(5)
        .lean();

    const recentEnrollments =
      await Enrollment.find()
        .sort('-createdAt')
        .limit(10)
        .populate('user', 'name email phone')
        .lean();

    // New student registrations for the last 7 days
    const weeklyUsers = [];

    for (let i = 6; i >= 0; i--) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      startOfDay.setDate(
        startOfDay.getDate() - i
      );

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(
        endOfDay.getDate() + 1
      );

      const users =
        await User.countDocuments({
          role: 'student',
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        });

      weeklyUsers.push({
        day: startOfDay.toLocaleDateString(
          'en-US',
          { weekday: 'short' }
        ),
        users
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalApplications,
          totalEnrollments,
          pendingEnrollments,
          totalHireRequests,
          pendingApplications,
          paidEnrollments,
          totalAdmins,
          totalRevenue,
          currentMonthRevenue,
          acceptedApplications,
          reviewingApplications,
          rejectedApplications
        },
        monthlyData,
        weeklyUsers,
        courseData,
        recentApplications,
        recentEnrollments
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
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

    const activityData =
      await getDashboardAnalytics(
        req.params.id
      );

    res.json({
      success: true,
      data: activityData
    });

  } catch (err) {

    console.error(
      'Admin user activity error:',
      err
    );

    res.status(500).json({
      success: false,
      message: err.message
    });
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


// Payment details with EMI tracking
router.get('/payment-details', async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    if (filter === 'full') query.paymentStatus = 'paid';
    else if (filter === 'emi_1') query.paymentStatus = 'emi_1';
    else if (filter === 'emi_2') query.paymentStatus = 'emi_2';
    else if (filter === 'emi_3') query.paymentStatus = 'emi_3';
    else if (filter === 'pending') query.paymentStatus = 'pending';

    const enrollments = await Enrollment.find(query)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .select('name email phone college courseName coursePrice paymentStatus paymentType emiInstallments amountPaid paymentHistory couponApplied couponCode originalPrice discountAmount finalPrice createdAt paymentId');

    // Summary counts
    const [fullPaid, emi1, emi2, emi3, pending] = await Promise.all([
      Enrollment.countDocuments({ paymentStatus: 'paid' }),
      Enrollment.countDocuments({ paymentStatus: 'emi_1' }),
      Enrollment.countDocuments({ paymentStatus: 'emi_2' }),
      Enrollment.countDocuments({ paymentStatus: 'emi_3' }),
      Enrollment.countDocuments({ paymentStatus: 'pending' }),
    ]);

    res.json({ success: true, data: enrollments, summary: { fullPaid, emi1, emi2, emi3, pending } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
