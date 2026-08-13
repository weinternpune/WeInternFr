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

  const mentorEmail = 'demo.mentor@weintern.local';
  const password = 'Mentor@12345';

  let mentor = await User.findOne({ email: mentorEmail });
  if (mentor) {
    await Promise.all([
      MentorClass.deleteMany({ mentor: mentor._id }),
      Attendance.deleteMany({ mentor: mentor._id }),
      Assignment.deleteMany({ mentor: mentor._id }),
      Submission.deleteMany({ mentor: mentor._id }),
      Project.deleteMany({ mentor: mentor._id }),
      Notification.deleteMany({ recipient: mentor._id }),
      Message.deleteMany({ $or: [{ sender: mentor._id }, { recipient: mentor._id }] })
    ]);
  } else {
    mentor = await User.create({
      name: 'Demo Mentor',
      email: mentorEmail,
      password,
      role: 'mentor',
      isVerified: true,
      expertise: ['MERN Stack', 'Data Analytics'],
      skills: ['React', 'Node.js', 'MongoDB', 'Mentoring'],
      assignedCourses: ['MERN Stack Development'],
      assignedBatches: ['MERN-2026-A'],
      experience: '5 years'
    });
  }

  const studentEmails = ['mentor.student1@weintern.local', 'mentor.student2@weintern.local', 'mentor.student3@weintern.local'];
  const students = [];

  for (let i = 0; i < studentEmails.length; i++) {
    let student = await User.findOne({ email: studentEmails[i] });
    if (!student) {
      student = await User.create({
        name: ['Rahul Sharma', 'Priya Singh', 'Amit Kumar'][i],
        email: studentEmails[i],
        password: 'Demo@12345',
        role: 'student',
        isVerified: true,
        phone: `987654320${i}`,
        college: 'Demo College',
        year: 'MERN-2026-A',
        interest: 'MERN Stack',
        mentor: mentor._id
      });
    } else {
      student.mentor = mentor._id;
      student.isVerified = true;
      await student.save();
    }
    students.push(student);
  }

  const now = new Date();
  const today = new Date(now); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);

  const classes = await MentorClass.create([
    {
      title: 'React Fundamentals',
      description: 'Hooks, components and state management.',
      mentor: mentor._id,
      students: students.slice(0,2).map(s=>s._id),
      batch: 'MERN-2026-A',
      course: 'MERN Stack Development',
      date: today,
      startTime: '10:00',
      endTime: '11:00',
      classType: 'lecture',
      mode: 'online',
      meetingLink: 'https://meet.google.com/demo-weintern',
      status: 'upcoming'
    },
    {
      title: 'Project Review',
      description: 'Weekly project progress review.',
      mentor: mentor._id,
      students: [students[2]._id],
      batch: 'MERN-2026-A',
      course: 'MERN Stack Development',
      date: tomorrow,
      startTime: '15:00',
      endTime: '16:00',
      classType: 'project_review',
      mode: 'online',
      meetingLink: 'https://meet.google.com/demo-project',
      status: 'upcoming'
    }
  ]);

  const assignment = await Assignment.create({
    title: 'Build REST API using Node.js',
    description: 'Create CRUD APIs with validation and MongoDB.',
    mentor: mentor._id,
    students: students.map(s=>s._id),
    batch: 'MERN-2026-A',
    course: 'MERN Stack Development',
    dueDate: new Date(Date.now()+3*86400000),
    maxScore: 100
  });

  await Submission.create([
    {
      assignment: assignment._id, mentor: mentor._id, student: students[0]._id,
      githubUrl: 'https://github.com/example/student-api',
      submittedAt: new Date(Date.now()-86400000), score: 86,
      feedback: 'Good API structure. Add more validation.', status: 'reviewed', reviewedAt: new Date()
    },
    {
      assignment: assignment._id, mentor: mentor._id, student: students[1]._id,
      githubUrl: 'https://github.com/example/student-api-2',
      submittedAt: new Date(Date.now()-3600000), status: 'submitted'
    }
  ]);

  await Project.create([
    {
      mentor: mentor._id, student: students[0]._id, title: 'Internship Learning Portal',
      description: 'Build a full-stack learning portal.', githubUrl: 'https://github.com/example/portal',
      progress: 82, status: 'project', mentorComments: 'Strong progress. Focus on deployment.'
    },
    {
      mentor: mentor._id, student: students[1]._id, title: 'Analytics Dashboard',
      description: 'Create a dashboard for learning analytics.', githubUrl: 'https://github.com/example/analytics',
      progress: 58, status: 'assignments', mentorComments: 'Needs more consistency this week.'
    },
    {
      mentor: mentor._id, student: students[2]._id, title: 'MERN Capstone',
      description: 'Final internship capstone project.', progress: 35, status: 'training'
    }
  ]);

  await Attendance.create([
    { classId: classes[0]._id, mentor: mentor._id, student: students[0]._id, status: 'present' },
    { classId: classes[0]._id, mentor: mentor._id, student: students[1]._id, status: 'absent' },
    { classId: classes[0]._id, mentor: mentor._id, student: students[2]._id, status: 'late' }
  ]);

  for (const [index, student] of students.entries()) {
    await UserActivity.create([
      { user: student._id, activityType: 'course_progress', duration: 80 + index*20, details: { courseName: 'MERN Stack Development' }, createdAt: new Date(Date.now()-86400000) },
      { user: student._id, activityType: 'practice_completed', duration: 25 + index*5, details: { challengeName: 'API Challenge', score: 80 + index*5 }, createdAt: new Date(Date.now()-2*86400000) },
      { user: student._id, activityType: 'session_attended', duration: 60, details: { sessionTopic: 'React Workshop', instructor: mentor.name }, createdAt: new Date(Date.now()-3*86400000) }
    ]);
  }

  await Notification.create([
    { recipient: mentor._id, type: 'assignment_submitted', title: 'New assignment submission', message: 'Priya Singh submitted Build REST API using Node.js.', data: { assignmentId: assignment._id } },
    { recipient: mentor._id, type: 'student_assigned', title: 'Student assigned', message: 'Amit Kumar is assigned to you.', data: { studentId: students[2]._id } }
  ]);

  await Message.create({
    sender: mentor._id,
    recipient: students[0]._id,
    subject: 'Welcome to your internship',
    message: 'Welcome Rahul! Please complete the React module before our next class.'
  });

  console.log('\n========================================');
  console.log('WeIntern Mentor Demo Data Ready');
  console.log('========================================');
  console.log('Mentor:', mentorEmail);
  console.log('Password:', password);
  console.log('Assigned students:', studentEmails.join(', '));
  console.log('========================================\n');

  await mongoose.connection.close();
}

seed().catch(async err => {
  console.error('Mentor seed failed:', err);
  await mongoose.connection.close();
  process.exit(1);
});
