import ProductItem from '../models/ProductItem.js';

export const addProductItem = async (req, res) => {
  try {
    const { name, description, billOfMaterials } = req.body;
    const productItem = new ProductItem({
      name,
      description,
      billOfMaterials
    });
    await productItem.save();
    res.status(201).json(productItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product item', error: error.message });
  }
};

export const updateProductItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, billOfMaterials } = req.body;

    const updatedProductItem = await ProductItem.findByIdAndUpdate(
      id,
      { name, description, billOfMaterials },
      { new: true, runValidators: true }
    ).populate('billOfMaterials.inventoryItem');

    if (!updatedProductItem) {
      return res.status(404).json({ message: 'Product item not found.' });
    }

    res.status(200).json({ message: 'Product item updated successfully', productItem: updatedProductItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product item', error: error.message });
  }
};

export const deleteProductItem = async (req, res) => {
  try {
    const { id } = req.params;
    const productItem = await ProductItem.findById(id);

    if (!productItem) {
      return res.status(404).json({ message: 'Product item not found.' });
    }

    await ProductItem.findByIdAndRemove(id);
    res.status(200).json({ message: 'Product item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product item', error: error.message });
  }
};

export default { addProductItem, updateProductItem, deleteProductItem };