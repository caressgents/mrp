import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplierName: { type: String, required: true },
  cost: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  supplierReorderLevel: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

export default mongoose.model('InventoryItem', inventoryItemSchema);
