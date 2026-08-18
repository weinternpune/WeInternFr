const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String },
  interest: { type: String, required: true },
  year: { type: String },
  duration: { type: String, enum: ['3-month', '6-month'], required: true },
  internshipType: { type: String, enum: ['3-month', '6-month'], required: true },
  resumeUrl: { type: String },
  
  // Payment fields
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  paymentId: { type: String },
  paymentOrderId: { type: String },
  registrationFee: { type: Number, required: true },
  paidAt: { type: Date },
  
  // Application status
  status: { 
    type: String, 
    enum: ['pending', 'payment_pending', 'reviewing', 'accepted', 'rejected'], 
    default: 'payment_pending' 
  },
  notes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
