const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:slug', getOne);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
