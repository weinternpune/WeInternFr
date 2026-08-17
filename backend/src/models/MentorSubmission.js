const mongoose = require('mongoose');

const mentorSubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorAssignment', required: true, index: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  submittedAt: { type: Date, default: Date.now },
  githubUrl: String,
  fileUrl: String,
  answer: String,
  score: { type: Number, min: 0, max: 100 },
  feedback: String,
  status: { type: String, enum: ['submitted','reviewed','changes_requested','approved'], default: 'submitted' },
  reviewedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('MentorSubmission', mentorSubmissionSchema);
