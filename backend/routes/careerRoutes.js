const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, apply, getApplications, updateApplication } = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/applications', protect, adminOnly, getApplications);
router.get('/:id', getJob);
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);
router.post('/:id/apply', apply);
router.put('/applications/:id', protect, adminOnly, updateApplication);

module.exports = router;
