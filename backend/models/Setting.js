const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  websiteName: { type: String, default: 'StepTrendy Technologies' },
  logo: { type: String, default: '/logo.png' },
  favicon: { type: String, default: '/favicon.ico' },
  copyrightText: { type: String, default: '© 2026 StepTrendy Technologies Pvt. Ltd. All rights reserved.' },
  emails: [{ type: String }],
  phoneNumbers: [{ type: String }],
  addresses: [{ type: String }],
  whatsapp: { type: String },
  workingHours: [{
    days: { type: String },
    time: { type: String }
  }],
  socials: [{
    name: { type: String },
    icon: { type: String }, // lucide icon name
    link: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
