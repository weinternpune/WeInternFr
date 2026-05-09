const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  interest: { type: String, required: true },
  year: { type: String, required: true },
  duration: { type: String, enum: ['3months', '6months'], required: true },
  status: { type: String, enum: ['pending', 'reviewing', 'accepted', 'rejected'], default: 'pending' },
  notes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
