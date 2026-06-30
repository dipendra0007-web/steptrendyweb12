const Setting = require('../models/Setting');

// Get settings (will create default row if none exists)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        emails: ['info@steptrendy.com', 'dipendra@steptrendy.com'],
        phoneNumbers: ['+977-9800000000', '+91-9800000000'],
        addresses: ['Surat, Gujarat, India', 'Kathmandu, Nepal'],
        whatsapp: '+9779800000000',
        workingHours: [
          { days: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
          { days: 'Saturday', time: '10:00 AM - 4:00 PM' }
        ],
        socials: [
          { name: 'Facebook', icon: 'Facebook', link: 'https://facebook.com' },
          { name: 'Twitter', icon: 'Twitter', link: 'https://twitter.com' },
          { name: 'LinkedIn', icon: 'Linkedin', link: 'https://linkedin.com' },
          { name: 'GitHub', icon: 'Github', link: 'https://github.com' }
        ]
      });
    }
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

// Update settings
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (!settings) {
      settings = await Setting.create(updateData);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, updateData, { new: true, runValidators: true });
    }
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};
