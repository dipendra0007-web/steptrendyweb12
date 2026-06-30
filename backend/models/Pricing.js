const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  currency: { type: String, enum: ['NPR', 'INR', 'USD'], default: 'INR' },
  period: { type: String, default: 'month' },
  tagline: { type: String },
  features: [{ type: String }],
  color: { type: String, default: '#5B8CFF' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Pricing', PricingSchema);
