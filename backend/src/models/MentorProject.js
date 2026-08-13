const mongoose = require('mongoose');

const mentorProjectSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: String,
  githubUrl: String,
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: {
    type: String,
    enum: ['onboarding','training','assignments','project','evaluation','completed'],
    default: 'onboarding'
  },
  lastUpdate: { type: Date, default: Date.now },
  mentorComments: String
}, { timestamps: true });

module.exports = mongoose.model('MentorProject', mentorProjectSchema);
