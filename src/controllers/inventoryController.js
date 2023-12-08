const InventoryItem = require('../models/InventoryItem');
const { processInventoryBatchUpload } = require('../utils/processBatchUpload');

exports.addInventoryItem = async (req, res) => {
  try {
    const { name, supplierName, cost, quantity } = req.body;
    if (!name || !supplierName || !cost) {
      return res.status(400).json({ 
        message: 'Error adding inventory item', 
        error: 'Missing required fields. Ensure \"name\", \"supplierName\", and \"cost\" are provided.' 
      });
    }
    let inventoryItem = new InventoryItem({ name, supplierName, cost, quantity });
    await inventoryItem.save();
    global.io.emit('inventoryUpdate', { action: 'add', item: inventoryItem });
    res.status(201).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding inventory item', 
      error: parseMongooseError(error) 
    });
  }
};

function parseMongooseError(error) {
  if (error.name === 'ValidationError') {
    return Object.values(error.errors).map(e => e.message).join(', ');
  }
  return error.message;
}

exports.getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find({});
    global.io.emit('initialInventoryData', inventoryItems);
    res.status(200).json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory items', error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const inventoryItem = await InventoryItem.findByIdAndUpdate(id, update, { new: true });
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    global.io.emit('inventoryUpdate', { action: 'update', item: inventoryItem });
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory item', error: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await InventoryItem.findByIdAndDelete(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    global.io.emit('inventoryUpdate', { action: 'delete', itemId: id });
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
};

exports.batchUploadInventoryItems = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const results = await processInventoryBatchUpload(req.file.path);
    res.status(201).json({ message: 'Batch inventory update successful', results });
  } catch (error) {
    res.status(500).json({ message: 'Error processing batch upload', error: error.message });
  }
};
