import mongoose from 'mongoose';
const { Schema } = mongoose;

const billOfMaterialsSchema = new Schema({
  inventoryItem: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  requiredQuantity: { type: Number, required: true }
});

const productItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  billOfMaterials: [billOfMaterialsSchema]
}, {
  timestamps: true
});

export default mongoose.model('ProductItem', productItemSchema);
