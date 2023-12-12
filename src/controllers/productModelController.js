import ProductModel from '../models/ProductModel.js';

// Create a new Product Model
export const createProductModel = async (req, res) => {
  try {
    const { name, description, sizes, types } = req.body;
    const productModel = new ProductModel({
      name,
      description,
      sizes,
      types
    });

    await productModel.save();
    res.status(201).json(productModel);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product model', error: error.message });
  }
};

// Retrieve all Product Models
export const getAllProductModels = async (req, res) => {
  try {
    const productModels = await ProductModel.find();
    res.status(200).json(productModels);
  } catch (error) {
    res.status(500).json({ message: 'Error getting product models', error: error.message });
  }
};

// Retrieve a single Product Model by ID
export const getProductModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const productModel = await ProductModel.findById(id);
    if (!productModel) {
      return res.status(404).json({ message: 'Product model not found' });
    }
    res.status(200).json(productModel);
  } catch (error) {
    res.status(500).json({ message: 'Error getting product model', error: error.message });
  }
};

// Update a Product Model
export const updateProductModel = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const productModel = await ProductModel.findByIdAndUpdate(id, update, { new: true });
    if (!productModel) {
      return res.status(404).json({ message: 'Product model not found' });
    }
    res.status(200).json(productModel);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product model', error: error.message });
  }
};

// Delete a Product Model
export const deleteProductModel = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product model', error: error.message });
  }
};
