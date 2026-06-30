const Testimonial = require('../models/Testimonial');

exports.getAll = async (req, res, next) => {
  try {
    const { status = 'active', featured } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (featured) query.featured = featured === 'true';
    const items = await Testimonial.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
};
