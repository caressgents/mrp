import InventoryItem from '../models/InventoryItem.js';
import { processInventoryBatchUpload } from '../utils/processBatchUpload.js';

export const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find({});
    res.status(200).json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory items', error: error.message });
  }
};

export const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await InventoryItem.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory item', error: error.message });
  }
};

export const addInventoryItem = async (req, res) => {
  try {
    const { name, supplierName, cost, quantity } = req.body;
    let inventoryItem = new InventoryItem({ name, supplierName, cost, quantity });
    await inventoryItem.save();
    res.status(201).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory item', error: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory item', error: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
};

export const batchUploadInventoryItems = async (req, res) => {
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
