const mongoose = require('mongoose');

const TechStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true }, // Image/logo URL
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TechStack', TechStackSchema);
