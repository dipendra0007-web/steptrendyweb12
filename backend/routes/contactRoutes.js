const express = require('express');
const router = express.Router();
const { submit, getAll, updateStatus, remove } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submit);
router.get('/', protect, adminOnly, getAll);
router.put('/:id', protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
