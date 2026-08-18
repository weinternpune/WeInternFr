const mongoose = require('mongoose');

const mentorProjectSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: String,
  githubUrl: String,
  liveDemoUrl: String,
  studentNotes: String,
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'submitted', 'changes_requested', 'reviewed', 'completed', 'onboarding', 'training', 'assignments', 'project', 'evaluation'],
    default: 'assigned'
  },
  score: Number,
  lastUpdate: { type: Date, default: Date.now },
  submittedAt: Date,
  reviewedAt: Date,
  mentorComments: String
}, { timestamps: true });

module.exports = mongoose.model('MentorProject', mentorProjectSchema);

