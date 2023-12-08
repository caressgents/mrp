const express = require('express');
const workOrderController = require('../controllers/workOrderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware.verifyToken, workOrderController.createWorkOrder);
router.get('/', authMiddleware.verifyToken, workOrderController.getWorkOrders);
router.put('/:id', authMiddleware.verifyToken, workOrderController.updateWorkOrderStatus);
router.get('/:id/email', authMiddleware.verifyToken, workOrderController.emailWorkOrder);

module.exports = router;
