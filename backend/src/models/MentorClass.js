const mongoose = require('mongoose');

const mentorClassSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  batch: String,
  course: String,
  date: { type: Date, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  classType: {
    type: String,
    enum: ['lecture','practical','workshop','doubt_session','project_review','one_to_one','assessment'],
    default: 'lecture'
  },
  mode: { type: String, enum: ['online','offline'], default: 'online' },
  meetingLink: String,
  notes: String,
  learningMaterialUrl: String,
  status: {
    type: String,
    enum: ['upcoming','live','completed','cancelled'],
    default: 'upcoming',
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MentorClass', mentorClassSchema);
