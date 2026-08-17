const mongoose = require('mongoose');

const mentorAttendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorClass', required: true, index: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['present','absent','late','excused'], required: true },
  markedAt: { type: Date, default: Date.now },
  note: String
}, { timestamps: true });

mentorAttendanceSchema.index({ classId: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('MentorAttendance', mentorAttendanceSchema);
