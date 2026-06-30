const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const { Career, Application } = require('../models/Career');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');

// @desc  Get dashboard stats
// @route GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalProjects, totalBlogs, totalMessages, totalApplications,
      totalTestimonials, totalSubscribers, newMessages, newApplications
    ] = await Promise.all([
      Portfolio.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Application.countDocuments(),
      Testimonial.countDocuments(),
      Newsletter.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Application.countDocuments({ status: 'pending' }),
    ]);

    const recentMessages = await Contact.find().sort({ createdAt: -1 }).limit(5);
    const recentApplications = await Application.find().populate('job', 'title').sort({ createdAt: -1 }).limit(5);

    // Monthly contact stats
    const monthlyContacts = await Contact.aggregate([
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        stats: { totalProjects, totalBlogs, totalMessages, totalApplications, totalTestimonials, totalSubscribers, newMessages, newApplications },
        recentMessages,
        recentApplications,
        monthlyContacts
      }
    });
  } catch (err) { next(err); }
};

// @desc  Upload image
// @route POST /api/admin/upload
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, url: req.file.path, public_id: req.file.filename });
  } catch (err) { next(err); }
};
