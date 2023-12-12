import express from 'express';
import {
  createProductModel,
  getAllProductModels,
  getProductModelById,
  updateProductModel,
  deleteProductModel
} from '../controllers/productModelController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Assuming we use this middleware to protect our routes.

const router = express.Router();

router.post('/', verifyToken, createProductModel);
router.get('/', verifyToken, getAllProductModels);
router.get('/:id', verifyToken, getProductModelById);
router.put('/:id', verifyToken, updateProductModel);
router.delete('/:id', verifyToken, deleteProductModel);

export default router;
