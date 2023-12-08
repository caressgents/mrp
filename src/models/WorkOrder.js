const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  items: [{
    inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, enum: ['open', 'complete', 'cancelled'], default: 'open' }
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);