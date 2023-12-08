const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

router.get('/inventory-dashboard', dashboardController.getInventoryDashboard);

module.exports = router;