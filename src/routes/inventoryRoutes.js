const express = require('express');
const { body } = require('express-validator');
const inventoryController = require('../controllers/inventoryController');
const router = express.Router();
const upload = require('../middleware/fileUploadMiddleware');

router.post('/' ,
  [
    body('name').not().isEmpty().withMessage('Name must not be empty'),
    body('supplierName').not().isEmpty().withMessage('Supplier name must not be empty'),
    body('cost').isNumeric().withMessage('Cost must be a number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  inventoryController.addInventoryItem
);

router.get('/', inventoryController.getInventoryItems);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);
router.post('/batch-upload', upload.single('inventoryFile'), inventoryController.batchUploadInventoryItems);

module.exports = router;