const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

router.post('/subscribe', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) return res.status(400).json({ success: false, message: 'Email already subscribed' });
      existing.isActive = true;
      await existing.save();
      return res.json({ success: true, message: 'Subscription reactivated!' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully! Thank you.' });
  } catch (err) { next(err); }
});

router.post('/unsubscribe', async (req, res, next) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email }, { isActive: false });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
