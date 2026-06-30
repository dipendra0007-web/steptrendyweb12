const Portfolio = require('../models/Portfolio');

// @desc  Get all portfolio items
// @route GET /api/portfolio
exports.getAll = async (req, res, next) => {
  try {
    const { category, featured, status = 'published', page = 1, limit = 12 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (featured) query.featured = featured === 'true';

    const total = await Portfolio.countDocuments(query);
    const items = await Portfolio.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: items.length, total, data: items });
  } catch (err) { next(err); }
};

// @desc  Get single portfolio item
// @route GET /api/portfolio/:slug
exports.getOne = async (req, res, next) => {
  try {
    const item = await Portfolio.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
    item.views += 1;
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

// @desc  Create portfolio item
// @route POST /api/portfolio
exports.create = async (req, res, next) => {
  try {
    const item = await Portfolio.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

// @desc  Update portfolio item
// @route PUT /api/portfolio/:id
exports.update = async (req, res, next) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

// @desc  Delete portfolio item
// @route DELETE /api/portfolio/:id
exports.remove = async (req, res, next) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

// @desc  Like a project
// @route PUT /api/portfolio/:id/like
exports.like = async (req, res, next) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json({ success: true, likes: item.likes });
  } catch (err) { next(err); }
};
