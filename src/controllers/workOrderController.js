import WorkOrder from '../models/WorkOrder.js';
import InventoryItem from '../models/InventoryItem.js';
import ProductItem from '../models/ProductItem.js';
import { createWorkOrderPDF } from '../utils/pdfGenerator.js';
import { sendEmailWithAttachment } from '../utils/emailService.js';
import path from 'path';
import fs from 'fs';

const validateProductItemBillOfMaterials = async (productItemId, orderQuantity) => {
  const productItem = await ProductItem.findById(productItemId).populate('billOfMaterials.inventoryItem');
  if (!productItem) {
    throw new Error(`Product item with ID ${productItemId} not found.`);
  }
  if (!productItem.billOfMaterials || productItem.billOfMaterials.length === 0) {
    throw new Error(`Product item with ID ${productItemId} has no bill of materials.`);
  }
  for (let material of productItem.billOfMaterials) {
    if (material.requiredQuantity * orderQuantity > material.inventoryItem.quantity) {
      throw new Error(`Not enough stock for product item: ${productItem.name}, material: ${material.inventoryItem.name}`);
    }
  }
  return productItem;
};

export const createWorkOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const workOrder = new WorkOrder({ items: [] });
    const inventoryOperations = [];

    for (let orderItem of items) {
      const productItem = await validateProductItemBillOfMaterials(orderItem.productItemId, orderItem.quantity);
      for (let material of productItem.billOfMaterials) {
        inventoryOperations.push({
          inventoryItemId: material.inventoryItem._id,
          quantityToDeduct: material.requiredQuantity * orderItem.quantity
        });
      }
      workOrder.items.push({ inventoryItem: productItem._id, quantity: orderItem.quantity });
    }

    for (let operation of inventoryOperations) {
      await InventoryItem.findByIdAndUpdate(operation.inventoryItemId, { $inc: { quantity: -operation.quantityToDeduct } });
    }

    await workOrder.save();
    res.status(201).json(workOrder);
  } catch (error) {
    console.error('Error in createWorkOrder:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().populate('items.inventoryItem');
    res.status(200).json(workOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving work orders', error: error.message });
  }
};

export const updateWorkOrderStatus = async (req, res) => {
  // Implementation of the function
  try {
    const { id } = req.params;
    const { status } = req.body;
    const workOrder = await WorkOrder.findByIdAndUpdate(id, { status }, { new: true });
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    res.status(200).json(workOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating work order', error: error.message });
  }
};

