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

async function getAssignedStudents(mentorId) {
  return User.find(studentFilterForMentor(mentorId))
    .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
    .sort({ name: 1 });
}

async function assertAssignedStudent(mentorId, studentId) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) return null;
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
router.get('/dashboard', protect, mentorOnly, async (req, res) => {
  try {
    const mentorId = req.user._id;
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
      const progress = Math.min(100, Math.round((activity.minutes / 600) * 100)); // 10 hours = 100% activity baseline
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
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          expertise: req.user.expertise || [],
          skills: req.user.skills || [],
          experience: req.user.experience || ''
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
router.get('/students', protect, mentorOnly, async (req, res) => {
  try {
    const students = await getAssignedStudents(req.user._id);
    const ids = students.map(s => s._id);

    const [attendance, activities, submissions, projects] = await Promise.all([
      Attendance.find({ mentor: req.user._id, student: { $in: ids } }),
      UserActivity.find({ user: { $in: ids } }).sort({ createdAt: -1 }),
      Submission.find({ mentor: req.user._id, student: { $in: ids } }),
      Project.find({ mentor: req.user._id, student: { $in: ids } })
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

// Student detail; mentor can only access assigned students.
router.get('/students/:studentId', protect, mentorOnly, async (req, res) => {
  try {
    const student = await assertAssignedStudent(req.user._id, req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student is not assigned to this mentor' });

    const [activities, attendance, submissions, projects, notes, enrollments] = await Promise.all([
      UserActivity.find({ user: student._id }).sort({ createdAt: -1 }).limit(100),
      Attendance.find({ mentor: req.user._id, student: student._id }).populate('classId', 'title date startTime endTime').sort({ markedAt: -1 }),
      Submission.find({ mentor: req.user._id, student: student._id }).populate('assignment', 'title dueDate maxScore').sort({ submittedAt: -1 }),
      Project.find({ mentor: req.user._id, student: student._id }).sort({ updatedAt: -1 }),
      Note.find({ mentor: req.user._id, student: student._id }).sort({ createdAt: -1 }),
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
router.post('/classes', protect, mentorOnly, async (req, res) => {
  try {
    const {
      title, description, batch, course, studentIds = [], date, startTime, endTime,
      classType, mode, meetingLink, notes, learningMaterialUrl
    } = req.body;

    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Title, date, start time and end time are required' });
    }

    const validStudents = [];
    for (const id of studentIds) {
      const student = await assertAssignedStudent(req.user._id, id);
      if (student) validStudents.push(student._id);
    }

    const cls = await MentorClass.create({
      title, description, batch, course, students: validStudents, date, startTime, endTime,
      classType, mode, meetingLink, notes, learningMaterialUrl, mentor: req.user._id
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
router.get('/classes', protect, mentorOnly, async (req, res) => {
  try {
    const filter = { mentor: req.user._id };
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

router.patch('/classes/:id/status', protect, mentorOnly, async (req, res) => {
  try {
    const cls = await MentorClass.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user._id },
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
router.get('/attendance', protect, mentorOnly, async (req, res) => {
  try {
    const filter = { mentor: req.user._id };
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

router.post('/attendance/bulk', protect, mentorOnly, async (req, res) => {
  try {
    const { classId, records = [] } = req.body;
    const cls = await MentorClass.findOne({ _id: classId, mentor: req.user._id });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });

    const validIds = new Set(cls.students.map(s => String(s)));
    const results = [];

    for (const record of records) {
      if (!validIds.has(String(record.studentId))) continue;
      const attendance = await Attendance.findOneAndUpdate(
        { classId, student: record.studentId },
        { mentor: req.user._id, status: record.status, note: record.note, markedAt: new Date() },
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
router.get('/assignments', protect, mentorOnly, async (req, res) => {
  try {
    const assignments = await Assignment.find({ mentor: req.user._id }).populate('students', 'name email').sort({ dueDate: 1 });
    const ids = assignments.map(a => a._id);
    const submissions = await Submission.find({ mentor: req.user._id, assignment: { $in: ids } });
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

router.post('/assignments', protect, mentorOnly, async (req, res) => {
  try {
    const { title, description, batch, course, dueDate, maxScore, studentIds = [] } = req.body;
    if (!title || !dueDate) return res.status(400).json({ success: false, message: 'Title and due date are required' });
    const validStudents = [];
    for (const id of studentIds) {
      const student = await assertAssignedStudent(req.user._id, id);
      if (student) validStudents.push(student._id);
    }
    const assignment = await Assignment.create({
      title, description, batch, course, dueDate, maxScore, students: validStudents, mentor: req.user._id
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

router.get('/submissions', protect, mentorOnly, async (req, res) => {
  try {
    const submissions = await Submission.find({ mentor: req.user._id })
      .populate('student', 'name email')
      .populate('assignment', 'title dueDate maxScore')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/submissions/:id/review', protect, mentorOnly, async (req, res) => {
  try {
    const { score, feedback, status = 'reviewed' } = req.body;
    const submission = await Submission.findOne({ _id: req.params.id, mentor: req.user._id })
      .populate('student', 'name email');
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
router.get('/projects', protect, mentorOnly, async (req, res) => {
  try {
    const projects = await Project.find({ mentor: req.user._id })
      .populate('student', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/projects/:id', protect, mentorOnly, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user._id },
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
router.get('/students/:studentId/notes', protect, mentorOnly, async (req, res) => {
  try {
    if (!await assertAssignedStudent(req.user._id, req.params.studentId)) {
      return res.status(404).json({ success: false, message: 'Student is not assigned to this mentor' });
    }
    const notes = await Note.find({ mentor: req.user._id, student: req.params.studentId }).sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/students/:studentId/notes', protect, mentorOnly, async (req, res) => {
  try {
    if (!await assertAssignedStudent(req.user._id, req.params.studentId)) {
      return res.status(404).json({ success: false, message: 'Student is not assigned to this mentor' });
    }
    if (!req.body.note?.trim()) return res.status(400).json({ success: false, message: 'Note is required' });
    const note = await Note.create({ mentor: req.user._id, student: req.params.studentId, note: req.body.note.trim() });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Messages / announcements
router.get('/messages', protect, mentorOnly, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    }).populate('sender recipient', 'name email role').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/messages', protect, mentorOnly, async (req, res) => {
  try {
    const { recipientId, subject, message, attachmentUrl } = req.body;
    const student = await assertAssignedStudent(req.user._id, recipientId);
    if (!student) return res.status(403).json({ success: false, message: 'Student is not assigned to this mentor' });
    const msg = await Message.create({
      sender: req.user._id, recipient: student._id, subject, message, attachmentUrl
    });
    await createNotification(student._id, 'message', `Message from ${req.user.name}`, message.slice(0, 120), { messageId: msg._id });
    res.status(201).json({ success: true, data: await msg.populate('recipient', 'name email') });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/announcements', protect, mentorOnly, async (req, res) => {
  try {
    const { studentIds = [], title, message } = req.body;
    const validStudents = [];
    for (const id of studentIds) {
      const student = await assertAssignedStudent(req.user._id, id);
      if (student) validStudents.push(student);
    }
    await Promise.all(validStudents.map(student =>
      createNotification(student._id, 'message', title || `Announcement from ${req.user.name}`, message, { mentorId: req.user._id })
    ));
    res.json({ success: true, sent: validStudents.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Notifications
router.get('/notifications', protect, mentorOnly, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/notifications/:id/read', protect, mentorOnly, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
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
router.get('/reports', protect, mentorOnly, async (req, res) => {
  try {
    const students = await getAssignedStudents(req.user._id);
    const ids = students.map(s => s._id);
    const [attendance, submissions, activities, projects] = await Promise.all([
      Attendance.find({ mentor: req.user._id, student: { $in: ids } }),
      Submission.find({ mentor: req.user._id, student: { $in: ids } }),
      UserActivity.find({ user: { $in: ids } }),
      Project.find({ mentor: req.user._id, student: { $in: ids } })
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
    const { name, email, password, phone, expertise = [], skills = [], assignedCourses = [], assignedBatches = [] } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ success: false, message: 'Email already exists' });

    const mentor = await User.create({
      name, email: email.toLowerCase().trim(), password, phone,
      role: 'mentor', isVerified: true, expertise, skills, assignedCourses, assignedBatches
    });
    res.status(201).json({
      success: true,
      data: await User.findById(mentor._id).select('-password -otp -resetPasswordToken -resetPasswordExpiry')
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: assign a student to a mentor
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


// Mentor profile
router.get('/profile', protect, mentorOnly, async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');
    res.json({ success: true, data: mentor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/profile', protect, mentorOnly, async (req, res) => {
  try {
    const allowed = ['name','phone','avatar','expertise','skills','assignedCourses','assignedBatches','experience','bio'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    const mentor = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
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

router.post('/student/messages', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
    const mentor = await User.findOne({ _id: req.user.mentor, role: 'mentor' });
    if (!mentor) return res.status(404).json({ success: false, message: 'No mentor is assigned to you' });
    const msg = await Message.create({ sender: req.user._id, recipient: mentor._id, subject: req.body.subject, message: req.body.message, attachmentUrl: req.body.attachmentUrl });
    await createNotification(mentor._id, 'message', `Message from ${req.user.name}`, String(req.body.message || '').slice(0,120), { messageId: msg._id });
    res.status(201).json({ success: true, data: await msg.populate('recipient', 'name email') });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
