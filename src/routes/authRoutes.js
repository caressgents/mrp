const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.signup);

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').not().isEmpty().withMessage('Password must not be empty')
], authController.login);

router.get('/protected', authMiddleware.verifyToken, authController.protected);

module.exports = router;