require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./src/models/Application');

async function testCollegeData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI + 'WeIntern', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Get total applications
    const total = await Application.countDocuments();
    console.log(`📊 Total Applications: ${total}\n`);

    // Get applications with college field
    const withCollege = await Application.countDocuments({ 
      college: { $exists: true, $ne: null, $ne: '' } 
    });
    console.log(`✅ With College Field: ${withCollege}`);

    // Get applications without college field
    const withoutCollege = await Application.countDocuments({ 
      $or: [
        { college: { $exists: false } },
        { college: null },
        { college: '' }
      ]
    });
    console.log(`❌ Without College Field: ${withoutCollege}\n`);

    // Show recent 5 applications
    console.log('📋 Recent 5 Applications:\n');
    const recent = await Application.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email phone college interest duration createdAt');

    recent.forEach((app, i) => {
      console.log(`${i + 1}. ${app.name}`);
      console.log(`   Email: ${app.email}`);
      console.log(`   Phone: ${app.phone || 'N/A'}`);
      console.log(`   College: ${app.college || '❌ MISSING'}`);
      console.log(`   Interest: ${app.interest}`);
      console.log(`   Duration: ${app.duration}`);
      console.log(`   Applied: ${app.createdAt.toLocaleDateString()}\n`);
    });

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testCollegeData();
