require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('./config/database');

const User = require('./models/User');
const Assignment = require('./models/MentorAssignment');

async function seedStudentAssignment() {

  try {

    await connectDB();

    console.log('\n================================');
    console.log('Student Assignment Seed');
    console.log('================================\n');


    // -------------------------------------------------------
    // Find mentor
    // -------------------------------------------------------

    const mentor =
      await User.findOne({
        email: 'demo.mentor@weintern.local',
        role: 'mentor'
      });

    if (!mentor) {

      throw new Error(
        'Demo Mentor not found. Run npm run seed:mentor first.'
      );

    }

    console.log(
      'Mentor:',
      mentor.name,
      mentor.email
    );


    // -------------------------------------------------------
    // Find Demo Student One
    // -------------------------------------------------------

    const student =
      await User.findOne({
        email: 'demo.student1@weintern.local',
        role: 'student'
      });

    if (!student) {

      throw new Error(
        'Demo Student One not found. Run npm run seed:dashboard first.'
      );

    }

    console.log(
      'Student:',
      student.name,
      student.email
    );


    // -------------------------------------------------------
    // Assign mentor to student
    // -------------------------------------------------------

    student.mentor = mentor._id;

    await student.save();

    console.log(
      'Student linked to mentor successfully.'
    );


    // -------------------------------------------------------
    // Delete old demo assignment for this student
    // -------------------------------------------------------

    await Assignment.deleteMany({
      title: 'Build a Student Management REST API',
      mentor: mentor._id,
      students: student._id
    });


    // -------------------------------------------------------
    // Create assignment
    // -------------------------------------------------------

    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate() + 7
    );

    dueDate.setHours(
      23,
      59,
      0,
      0
    );


    const assignment =
      await Assignment.create({

        title:
          'Build a Student Management REST API',

        description:
          'Create a REST API for a student management system using Node.js, Express and MongoDB. Implement CRUD operations for students, request validation and proper error handling.',

        mentor:
          mentor._id,

        // THIS IS THE IMPORTANT PART
        students: [
          student._id
        ],

        batch:
          'MERN-2026-A',

        course:
          'MERN Stack Development',

        dueDate:

          dueDate,

        maxScore:
          100,

        status:
          'active'

      });


    console.log('\n================================');
    console.log('Assignment Created');
    console.log('================================');

    console.log(
      'Assignment:',
      assignment.title
    );

    console.log(
      'Assignment ID:',
      assignment._id
    );

    console.log(
      'Student:',
      student.name
    );

    console.log(
      'Student ID:',
      student._id
    );

    console.log(
      'Mentor:',
      mentor.name
    );

    console.log(
      'Due:',
      assignment.dueDate
    );

    console.log(
      '\nStudent can now see this assignment.'
    );

    console.log(
      '================================\n'
    );


    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {

    console.error(
      '\n❌ Seed failed:'
    );

    console.error(
      error.message
    );

    try {
      await mongoose.connection.close();
    } catch (_) {}

    process.exit(1);
  }
}


seedStudentAssignment();