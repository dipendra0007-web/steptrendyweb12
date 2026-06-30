const Blog = require('../models/Blog');

exports.getAll = async (req, res, next) => {
  try {
    const { category, status = 'published', search, page = 1, limit = 9 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
    const total = await Blog.countDocuments(query);
    const posts = await Blog.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, count: posts.length, total, pages: Math.ceil(total / limit), data: posts });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const post = await Blog.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};
