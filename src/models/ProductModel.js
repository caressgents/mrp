import mongoose from 'mongoose';

const productModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sizes: [{ type: String, required: true }],
  types: [{ type: String, required: true }]
});

export default mongoose.model('ProductModel', productModelSchema);