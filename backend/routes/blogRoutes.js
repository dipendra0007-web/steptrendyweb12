const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove, getCategories } = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/', getAll);
router.get('/:slug', getOne);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
