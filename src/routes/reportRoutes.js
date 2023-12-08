const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/inventory', authMiddleware.verifyToken, reportController.inventoryReport);

router.get('/inventory/csv', authMiddleware.verifyToken, reportController.downloadInventoryReportCSV);

module.exports = router;
