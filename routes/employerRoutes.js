const express = require('express');
const { 
  getDashboardStats, 
  getManagers, 
  createManager, 
  updateManager, 
  deleteManager,
  getLeads,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/employerController');

const { protect, employer } = require('../middleware/auth');

const router = express.Router();

// Appliquer le middleware de protection et de verife du role à toutes les routes
router.use(protect);
router.use(employer);

// Routes du tableau de bord
router.get('/dashboard-stats', getDashboardStats);

// Routes des managers
router.route('/managers')
  .get(getManagers)
  .post(createManager);

router.route('/managers/:managerId')
  .put(updateManager)
  .delete(deleteManager);

// Routes des leads
router.route('/leads')
  .get(getLeads)
  .post(createLead);

router.route('/leads/:leadId')
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;