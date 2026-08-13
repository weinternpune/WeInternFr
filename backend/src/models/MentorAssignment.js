const mongoose = require('mongoose');

const mentorAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  batch: String,
  course: String,
  dueDate: { type: Date, required: true, index: true },
  maxScore: { type: Number, default: 100 },
  status: { type: String, enum: ['active','closed','draft'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('MentorAssignment', mentorAssignmentSchema);
