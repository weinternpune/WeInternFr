const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();

const { protect, mentorOnly, mentorOrAdmin, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const MentorClass = require('../models/MentorClass');
const Attendance = require('../models/MentorAttendance');
const Assignment = require('../models/MentorAssignment');
const Submission = require('../models/MentorSubmission');
const Project = require('../models/MentorProject');
const Note = require('../models/MentorNote');
const Message = require('../models/MentorMessage');
const Notification = require('../models/MentorNotification');
const { UserActivity } = require('../models/UserActivity');
const { Enrollment } = require('../models/Enrollment');
const Application = require('../models/Application');

const studentFilterForMentor = (mentorId) => ({
  role: 'student',
  mentor: mentorId,
  isBlocked: { $ne: true }
});

async function resolveTargetMentorId(req) {
  if (req.user?.role === 'mentor') {
    return req.user._id;
  }
  if (req.user?.role === 'admin') {
    const requestedMentorId = req.query?.mentorId || req.body?.mentorId || req.headers['x-target-mentor-id'];
    if (requestedMentorId && requestedMentorId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(requestedMentorId)) {
        const found = await User.findOne({ _id: requestedMentorId, role: 'mentor' });
        if (found) return found._id;
      }
    }
    // Fallback for admin: find the first active mentor
    const firstMentor = await User.findOne({ role: 'mentor', isBlocked: { $ne: true } }).sort({ createdAt: 1 });
    return firstMentor ? firstMentor._id : null;
  }
  return null;
}

async function getMentorUser(mentorId) {
  if (!mentorId) return null;
  return User.findById(mentorId).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');
}

async function getAssignedStudents(mentorId) {
  if (!mentorId) return [];
  return User.find(studentFilterForMentor(mentorId))
    .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
    .sort({ name: 1 });
}

async function assertAssignedStudent(mentorId, studentId, isAdmin = false) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) return null;
  if (isAdmin) {
    return User.findOne({ _id: studentId, role: 'student' });
  }
  if (!mentorId) return null;
  return User.findOne({ _id: studentId, ...studentFilterForMentor(mentorId) });
}

async function createNotification(recipient, type, title, message, data = {}) {
  try {
    await Notification.create({ recipient, type, title, message, data });
  } catch (err) {
    console.warn('Mentor notification creation failed:', err.message);
  }
}

