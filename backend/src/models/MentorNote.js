const mongoose = require('mongoose');

const mentorNoteSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  note: { type: String, required: true },
  isPrivate: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MentorNote', mentorNoteSchema);
