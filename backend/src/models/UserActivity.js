const mongoose = require('mongoose');

// User Activity Schema for tracking study sessions
const userActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { 
    type: String, 
    enum: ['login', 'session_attended', 'practice_completed', 'course_progress', 'assignment_completed'],
    required: true 
  },
  duration: { type: Number, default: 0 }, // in minutes
  details: {
  courseName: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },

  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },

  sessionTopic: String,
  instructor: String,

  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },

  assignmentName: String,

  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PracticeProblem'
  },

  challengeName: String,

  score: Number,

  progressPercentage: Number
},
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// User Progress Schema for overall tracking
const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalStudyHours: { type: Number, default: 0 }, // in minutes
  currentStreak: { type: Number, default: 0 }, // consecutive days
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  sessionsAttended: { type: Number, default: 0 },
  sessionsTotal: { type: Number, default: 0 },
  assignmentsCompleted: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  practiceProblems: {
    solved: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Session Schema for tracking live sessions
const sessionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  instructor: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  attendees: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date },
    leftAt: { type: Date },
    attended: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = {
  UserActivity: mongoose.model('UserActivity', userActivitySchema),
  UserProgress: mongoose.model('UserProgress', userProgressSchema),
  Session: mongoose.model('Session', sessionSchema)
};