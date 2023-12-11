import express from 'express';
import { createWorkOrder, getWorkOrders, updateWorkOrderStatus } from '../controllers/workOrderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createWorkOrder);
router.get('/', verifyToken, getWorkOrders);
router.put('/:id', verifyToken, updateWorkOrderStatus);

// Removed the route for emailWorkOrder as the method has been removed from controller.

export default router;