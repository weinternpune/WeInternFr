require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// User Schema (same as your model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  phone: { type: String },
  college: { type: String },
  year: { type: String },
  interest: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  authProvider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
  googleId: { type: String },
  githubId: { type: String },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

// Create Admin User
async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@weintern.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('\n📧 Email: admin@weintern.com');
      console.log('🔑 Password: Admin@123');
      console.log('\n✅ You can login with these credentials');
      process.exit(0);
    }

    // Create new admin user
    const admin = new User({
      name: 'WeIntern Admin',
      email: 'admin@weintern.com',
      password: 'Admin@123',
      phone: '9876543210',
      role: 'admin',
      authProvider: 'local',
      isVerified: true,
      isBlocked: false
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Email: admin@weintern.com');
    console.log('🔑 Password: Admin@123');
    console.log('\n✅ You can now login to admin panel with these credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

// Wait for MongoDB connection before creating admin
mongoose.connection.once('open', () => {
  createAdmin();
});
