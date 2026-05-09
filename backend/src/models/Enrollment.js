const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  coursePrice: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  year: { type: String, required: true },
  paymentId: { type: String },
  paymentOrderId: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  status: { type: String, enum: ['enrolled', 'in_progress', 'completed', 'dropped'], default: 'enrolled' }
}, { timestamps: true });

const hireRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: [{ type: String }],
  description: { type: String, required: true },
  budget: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'in_progress', 'closed'], default: 'new' },
  notes: { type: String }
}, { timestamps: true });

module.exports = {
  Enrollment: mongoose.model('Enrollment', enrollmentSchema),
  HireRequest: mongoose.model('HireRequest', hireRequestSchema)
};
