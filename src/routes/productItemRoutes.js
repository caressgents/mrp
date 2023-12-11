import express from 'express';
import { addProductItem, updateProductItem, deleteProductItem } from '../controllers/productItemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, addProductItem);
router.put('/:id', verifyToken, updateProductItem);
router.delete('/:id', verifyToken, deleteProductItem);

export default router;
