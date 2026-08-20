require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./src/models/Application');

async function migrateApplications() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI + 'WeIntern', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Update all applications that don't have college field
    const result = await Application.updateMany(
      { 
        $or: [
          { college: { $exists: false } },
          { college: null },
          { college: '' }
        ]
      },
      { 
        $set: { college: 'Not Provided' }
      }
    );

    console.log(`✅ Migration complete!`);
    console.log(`📊 Updated ${result.modifiedCount} applications`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateApplications();
