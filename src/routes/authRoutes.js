import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.signup);

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').not().isEmpty().withMessage('Password must not be empty')
], authController.login);

router.get('/protected', authMiddleware.verifyToken, authController.protectedRoute);

export default router;
