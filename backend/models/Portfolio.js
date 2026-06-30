const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  category: {
    type: String,
    enum: ['web', 'mobile', 'ui-ux', 'branding', 'ai', 'software'],
    required: true
  },
  client: { type: String, required: true },
  technologies: [{ type: String }],
  description: { type: String, required: true },
  shortDescription: { type: String },
  coverImage: { type: String, required: true },
  images: [{ type: String }],
  colorPalette: [{ name: String, hex: String }],
  typography: [{ name: String, usage: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  duration: { type: String },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

PortfolioSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
