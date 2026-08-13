require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require("./config/database");
const User = require('./models/User');
const Application = require('./models/Application');
const { Enrollment } = require('./models/Enrollment');
const { UserActivity, UserProgress } = require('./models/UserActivity');

const run = async () => {
  await connectDB();

  const now = new Date();
  const minutesAgo = minutes => {
    return new Date(
      now.getTime() -
      minutes * 60 * 1000
    );
  };

  // Remove only the records created by this test script.
  const demoEmails = [
    'demo.student1@weintern.local',
    'demo.student2@weintern.local'
  ];

  const demoUsers = await User.find({
    email: { $in: demoEmails }
  }).select('_id');

  const demoUserIds =
    demoUsers.map(user => user._id);

  if (demoUserIds.length) {
    await Promise.all([
      Application.deleteMany({
        user: { $in: demoUserIds }
      }),

      Enrollment.deleteMany({
        user: { $in: demoUserIds }
      }),

      UserActivity.deleteMany({
        user: { $in: demoUserIds }
      }),

      UserProgress.deleteMany({
        user: { $in: demoUserIds }
      }),

      User.deleteMany({
        _id: { $in: demoUserIds }
      })
    ]);
  }

  const student1 = await User.create({
    name: 'Demo Student One',
    email: demoEmails[0],
    password: 'Demo@12345',
    phone: '9000000001',
    college: 'Demo Engineering College',
    year: '3rd Year',
    interest: 'Full Stack Development',
    role: 'student',
    isVerified: true,
    isBlocked: false
  });

  const student2 = await User.create({
    name: 'Demo Student Two',
    email: demoEmails[1],
    password: 'Demo@12345',
    phone: '9000000002',
    college: 'Demo Science College',
    year: 'Final Year',
    interest: 'Data Science',
    role: 'student',
    isVerified: true,
    isBlocked: false
  });

  // Applications
  await Application.create([
    {
      user: student1._id,
      name: student1.name,
      email: student1.email,
      phone: student1.phone,
      college: student1.college,
      interest: student1.interest,
      year: student1.year,
      duration: '6months',
      status: 'accepted'
    },
    {
      user: student2._id,
      name: student2.name,
      email: student2.email,
      phone: student2.phone,
      college: student2.college,
      interest: student2.interest,
      year: student2.year,
      duration: '3months',
      status: 'pending'
    }
  ]);

  const fullPaymentAmount = 9999;

  const fullPayment = {
    amount: fullPaymentAmount,
    paymentId: 'demo_pay_full_001',
    orderId: 'demo_order_full_001',
    paymentType: 'full',
    paidAt: minutesAgo(120)
  };

  // Student 1: fully paid this month
  await Enrollment.create({
    user: student1._id,
    courseName: 'MERN Stack Development',
    coursePrice: 9999,
    finalPrice: 9999,
    name: student1.name,
    email: student1.email,
    phone: student1.phone,
    college: student1.college,
    degree: 'B.Tech',
    year: student1.year,
    paymentStatus: 'paid',
    paymentType: 'full',
    status: 'enrolled',
    paymentId: fullPayment.paymentId,
    paymentOrderId: fullPayment.orderId,
    amountPaid: fullPaymentAmount,
    paymentHistory: [fullPayment]
  });

  const emi1 = 2333;

  // Student 2: first EMI paid, balance pending
  const emiPayment = {
    amount: emi1,
    paymentId: 'demo_pay_emi1_001',
    orderId: 'demo_order_emi1_001',
    paymentType: 'emi',
    installment: 1,
    paidAt: minutesAgo(45)
  };

  await Enrollment.create({
    user: student2._id,
    courseName: 'Data Science with Python',
    coursePrice: 6999,
    finalPrice: 6999,
    name: student2.name,
    email: student2.email,
    phone: student2.phone,
    college: student2.college,
    degree: 'BSc',
    year: student2.year,
    paymentStatus: 'emi_1',
    paymentType: 'emi',
    status: 'enrolled',
    amountPaid: emi1,
    emiInstallments: [
      {
        installment: 1,
        amount: emi1,
        paymentId: emiPayment.paymentId,
        orderId: emiPayment.orderId,
        paidAt: emiPayment.paidAt,
        status: 'paid'
      }
    ],
    paymentHistory: [emiPayment]
  });

  // Third enrollment: completely pending. No revenue.
  await Enrollment.create({
    user: student1._id,
    courseName: 'React Advanced',
    coursePrice: 4999,
    finalPrice: 4999,
    name: student1.name,
    email: student1.email,
    phone: student1.phone,
    college: student1.college,
    degree: 'B.Tech',
    year: student1.year,
    paymentStatus: 'pending',
    paymentType: 'full',
    status: 'enrolled',
    amountPaid: 0
  });

  // Realistic study activity.
  await UserActivity.insertMany([
    {
      user: student1._id,
      activityType: 'course_progress',
      duration: 45,
      details: {
        courseName: 'MERN Stack Development',
        progressPercentage: 20
      },
      createdAt: minutesAgo(180),
      updatedAt: minutesAgo(180)
    },
    {
      user: student1._id,
      activityType: 'course_progress',
      duration: 30,
      details: {
        courseName: 'MERN Stack Development',
        progressPercentage: 35
      },
      createdAt: minutesAgo(90),
      updatedAt: minutesAgo(90)
    },
    {
      user: student1._id,
      activityType: 'practice_completed',
      duration: 20,
      details: {
        courseName: 'MERN Stack Development',
        challengeName: 'Reverse a String',
        difficulty: 'Easy'
      },
      createdAt: minutesAgo(60),
      updatedAt: minutesAgo(60)
    },
    {
      user: student1._id,
      activityType: 'assignment_completed',
      duration: 25,
      details: {
        courseName: 'MERN Stack Development',
        assignmentName: 'REST API Assignment',
        score: 88
      },
      createdAt: minutesAgo(30),
      updatedAt: minutesAgo(30)
    },
    {
      user: student2._id,
      activityType: 'course_progress',
      duration: 40,
      details: {
        courseName: 'Data Science with Python',
        progressPercentage: 15
      },
      createdAt: minutesAgo(75),
      updatedAt: minutesAgo(75)
    },
    {
      user: student2._id,
      activityType: 'session_attended',
      duration: 60,
      details: {
        sessionTopic: 'Python for Data Analysis',
        instructor: 'Demo Mentor'
      },
      createdAt: minutesAgo(20),
      updatedAt: minutesAgo(20)
    }
  ]);

  await UserProgress.create([
    {
      user: student1._id,
      currentStreak: 2,
      longestStreak: 4,
      sessionsAttended: 0,
      sessionsTotal: 0
    },
    {
      user: student2._id,
      currentStreak: 1,
      longestStreak: 2,
      sessionsAttended: 1,
      sessionsTotal: 1
    }
  ]);

  console.log('');
  console.log('==========================================');
  console.log('WeIntern dashboard test data created');
  console.log('==========================================');
  console.log('');
  console.log('Student 1');
  console.log('Email: demo.student1@weintern.local');
  console.log('Password: Demo@12345');
  console.log('');
  console.log('Student 2');
  console.log('Email: demo.student2@weintern.local');
  console.log('Password: Demo@12345');
  console.log('');
  console.log('Expected new enrollment count: 3');
  console.log('Expected pending enrollment count: 2');
  console.log('Expected current-month revenue: ₹12,332');
  console.log('Expected total demo revenue: ₹12,332');
  console.log('');
  console.log('NOTE: This script deletes/recreates ONLY these two demo users.');
  console.log('Your real students are not deleted.');
  console.log('');

  await mongoose.connection.close();
};

run().catch(async error => {
  console.error('Seed failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