// Dashboard overview
router.get('/dashboard', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) {
      return res.json({
        success: true,
        data: {
          mentor: { id: null, name: 'No Mentor Available', email: '' },
          stats: {
            totalStudents: 0,
            activeStudents: 0,
            todaysClasses: 0,
            pendingAssignments: 0,
            averageProgress: 0,
            atRiskStudents: 0,
            unreadNotifications: 0
          },
          todaysClasses: [],
          students: [],
          pendingReviews: [],
          projects: [],
          activity: [],
          updatedAt: new Date()
        }
      });
    }

    const mentorUser = await getMentorUser(mentorId);
    const students = await getAssignedStudents(mentorId);
    const studentIds = students.map(s => s._id);

    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(now); endOfDay.setHours(23,59,59,999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [classes, assignments, submissions, activities, attendance, projects, unreadNotifications] = await Promise.all([
      MentorClass.find({
        mentor: mentorId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' }
      }).populate('students', 'name email').sort({ startTime: 1 }),
      Assignment.find({ mentor: mentorId, status: 'active' }).sort({ dueDate: 1 }),
      Submission.find({ mentor: mentorId, status: 'submitted' }),
      UserActivity.find({ user: { $in: studentIds } }).sort({ createdAt: -1 }).limit(500),
      Attendance.find({ mentor: mentorId, student: { $in: studentIds } }),
      Project.find({ mentor: mentorId, student: { $in: studentIds } }),
      Notification.countDocuments({ recipient: mentorId, readAt: null })
    ]);

    const pendingAssignmentIds = new Set(submissions.map(s => String(s.assignment)));
    const pendingReviews = submissions.length;

    const attendanceByStudent = {};
    attendance.forEach(a => {
      const id = String(a.student);
      if (!attendanceByStudent[id]) attendanceByStudent[id] = { total: 0, present: 0 };
      attendanceByStudent[id].total++;
      if (['present','late'].includes(a.status)) attendanceByStudent[id].present++;
    });

    const progressByStudent = {};
    activities.forEach(a => {
      const id = String(a.user);
      if (!progressByStudent[id]) progressByStudent[id] = { minutes: 0, lastActivity: a.createdAt };
      progressByStudent[id].minutes += Number(a.duration || 0);
      if (new Date(a.createdAt) > new Date(progressByStudent[id].lastActivity)) {
        progressByStudent[id].lastActivity = a.createdAt;
      }
    });

    const studentSummaries = students.map(student => {
      const id = String(student._id);
      const att = attendanceByStudent[id] || { total: 0, present: 0 };
      const activity = progressByStudent[id] || { minutes: 0, lastActivity: null };
      const studentAssignments = assignments.filter(a => a.students.length === 0 || a.students.some(x => String(x) === id));
      const completedAssignments = submissions.filter(s => String(s.student) === id && ['reviewed','approved'].includes(s.status)).length;
      const progress = Math.min(100, Math.round((activity.minutes / 600) * 100));
      const attendancePercent = att.total ? Math.round((att.present / att.total) * 100) : 0;
      const pending = Math.max(0, studentAssignments.length - completedAssignments);
      const inactiveDays = activity.lastActivity ? Math.floor((Date.now() - new Date(activity.lastActivity).getTime()) / 86400000) : 999;
      const atRisk = attendancePercent < 75 || progress < 40 || pending >= 3 || inactiveDays >= 5;
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        batch: student.year || 'Unassigned',
        course: student.interest || 'Internship',
        attendance: attendancePercent,
        progress,
        assignmentsCompleted: completedAssignments,
        assignmentsTotal: studentAssignments.length,
        pendingAssignments: pending,
        studyMinutes: activity.minutes,
        lastActivity: activity.lastActivity,
        status: atRisk ? 'At Risk' : progress >= 80 ? 'Excellent' : 'On Track'
      };
    });

    const averageProgress = studentSummaries.length
      ? Math.round(studentSummaries.reduce((s, x) => s + x.progress, 0) / studentSummaries.length)
      : 0;
    const atRisk = studentSummaries.filter(s => s.status === 'At Risk').length;
    const activeStudents = studentSummaries.filter(s => s.lastActivity && (Date.now() - new Date(s.lastActivity).getTime()) <= 7 * 86400000).length;

    const monthlyActivity = await UserActivity.aggregate([
      { $match: { user: { $in: studentIds }, createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          minutes: { $sum: { $ifNull: ['$duration', 0] } },
          activities: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        mentor: {
          id: mentorUser?._id || mentorId,
          name: mentorUser?.name || 'Mentor',
          email: mentorUser?.email || '',
          avatar: mentorUser?.avatar || '',
          expertise: mentorUser?.expertise || [],
          skills: mentorUser?.skills || [],
          experience: mentorUser?.experience || ''
        },
        stats: {
          totalStudents: students.length,
          activeStudents,
          todaysClasses: classes.length,
          pendingAssignments: pendingReviews,
          averageProgress,
          atRiskStudents: atRisk,
          unreadNotifications
        },
        todaysClasses: classes,
        students: studentSummaries,
        pendingReviews: submissions.slice(0, 10),
        projects: projects.slice(0, 10),
        activity: monthlyActivity,
        updatedAt: new Date()
      }
    });
  } catch (err) {
    console.error('Mentor dashboard error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Assigned students
router.get('/students', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const students = await getAssignedStudents(mentorId);
    const ids = students.map(s => s._id);

    const [attendance, activities, submissions, projects] = await Promise.all([
      Attendance.find({ mentor: mentorId, student: { $in: ids } }),
      UserActivity.find({ user: { $in: ids } }).sort({ createdAt: -1 }),
      Submission.find({ mentor: mentorId, student: { $in: ids } }),
      Project.find({ mentor: mentorId, student: { $in: ids } })
    ]);

    const data = students.map(student => {
      const id = String(student._id);
      const att = attendance.filter(a => String(a.student) === id);
      const acts = activities.filter(a => String(a.user) === id);
      const subs = submissions.filter(s => String(s.student) === id);
      const project = projects.find(p => String(p.student) === id);
      const present = att.filter(a => ['present','late'].includes(a.status)).length;
      const attendancePercent = att.length ? Math.round((present / att.length) * 100) : 0;
      const minutes = acts.reduce((sum, a) => sum + Number(a.duration || 0), 0);
      const progress = Math.min(100, Math.round((minutes / 600) * 100));
      const pending = subs.filter(s => s.status === 'submitted').length;
      const lastActivity = acts[0]?.createdAt || null;
      const inactive = !lastActivity || Date.now() - new Date(lastActivity).getTime() > 5 * 86400000;
      const status = attendancePercent < 75 || progress < 40 || pending >= 3 || inactive ? 'At Risk' : progress >= 80 ? 'Excellent' : 'On Track';
      return {
        id: student._id, name: student.name, email: student.email, phone: student.phone,
        batch: student.year || 'Unassigned', course: student.interest || 'Internship',
        attendance: attendancePercent, progress, assignments: subs.length,
        pendingAssignments: pending, lastActivity, status,
        project: project ? { title: project.title, progress: project.progress, status: project.status } : null
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student detail
router.get('/students/:studentId', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const student = await assertAssignedStudent(mentorId, req.params.studentId, req.user.role === 'admin');
    if (!student) return res.status(404).json({ success: false, message: 'Student is not assigned to this mentor' });

    const targetMentorId = student.mentor || mentorId;

    const [activities, attendance, submissions, projects, notes, enrollments] = await Promise.all([
      UserActivity.find({ user: student._id }).sort({ createdAt: -1 }).limit(100),
      Attendance.find({ student: student._id }).populate('classId', 'title date startTime endTime').sort({ markedAt: -1 }),
      Submission.find({ student: student._id }).populate('assignment', 'title dueDate maxScore').sort({ submittedAt: -1 }),
      Project.find({ student: student._id }).sort({ updatedAt: -1 }),
      Note.find({ student: student._id }).sort({ createdAt: -1 }),
      Enrollment.find({ user: student._id }).sort({ createdAt: -1 })
    ]);

    const totalMinutes = activities.reduce((s, a) => s + Number(a.duration || 0), 0);
    const present = attendance.filter(a => ['present','late'].includes(a.status)).length;
    const attendancePercent = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
    const reviewed = submissions.filter(s => typeof s.score === 'number');
    const averageScore = reviewed.length ? Math.round(reviewed.reduce((s, x) => s + x.score, 0) / reviewed.length) : 0;
    const assignmentCompletion = submissions.length ? Math.round((reviewed.length / submissions.length) * 100) : 0;
    const projectProgress = projects.length ? Math.round(projects.reduce((s,p) => s + Number(p.progress || 0), 0) / projects.length) : 0;
    const progress = Math.min(100, Math.round((totalMinutes / 600) * 100));

    const daily = {};
    activities.forEach(a => {
      const key = new Date(a.createdAt).toISOString().slice(0,10);
      daily[key] = (daily[key] || 0) + Number(a.duration || 0);
    });

    res.json({
      success: true,
      data: {
        student,
        metrics: {
          overallProgress: progress,
          courseCompletion: progress,
          assignmentCompletion,
          projectCompletion: projectProgress,
          attendance: attendancePercent,
          assessmentPerformance: averageScore,
          totalStudyMinutes: totalMinutes,
          classesTotal: attendance.length,
          classesAttended: present,
          classesMissed: attendance.filter(a => a.status === 'absent').length
        },
        learningProgress: [
          { module: 'Frontend', progress: Math.min(100, progress + 10) },
          { module: 'Backend', progress: progress },
          { module: 'Database', progress: Math.max(0, progress - 5) },
          { module: 'Deployment', progress: Math.max(0, progress - 15) },
          { module: 'Final Project', progress: projectProgress }
        ],
        attendance,
        submissions,
        projects,
        notes,
        enrollments,
        activity: Object.entries(daily).sort(([a],[b]) => a.localeCompare(b)).map(([date, minutes]) => ({ date, minutes }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Schedule a class
router.post('/classes', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.status(400).json({ success: false, message: 'Mentor not found' });

    const {
      title, description, batch, course, studentIds = [], date, startTime, endTime,
      classType, mode, meetingLink, notes, learningMaterialUrl
    } = req.body;

    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Title, date, start time and end time are required' });
    }

    const validStudents = [];
    for (const id of studentIds) {
      const student = await assertAssignedStudent(mentorId, id, req.user.role === 'admin');
      if (student) validStudents.push(student._id);
    }

    const cls = await MentorClass.create({
      title, description, batch, course, students: validStudents, date, startTime, endTime,
      classType, mode, meetingLink, notes, learningMaterialUrl, mentor: mentorId
    });

    await Promise.all(validStudents.map(studentId =>
      createNotification(studentId, 'class_scheduled', `New class: ${title}`,
        `${new Date(date).toLocaleDateString()} ${startTime}-${endTime}`, { classId: cls._id })
    ));

    const populated = await cls.populate('students', 'name email');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get mentor classes
router.get('/classes', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const filter = { mentor: mentorId };
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }
    const classes = await MentorClass.find(filter).populate('students', 'name email').sort({ date: 1, startTime: 1 });
    res.json({ success: true, data: classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/classes/:id/status', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, mentor: mentorId };
    const cls = await MentorClass.findOneAndUpdate(
      query,
      { status: req.body.status },
      { new: true }
    );
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, data: cls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Attendance
router.get('/attendance', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const filter = { mentor: mentorId };
    if (req.query.classId) filter.classId = req.query.classId;
    const rows = await Attendance.find(filter)
      .populate('student', 'name email')
      .populate('classId', 'title date startTime endTime')
      .sort({ markedAt: -1 });
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/attendance/bulk', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const { classId, records = [] } = req.body;
    const query = req.user.role === 'admin' ? { _id: classId } : { _id: classId, mentor: mentorId };
    const cls = await MentorClass.findOne(query);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });

    const validIds = new Set(cls.students.map(s => String(s)));
    const results = [];

    for (const record of records) {
      if (!validIds.has(String(record.studentId))) continue;
      const attendance = await Attendance.findOneAndUpdate(
        { classId, student: record.studentId },
        { mentor: cls.mentor || mentorId, status: record.status, note: record.note, markedAt: new Date() },
        { new: true, upsert: true }
      );
      results.push(attendance);
      await createNotification(record.studentId, 'attendance', 'Attendance updated',
        `Your attendance for ${cls.title} is marked ${record.status}.`, { classId });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Assignments
router.get('/assignments', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const assignments = await Assignment.find({ mentor: mentorId }).populate('students', 'name email').sort({ dueDate: 1 });
    const ids = assignments.map(a => a._id);
    const submissions = await Submission.find({ mentor: mentorId, assignment: { $in: ids } });
    const data = assignments.map(a => {
      const sub = submissions.filter(s => String(s.assignment) === String(a._id));
      const reviewed = sub.filter(s => typeof s.score === 'number');
      return {
        ...a.toObject(),
        submitted: sub.length,
        pending: Math.max(0, (a.students.length || sub.length) - sub.length),
        reviewed: reviewed.length,
        averageScore: reviewed.length ? Math.round(reviewed.reduce((sum, s) => sum + s.score, 0) / reviewed.length) : 0
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/assignments', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.status(400).json({ success: false, message: 'Mentor not found' });

    const { title, description, batch, course, dueDate, maxScore, studentIds = [] } = req.body;
    if (!title || !dueDate) return res.status(400).json({ success: false, message: 'Title and due date are required' });
    const validStudents = [];
    for (const id of studentIds) {
      const student = await assertAssignedStudent(mentorId, id, req.user.role === 'admin');
      if (student) validStudents.push(student._id);
    }
    const assignment = await Assignment.create({
      title, description, batch, course, dueDate, maxScore, students: validStudents, mentor: mentorId
    });
    await Promise.all(validStudents.map(studentId =>
      createNotification(studentId, 'assignment_created', `New assignment: ${title}`,
        `Due ${new Date(dueDate).toLocaleDateString()}`, { assignmentId: assignment._id })
    ));
    res.status(201).json({ success: true, data: await assignment.populate('students', 'name email') });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/submissions', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const submissions = await Submission.find({ mentor: mentorId })
      .populate('student', 'name email')
      .populate('assignment', 'title dueDate maxScore')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/submissions/:id/review', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const { score, feedback, status = 'reviewed' } = req.body;
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, mentor: mentorId };
    const submission = await Submission.findOne(query).populate('student', 'name email');
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    submission.score = Number(score);
    submission.feedback = feedback || '';
    submission.status = status;
    submission.reviewedAt = new Date();
    await submission.save();

    await createNotification(submission.student._id, 'assignment_submitted',
      `Assignment reviewed: ${submission.assignment?.title || 'Assignment'}`,
      `Your mentor has reviewed your submission. Score: ${submission.score}.`,
      { submissionId: submission._id });

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Projects
router.get('/projects', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const projects = await Project.find({ mentor: mentorId })
      .populate('student', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/projects/:id', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, mentor: mentorId };
    const project = await Project.findOneAndUpdate(
      query,
      { progress: req.body.progress, status: req.body.status, mentorComments: req.body.mentorComments, lastUpdate: new Date() },
      { new: true }
    ).populate('student', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Private mentor notes
router.get('/students/:studentId/notes', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!await assertAssignedStudent(mentorId, req.params.studentId, req.user.role === 'admin')) {
      return res.status(404).json({ success: false, message: 'Student is not assigned to this mentor' });
    }
    const notes = await Note.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/students/:studentId/notes', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!await assertAssignedStudent(mentorId, req.params.studentId, req.user.role === 'admin')) {
      return res.status(404).json({ success: false, message: 'Student is not assigned to this mentor' });
    }
    if (!req.body.note?.trim()) return res.status(400).json({ success: false, message: 'Note is required' });
    const note = await Note.create({ mentor: mentorId, student: req.params.studentId, note: req.body.note.trim() });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Messages / announcements
router.get('/messages', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const messages = await Message.find({
      $or: [{ sender: mentorId }, { recipient: mentorId }]
    }).populate('sender recipient', 'name email role').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/messages', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const { recipientId, subject, message, attachmentUrl } = req.body;
    const student = await assertAssignedStudent(mentorId, recipientId, req.user.role === 'admin');
    if (!student) return res.status(403).json({ success: false, message: 'Student is not assigned to this mentor' });
    const msg = await Message.create({
      sender: mentorId, recipient: student._id, subject, message, attachmentUrl
    });
    const senderName = req.user.name || 'Mentor';
    await createNotification(student._id, 'message', `Message from ${senderName}`, message.slice(0, 120), { messageId: msg._id });
    res.status(201).json({ success: true, data: await msg.populate('recipient', 'name email') });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/announcements', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const { studentIds = [], title, message } = req.body;
    const validStudents = [];
    for (const id of studentIds) {
      const student = await assertAssignedStudent(mentorId, id, req.user.role === 'admin');
      if (student) validStudents.push(student);
    }
    const senderName = req.user.name || 'Mentor';
    await Promise.all(validStudents.map(student =>
      createNotification(student._id, 'message', title || `Announcement from ${senderName}`, message, { mentorId })
    ));
    res.json({ success: true, sent: validStudents.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Notifications
router.get('/notifications', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: [] });

    const notifications = await Notification.find({ recipient: mentorId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/notifications/:id/read', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, recipient: mentorId };
    const notification = await Notification.findOneAndUpdate(
      query,
      { readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reports
router.get('/reports', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    if (!mentorId) return res.json({ success: true, data: { totalStudents: 0, attendanceRate: 0, averageScore: 0, totalStudyHours: 0, projects: 0, completedProjects: 0, assignmentsReviewed: 0, generatedAt: new Date() } });

    const students = await getAssignedStudents(mentorId);
    const ids = students.map(s => s._id);
    const [attendance, submissions, activities, projects] = await Promise.all([
      Attendance.find({ mentor: mentorId, student: { $in: ids } }),
      Submission.find({ mentor: mentorId, student: { $in: ids } }),
      UserActivity.find({ user: { $in: ids } }),
      Project.find({ mentor: mentorId, student: { $in: ids } })
    ]);
    const present = attendance.filter(a => ['present','late'].includes(a.status)).length;
    const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
    const reviewed = submissions.filter(s => typeof s.score === 'number');
    const averageScore = reviewed.length ? Math.round(reviewed.reduce((a,s) => a+s.score,0)/reviewed.length) : 0;
    const totalMinutes = activities.reduce((a,x)=>a+Number(x.duration||0),0);
    const completedProjects = projects.filter(p=>p.status==='completed').length;
    res.json({ success: true, data: {
      totalStudents: students.length,
      attendanceRate, averageScore, totalStudyHours: Math.round(totalMinutes/60*10)/10,
      projects: projects.length, completedProjects,
      assignmentsReviewed: reviewed.length,
      generatedAt: new Date()
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: create a mentor account
router.post('/admin/create', protect, adminOnly, async (req, res) => {
  try {
    const {
      name, email, password, phone,
      expertise = [], skills = [], assignedCourses = [], assignedBatches = [],
      bio = '', experience = '', studentIds = []
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const mentor = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'mentor',
      isVerified: true,
      expertise: Array.isArray(expertise) ? expertise : expertise.split(',').map(x => x.trim()).filter(Boolean),
      skills: Array.isArray(skills) ? skills : skills.split(',').map(x => x.trim()).filter(Boolean),
      assignedCourses: Array.isArray(assignedCourses) ? assignedCourses : assignedCourses.split(',').map(x => x.trim()).filter(Boolean),
      assignedBatches: Array.isArray(assignedBatches) ? assignedBatches : assignedBatches.split(',').map(x => x.trim()).filter(Boolean),
      bio,
      experience
    });

    // If initial students were selected to be allocated to this new mentor
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      await User.updateMany(
        { _id: { $in: studentIds }, role: 'student' },
        { $set: { mentor: mentor._id } }
      );
      for (const sId of studentIds) {
        const student = await User.findById(sId);
        if (student) {
          await createNotification(
            mentor._id,
            'student_assigned',
            'New Student Allocated',
            `${student.name} has been allocated to your mentorship roster.`,
            { studentId: student._id }
          );
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Mentor account created successfully',
      data: await User.findById(mentor._id).select('-password -otp -resetPasswordToken -resetPasswordExpiry')
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: bulk assign/unassign students to/from a mentor
router.post('/admin/assign-students', protect, adminOnly, async (req, res) => {
  try {
    const { mentorId, studentIds, action = 'assign' } = req.body;
    if (!mentorId) return res.status(400).json({ success: false, message: 'mentorId is required' });
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'studentIds array is required' });
    }

    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });

    if (action === 'unassign') {
      await User.updateMany(
        { _id: { $in: studentIds }, mentor: mentor._id },
        { $set: { mentor: null } }
      );
      res.json({ success: true, message: `Deallocated ${studentIds.length} student(s) from ${mentor.name}` });
    } else {
      await User.updateMany(
        { _id: { $in: studentIds }, role: 'student' },
        { $set: { mentor: mentor._id } }
      );
      for (const sId of studentIds) {
        const student = await User.findById(sId);
        if (student) {
          await createNotification(
            mentor._id,
            'student_assigned',
            'New Student Assigned',
            `${student.name} has been allocated to your mentorship batch.`,
            { studentId: student._id }
          );
        }
      }
      res.json({ success: true, message: `Successfully allocated ${studentIds.length} student(s) to ${mentor.name}` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: get all students with mentor information and enrolled domains for allocation modal
router.get('/admin/students-with-mentors', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isBlocked: { $ne: true } })
      .select('name email phone college year interest mentor createdAt')
      .populate('mentor', 'name email')
      .sort({ name: 1 })
      .lean();

    // Enrich each student with their enrolled course/domain information
    const enriched = await Promise.all(
      students.map(async (s) => {
        const [ens, apps] = await Promise.all([
          Enrollment.find({ $or: [{ user: s._id }, { email: s.email }] })
            .select('courseName paymentStatus status createdAt')
            .lean()
            .catch(() => []),
          Application.find({ $or: [{ user: s._id }, { email: s.email }] })
            .select('interest status createdAt')
            .lean()
            .catch(() => [])
        ]);

        const enrolledCourseNames = ens.map(e => e.courseName).filter(Boolean);
        const appInterests = apps.map(a => a.interest).filter(Boolean);
        const uniqueDomains = Array.from(new Set([...enrolledCourseNames, ...appInterests, s.interest].filter(Boolean)));
        const primaryDomain = uniqueDomains[0] || s.interest || 'General Internship';

        return {
          ...s,
          domain: primaryDomain,
          allDomains: uniqueDomains,
          enrolledCourses: enrolledCourseNames,
          enrollmentsCount: ens.length,
          applicationCount: apps.length
        };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: single assign student (legacy support)
router.patch('/admin/assign-student/:studentId', protect, adminOnly, async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.body.mentorId, role: 'mentor' });
    const student = await User.findOne({ _id: req.params.studentId, role: 'student' });
    if (!mentor || !student) return res.status(404).json({ success: false, message: 'Mentor or student not found' });
    student.mentor = mentor._id;
    await student.save();
    await createNotification(mentor._id, 'student_assigned', 'New student assigned', `${student.name} has been assigned to you.`, { studentId: student._id });
    res.json({ success: true, data: { studentId: student._id, mentorId: mentor._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: overview of all mentors and their collective activity
router.get('/admin/all-mentors-overview', protect, adminOnly, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
      .sort({ name: 1 });

    const mentorIds = mentors.map(m => m._id);

    const [classes, assignments, submissions, announcements, totalStudents] = await Promise.all([
      MentorClass.find({ mentor: { $in: mentorIds }, status: { $ne: 'cancelled' } }).populate('mentor', 'name email avatar').sort({ date: -1 }).limit(20),
      Assignment.find({ mentor: { $in: mentorIds } }).populate('mentor', 'name email').sort({ createdAt: -1 }).limit(20),
      Submission.find({ mentor: { $in: mentorIds }, status: 'submitted' }).populate('mentor student', 'name email'),
      Notification.find({ type: 'message' }).populate('recipient', 'name email').sort({ createdAt: -1 }).limit(30),
      User.countDocuments({ role: 'student', mentor: { $in: mentorIds } })
    ]);

    const mentorsSummary = await Promise.all(mentors.map(async m => {
      const studentCount = await User.countDocuments(studentFilterForMentor(m._id));
      const classCount = await MentorClass.countDocuments({ mentor: m._id, status: { $ne: 'cancelled' } });
      const assignmentCount = await Assignment.countDocuments({ mentor: m._id });
      const pendingCount = await Submission.countDocuments({ mentor: m._id, status: 'submitted' });
      return {
        ...m.toObject(),
        studentCount,
        classCount,
        assignmentCount,
        pendingCount
      };
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalMentors: mentors.length,
          totalStudentsMentored: totalStudents,
          totalClasses: classes.length,
          totalAssignments: assignments.length,
          totalPendingSubmissions: submissions.length
        },
        mentors: mentorsSummary,
        recentClasses: classes,
        recentAssignments: assignments,
        recentAnnouncements: announcements
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mentor profile
router.get('/profile', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const mentor = await User.findById(mentorId).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');
    res.json({ success: true, data: mentor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/profile', protect, mentorOrAdmin, async (req, res) => {
  try {
    const mentorId = await resolveTargetMentorId(req);
    const allowed = ['name','phone','avatar','expertise','skills','assignedCourses','assignedBatches','experience','bio'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    const mentor = await User.findByIdAndUpdate(mentorId, updates, { new: true, runValidators: true })
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');
    res.json({ success: true, data: mentor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Admin mentor management
router.get('/admin/list', protect, adminOnly, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry').sort({ createdAt: -1 });
    const data = await Promise.all(mentors.map(async mentor => ({
      ...mentor.toObject(),
      studentCount: await User.countDocuments(studentFilterForMentor(mentor._id))
    })));
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.patch('/admin/mentor/:mentorId', protect, adminOnly, async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.params.mentorId, role: 'mentor' });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
    const allowed = ['name','phone','expertise','skills','assignedCourses','assignedBatches','experience','bio','isBlocked'];
    allowed.forEach(key => { if (req.body[key] !== undefined) mentor[key] = req.body[key]; });
    await mentor.save();
    res.json({ success: true, data: mentor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Student-side class, assignment, attendance, notification and messaging APIs.
router.get('/student/classes', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const classes = await MentorClass.find({ students: req.user._id, status: { $ne: 'cancelled' } })
      .populate('mentor', 'name email avatar').sort({ date: 1, startTime: 1 }).limit(100);
    res.json({ success: true, data: classes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/student/assignments', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const assignments = await Assignment.find({ students: req.user._id, status: 'active' }).populate('mentor', 'name email').sort({ dueDate: 1 });
    const submissions = await Submission.find({ student: req.user._id, assignment: { $in: assignments.map(a => a._id) } });
    res.json({ success: true, data: assignments.map(a => ({ ...a.toObject(), submission: submissions.find(s => String(s.assignment) === String(a._id)) || null })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/student/assignments/:assignmentId/submit', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const assignment = await Assignment.findOne({ _id: req.params.assignmentId, students: req.user._id });
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    const existing = await Submission.findOne({ assignment: assignment._id, student: req.user._id });
    if (existing && ['reviewed','approved'].includes(existing.status)) return res.status(400).json({ success: false, message: 'This submission has already been reviewed' });
    const submission = existing || new Submission({ assignment: assignment._id, mentor: assignment.mentor, student: req.user._id });
    submission.githubUrl = req.body.githubUrl;
    submission.fileUrl = req.body.fileUrl;
    submission.answer = req.body.answer;
    submission.submittedAt = new Date();
    submission.status = 'submitted';
    await submission.save();
    await createNotification(assignment.mentor, 'assignment_submitted', 'New assignment submission', `${req.user.name} submitted ${assignment.title}.`, { submissionId: submission._id, assignmentId: assignment._id, studentId: req.user._id });
    res.status(201).json({ success: true, data: submission });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/student/attendance', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const rows = await Attendance.find({ student: req.user._id }).populate('mentor', 'name email').populate('classId', 'title date startTime endTime').sort({ markedAt: -1 });
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/student/notifications', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: notifications });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/student/messages', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const messages = await Message.find({ $or: [{ sender: req.user._id }, { recipient: req.user._id }] }).populate('sender recipient', 'name email role').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Student: get complete overview of assigned mentor, classes, attendance, assignments, and announcements
router.get('/student/mentor-overview', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });

    const student = await User.findById(req.user._id).populate('mentor', 'name email phone expertise skills assignedCourses assignedBatches bio experience avatar');
    const mentor = student?.mentor || null;

    let classes = [];
    let attendance = [];
    let assignments = [];
    let notifications = [];

    if (mentor) {
      const [cls, att, asg, notifs] = await Promise.all([
        MentorClass.find({
          $or: [{ students: student._id }, { mentor: mentor._id }],
          status: { $ne: 'cancelled' }
        }).populate('mentor', 'name email').sort({ date: 1, startTime: 1 }).limit(30),
        Attendance.find({ student: student._id }).populate('mentor', 'name email').populate('classId', 'title date startTime endTime').sort({ markedAt: -1 }).limit(50),
        Assignment.find({
          $or: [{ students: student._id }, { mentor: mentor._id }],
          status: 'active'
        }).populate('mentor', 'name email').sort({ dueDate: 1 }),
        Notification.find({ recipient: student._id }).sort({ createdAt: -1 }).limit(30)
      ]);

      const submissions = await Submission.find({ student: student._id, assignment: { $in: asg.map(a => a._id) } });

      classes = cls;
      attendance = att;
      assignments = asg.map(a => ({
        ...a.toObject(),
        submission: submissions.find(s => String(s.assignment) === String(a._id)) || null
      }));
      notifications = notifs;
    }

    const totalSessions = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + (lateCount * 0.5)) / totalSessions) * 100) : 100;

    res.json({
      success: true,
      data: {
        mentor,
        classes,
        attendance,
        assignments,
        notifications,
        stats: {
          attendanceRate,
          totalSessions,
          presentCount,
          lateCount,
          absentCount,
          totalAssignments: assignments.length,
          completedAssignments: assignments.filter(a => a.submission).length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
