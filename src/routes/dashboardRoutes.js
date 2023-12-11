import express from 'express';
import { getInventoryDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/inventory-dashboard', getInventoryDashboard);

export default router;
