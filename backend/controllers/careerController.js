const { Career, Application } = require('../models/Career');

// Jobs
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Career.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) { next(err); }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Career.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) { next(err); }
};

exports.createJob = async (req, res, next) => {
  try {
    const job = await Career.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) { next(err); }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: job });
  } catch (err) { next(err); }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) { next(err); }
};

// Applications
exports.apply = async (req, res, next) => {
  try {
    const job = await Career.findById(req.params.id);
    if (!job || job.status === 'closed') {
      return res.status(400).json({ success: false, message: 'Job is not available' });
    }
    const application = await Application.create({ job: req.params.id, ...req.body });
    res.status(201).json({ success: true, data: application, message: 'Application submitted successfully!' });
  } catch (err) { next(err); }
};

exports.getApplications = async (req, res, next) => {
  try {
    const apps = await Application.find().populate('job', 'title department').sort({ createdAt: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) { next(err); }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: app });
  } catch (err) { next(err); }
};
