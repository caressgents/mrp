const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplierName: { type: String, required: true },
  cost: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  supplierReorderLevel: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
