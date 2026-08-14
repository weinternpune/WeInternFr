require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const { UserActivity } = require('./models/UserActivity');
const MentorClass = require('./models/MentorClass');
const Attendance = require('./models/MentorAttendance');
const Assignment = require('./models/MentorAssignment');
const Submission = require('./models/MentorSubmission');
const Project = require('./models/MentorProject');
const Notification = require('./models/MentorNotification');
const Message = require('./models/MentorMessage');

async function seed() {
  await connectDB();

  // Create Mentor 1: Aarav Patel
  const mentor1Email = 'aarav.patel@weintern.in';
  let mentor1 = await User.findOne({ email: mentor1Email });
  if (mentor1) {
    mentor1.name = 'Aarav Patel';
    mentor1.expertise = ['MERN Full Stack', 'React & Node.js', 'System Design'];
    mentor1.skills = ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'];
    mentor1.assignedCourses = ['Full Stack MERN Internship', 'Advanced Frontend Masterclass'];
    mentor1.assignedBatches = ['MERN-2026-BatchA', 'MERN-2026-BatchB'];
    mentor1.experience = '6+ years in Full Stack Engineering';
    mentor1.isVerified = true;
    await mentor1.save();
  } else {
    mentor1 = await User.create({
      name: 'Aarav Patel',
      email: mentor1Email,
      password: 'Mentor@12345',
      role: 'mentor',
      isVerified: true,
      phone: '9876543210',
      expertise: ['MERN Full Stack', 'React & Node.js', 'System Design'],
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'],
      assignedCourses: ['Full Stack MERN Internship', 'Advanced Frontend Masterclass'],
      assignedBatches: ['MERN-2026-BatchA', 'MERN-2026-BatchB'],
      experience: '6+ years in Full Stack Engineering'
    });
  }

  // Create Mentor 2: Pooja Sharma
  const mentor2Email = 'pooja.sharma@weintern.in';
  let mentor2 = await User.findOne({ email: mentor2Email });
  if (mentor2) {
    mentor2.name = 'Pooja Sharma';
    mentor2.expertise = ['Data Analytics', 'Python', 'Machine Learning'];
    mentor2.skills = ['Python', 'SQL', 'Tableau', 'Pandas', 'Power BI'];
    mentor2.assignedCourses = ['Data Science & Analytics', 'Python for Engineers'];
    mentor2.assignedBatches = ['DATA-2026-A'];
    mentor2.experience = '5 years in Data Engineering';
    mentor2.isVerified = true;
    await mentor2.save();
  } else {
    mentor2 = await User.create({
      name: 'Pooja Sharma',
      email: mentor2Email,
      password: 'Mentor@12345',
      role: 'mentor',
      isVerified: true,
      phone: '9876543211',
      expertise: ['Data Analytics', 'Python', 'Machine Learning'],
      skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'Power BI'],
      assignedCourses: ['Data Science & Analytics', 'Python for Engineers'],
      assignedBatches: ['DATA-2026-A'],
      experience: '5 years in Data Engineering'
    });
  }

  // Clean old mentor test records
  await Promise.all([
    MentorClass.deleteMany({ mentor: { $in: [mentor1._id, mentor2._id] } }),
    Attendance.deleteMany({ mentor: { $in: [mentor1._id, mentor2._id] } }),
    Assignment.deleteMany({ mentor: { $in: [mentor1._id, mentor2._id] } }),
    Submission.deleteMany({ mentor: { $in: [mentor1._id, mentor2._id] } }),
    Project.deleteMany({ mentor: { $in: [mentor1._id, mentor2._id] } }),
    Notification.deleteMany({ recipient: { $in: [mentor1._id, mentor2._id] } }),
    Message.deleteMany({ $or: [{ sender: { $in: [mentor1._id, mentor2._id] } }, { recipient: { $in: [mentor1._id, mentor2._id] } }] })
  ]);

  // Create real students
  const studentData = [
    { name: 'Rahul Sharma', email: 'rahul.sharma@weintern.local', phone: '9871100001', college: 'IIT Bombay', year: 'MERN-2026-BatchA', interest: 'Full Stack MERN', mentor: mentor1._id },
    { name: 'Priya Singh', email: 'priya.singh@weintern.local', phone: '9871100002', college: 'BITS Pilani', year: 'MERN-2026-BatchA', interest: 'Full Stack MERN', mentor: mentor1._id },
    { name: 'Amit Verma', email: 'amit.verma@weintern.local', phone: '9871100003', college: 'VIT Vellore', year: 'MERN-2026-BatchB', interest: 'Full Stack MERN', mentor: mentor1._id },
    { name: 'Sneha Patel', email: 'sneha.patel@weintern.local', phone: '9871100004', college: 'DTU Delhi', year: 'DATA-2026-A', interest: 'Data Analytics', mentor: mentor2._id },
    { name: 'Vikram Joshi', email: 'vikram.joshi@weintern.local', phone: '9871100005', college: 'NIT Trichy', year: 'DATA-2026-A', interest: 'Data Analytics', mentor: mentor2._id }
  ];

  const students = [];
  for (const s of studentData) {
    let student = await User.findOne({ email: s.email });
    if (!student) {
      student = await User.create({
        ...s,
        password: 'Student@12345',
        role: 'student',
        isVerified: true
      });
    } else {
      student.name = s.name;
      student.mentor = s.mentor;
      student.year = s.year;
      student.interest = s.interest;
      student.isVerified = true;
      await student.save();
    }
    students.push(student);
  }

  const now = new Date();
  const today = new Date(now); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  // Classes for Mentor 1
  const m1Students = students.filter(s => String(s.mentor) === String(mentor1._id));
  const classes1 = await MentorClass.create([
    {
      title: 'React Hooks & State Architecture',
      description: 'Deep dive into useEffect, custom hooks, and context state management.',
      mentor: mentor1._id,
      students: m1Students.slice(0, 2).map(s => s._id),
      batch: 'MERN-2026-BatchA',
      course: 'Full Stack MERN Internship',
      date: today,
      startTime: '10:00',
      endTime: '11:30',
      classType: 'lecture',
      mode: 'online',
      meetingLink: 'https://meet.google.com/weintern-mern-live',
      status: 'upcoming'
    },
    {
      title: 'Backend API Security & JWT Review',
      description: 'Review authentication flows, rate limiters, and MongoDB security best practices.',
      mentor: mentor1._id,
      students: m1Students.map(s => s._id),
      batch: 'MERN-2026-BatchA',
      course: 'Full Stack MERN Internship',
      date: tomorrow,
      startTime: '15:00',
      endTime: '16:30',
      classType: 'practical',
      mode: 'online',
      meetingLink: 'https://meet.google.com/weintern-api-security',
      status: 'upcoming'
    }
  ]);

  // Classes for Mentor 2
  const m2Students = students.filter(s => String(s.mentor) === String(mentor2._id));
  await MentorClass.create([
    {
      title: 'Exploratory Data Analysis with Pandas',
      description: 'Hands-on session analyzing datasets with Python, Pandas and Seaborn.',
      mentor: mentor2._id,
      students: m2Students.map(s => s._id),
      batch: 'DATA-2026-A',
      course: 'Data Science & Analytics',
      date: today,
      startTime: '14:00',
      endTime: '15:30',
      classType: 'workshop',
      mode: 'online',
      meetingLink: 'https://meet.google.com/weintern-data-live',
      status: 'upcoming'
    }
  ]);

  // Assignments for Mentor 1
  const assignment1 = await Assignment.create({
    title: 'Build Authenticated REST API with JWT & MongoDB',
    description: 'Implement user registration, login, protected dashboard routes, and rate limiting in Node.js/Express.',
    mentor: mentor1._id,
    students: m1Students.map(s => s._id),
    batch: 'MERN-2026-BatchA',
    course: 'Full Stack MERN Internship',
    dueDate: new Date(Date.now() + 4 * 86400000),
    maxScore: 100
  });

  // Submissions
  await Submission.create([
    {
      assignment: assignment1._id,
      mentor: mentor1._id,
      student: m1Students[0]._id,
      githubUrl: 'https://github.com/rahul-sharma/weintern-api-project',
      submittedAt: new Date(Date.now() - 48 * 3600000),
      score: 92,
      feedback: 'Excellent route organization and clean middleware handling. Recommended adding Redis for sessions.',
      status: 'reviewed',
      reviewedAt: new Date()
    },
    {
      assignment: assignment1._id,
      mentor: mentor1._id,
      student: m1Students[1]._id,
      githubUrl: 'https://github.com/priya-singh/ecommerce-backend-api',
      submittedAt: new Date(Date.now() - 3 * 3600000),
      status: 'submitted'
    }
  ]);

  // Projects for Mentor 1
  await Project.create([
    {
      mentor: mentor1._id,
      student: m1Students[0]._id,
      title: 'Enterprise Learning & Internship Portal',
      description: 'End-to-end multi-role web platform with live attendance and automated grading.',
      githubUrl: 'https://github.com/rahul-sharma/enterprise-portal',
      progress: 85,
      status: 'project',
      mentorComments: 'Great UI consistency and responsive layout. Prepare final presentation slides.'
    },
    {
      mentor: mentor1._id,
      student: m1Students[1]._id,
      title: 'Real-time Collaborative Task Board',
      description: 'Kanban board with live websocket updates and role-based permissions.',
      githubUrl: 'https://github.com/priya-singh/collaborative-board',
      progress: 64,
      status: 'assignments',
      mentorComments: 'Need to complete drag-and-drop integration by Friday.'
    }
  ]);

  // Attendance for Mentor 1
  await Attendance.create([
    { classId: classes1[0]._id, mentor: mentor1._id, student: m1Students[0]._id, status: 'present', markedAt: new Date() },
    { classId: classes1[0]._id, mentor: mentor1._id, student: m1Students[1]._id, status: 'present', markedAt: new Date() }
  ]);

  // Notifications
  await Notification.create([
    {
      recipient: mentor1._id,
      type: 'assignment_submitted',
      title: 'New assignment submission received',
      message: 'Priya Singh submitted Build Authenticated REST API with JWT & MongoDB.',
      data: { assignmentId: assignment1._id }
    },
    {
      recipient: mentor1._id,
      type: 'message',
      title: 'Cohort Announcement Broadcasted',
      message: 'Welcome to Week 3! Ensure all submissions are pushed to GitHub before midnight.',
      data: { mentorId: mentor1._id }
    }
  ]);

  // Messages
  await Message.create({
    sender: mentor1._id,
    recipient: m1Students[0]._id,
    subject: 'Feedback on Project Milestones',
    message: 'Hello Rahul! Your backend API architecture looks very promising. Keep up the high standard.'
  });

  console.log('\n========================================');
  console.log('✅ Dynamic Mentor & Student Data Seeded Successfully');
  console.log('========================================');
  console.log('Mentor 1:', mentor1.name, `(${mentor1.email})`);
  console.log('Mentor 2:', mentor2.name, `(${mentor2.email})`);
  console.log('Students:', students.map(s => s.name).join(', '));
  console.log('========================================\n');

  await mongoose.connection.close();
}

seed().catch(async err => {
  console.error('Mentor seed error:', err);
  await mongoose.connection.close();
  process.exit(1);
});
