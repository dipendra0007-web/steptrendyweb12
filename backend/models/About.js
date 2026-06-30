const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  detail: { type: String, required: true },
  photo: { type: String }, // optional image
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
