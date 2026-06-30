const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  icon: { type: String },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: { type: String, required: true },
  features: [{ type: String }],
  technologies: [{ type: String }],
  price: { type: String },
  duration: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

ServiceSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);
