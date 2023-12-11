import express from 'express';
import { body } from 'express-validator';
import { addInventoryItem, getInventoryItems, updateInventoryItem, deleteInventoryItem, batchUploadInventoryItems, getInventoryItemById } from '../controllers/inventoryController.js';
import upload from '../middleware/fileUploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',
  [
    body('name').not().isEmpty().withMessage('Name must not be empty'),
    body('supplierName').not().isEmpty().withMessage('Supplier name must not be empty'),
    body('cost').isNumeric().withMessage('Cost must be a number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  addInventoryItem
);

router.get('/', getInventoryItems);
router.get('/:id', verifyToken, getInventoryItemById);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);
router.post('/batch-upload', upload.single('inventoryFile'), batchUploadInventoryItems);

export default router;
