const express = require('express');
const router = express.Router();
const controllers = require('../controllers/sectionController');
const { protect, adminOnly } = require('../middleware/auth');

// Helper to register CRUD routes for a section
const registerSectionRoutes = (pathName, controllerKey) => {
  const ctrl = controllers[controllerKey];
  
  router.get(`/${pathName}`, ctrl.getAll);
  router.get(`/${pathName}/:id`, ctrl.getOne);
  router.post(`/${pathName}`, protect, adminOnly, ctrl.create);
  router.put(`/${pathName}/:id`, protect, adminOnly, ctrl.update);
  router.delete(`/${pathName}/:id`, protect, adminOnly, ctrl.remove);
};

// Register all CRUD routes
registerSectionRoutes('faq', 'faq');
registerSectionRoutes('pricing', 'pricing');
registerSectionRoutes('timeline', 'timeline');
registerSectionRoutes('tech-stack', 'techStack');
registerSectionRoutes('process', 'process');
registerSectionRoutes('team', 'team');
registerSectionRoutes('about', 'about');

module.exports = router;
