const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  phone: { type: String },
  college: { type: String },
  year: { type: String },
  interest: { type: String },
  avatar: { type: String },

  // Role-based access: students, mentors and admins use the same authentication system.
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    default: 'student',
    index: true
  },

  // Mentor profile fields
  expertise: [{ type: String }],
  skills: [{ type: String }],
  assignedCourses: [{ type: String }],
  assignedBatches: [{ type: String }],
  experience: { type: String },
  bio: { type: String },
  internshipProgram: { type: String },
  startDate: { type: Date },
  expectedCompletionDate: { type: Date },

  // Student -> assigned mentor relationship
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },

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

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
