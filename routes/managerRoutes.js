const express = require('express');
const { getLeads, updateLead } = require('../controllers/managerController');
const { protect, manager } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(manager);

router.get('/leads', getLeads);
router.patch('/leads/:id', updateLead);

module.exports = router;