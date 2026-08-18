require('dotenv').config();

const connectDB = require('./src/config/database');
const User = require('./src/models/User');

async function resetPassword() {
  try {
    await connectDB();

    const mentor = await User.findOne({
      email: 'aarav.patel@weintern.in'
    });

    if (!mentor) {
      console.log('❌ Mentor not found');
      process.exit(1);
    }

    mentor.password = 'Mentor@12345';
    await mentor.save();

    console.log('=================================');
    console.log('✅ Password reset successfully');
    console.log('Email:    aarav.patel@weintern.in');
    console.log('Password: Mentor@12345');
    console.log('=================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    process.exit(1);
  }
}

resetPassword();