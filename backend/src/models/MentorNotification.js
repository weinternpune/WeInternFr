const mongoose = require('mongoose');

const mentorNotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['student_assigned','class_scheduled','class_reminder','assignment_created','assignment_submitted','deadline','attendance','progress_drop','message','project','project_assigned','project_reviewed','project_submitted','system'],
    default: 'message'
  },
  title: { type: String, required: true },
  message: String,
  readAt: Date,
  data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('MentorNotification', mentorNotificationSchema);
