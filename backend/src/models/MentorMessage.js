const mongoose = require('mongoose');

const mentorMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  batch: String,
  subject: String,
  message: { type: String, required: true },
  attachmentUrl: String,
  readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('MentorMessage', mentorMessageSchema);
