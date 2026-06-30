const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  photo: { type: String },
  role: { type: String, required: true },
  socialLinks: [{
    name: { type: String }, // e.g. LinkedIn, GitHub, Twitter
    link: { type: String }
  }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
