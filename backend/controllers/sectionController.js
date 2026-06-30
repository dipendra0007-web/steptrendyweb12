const Faq = require('../models/Faq');
const Pricing = require('../models/Pricing');
const Timeline = require('../models/Timeline');
const TechStack = require('../models/TechStack');
const Process = require('../models/Process');
const Team = require('../models/Team');
const About = require('../models/About');

// Helper to create CRUD controller factory
const createCrudController = (Model, name) => ({
  getAll: async (req, res, next) => {
    try {
      const items = await Model.find().sort({ order: 1, createdAt: 1 });
      res.json({ success: true, count: items.length, data: items });
    } catch (err) { next(err); }
  },
  getOne: async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  },
  update: async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  },
  remove: async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
      res.json({ success: true, message: `${name} deleted successfully` });
    } catch (err) { next(err); }
  }
});

module.exports = {
  faq: createCrudController(Faq, 'FAQ'),
  pricing: createCrudController(Pricing, 'Pricing Plan'),
  timeline: createCrudController(Timeline, 'Timeline Item'),
  techStack: createCrudController(TechStack, 'Tech Stack Item'),
  process: createCrudController(Process, 'Process Step'),
  team: createCrudController(Team, 'Team Member'),
  about: createCrudController(About, 'About Item')
};
