const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, default: 'Remote / Surat, India' },
  type: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract'], default: 'full-time' },
  experience: { type: String, required: true },
  salary: { type: String },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  skills: [{ type: String }],
  benefits: [{ type: String }],
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  deadline: { type: Date },
}, { timestamps: true });

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  coverLetter: { type: String },
  resumeUrl: { type: String },
  portfolioUrl: { type: String },
  linkedinUrl: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], default: 'pending' },
}, { timestamps: true });

module.exports = { Career: mongoose.model('Career', CareerSchema), Application: mongoose.model('Application', ApplicationSchema) };
