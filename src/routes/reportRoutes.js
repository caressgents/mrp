import express from 'express';
import { inventoryReport, downloadInventoryReportCSV } from '../controllers/reportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/inventory', verifyToken, inventoryReport);
router.get('/inventory/csv', verifyToken, downloadInventoryReportCSV);

export default router;
