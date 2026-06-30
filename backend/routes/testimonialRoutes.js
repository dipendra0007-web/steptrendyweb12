const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAll);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
