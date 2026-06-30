const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  company: { type: String },
  budget: { type: String },
  projectDetails: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
