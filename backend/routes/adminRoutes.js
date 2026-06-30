const express = require('express');
const router = express.Router();
const { getStats, uploadImage } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/stats', protect, adminOnly, getStats);
router.post('/upload', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
