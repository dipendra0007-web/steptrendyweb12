const mongoose = require('mongoose');

const ProcessSchema = new mongoose.Schema({
  step: { type: String, required: true }, // e.g. "01", "02"
  name: { type: String, required: true },
  photo: { type: String }, // Icon identifier or photo URL
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Process', ProcessSchema);
