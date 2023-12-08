const WorkOrder = require('../models/WorkOrder');
const InventoryItem = require('../models/InventoryItem');
const { createWorkOrderPDF } = require('../utils/pdfGenerator');
const { sendEmailWithAttachment } = require('../utils/emailService');
const path = require('path');
const fs = require('fs');

exports.createWorkOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const workOrder = new WorkOrder({ items });

    for (let item of items) {
      let inventoryItem = await InventoryItem.findById(item.inventoryItem);
      if (!inventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      if (inventoryItem.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for item ${inventoryItem.name}` });
      }
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save();
    }

    await workOrder.save();
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating work order', error: error.message });
  }
};

exports.getWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().populate('items.inventoryItem');
    res.status(200).json(workOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving work orders', error: error.message });
  }
};

exports.updateWorkOrderStatus = async (req, res) => {
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

exports.emailWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const workOrder = await WorkOrder.findById(id).populate('items.inventoryItem');
    
    if (!workOrder) {
      res.status(404).json({ message: 'Work order not found' });
      return;
    }

    const pdfPath = path.resolve(__dirname, '..', 'temp', `workorder-${id}.pdf`);
    await createWorkOrderPDF(workOrder, pdfPath);
    
    const email = req.user.email;
    const subject = 'Work Order Details';
    const body = 'Please find the attached PDF for the work order details.';
    
    await sendEmailWithAttachment(email, subject, body, pdfPath);
    
    fs.unlinkSync(pdfPath);
    
    res.status(200).json({ message: 'Work order PDF generated and emailed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing your request', error: error.message });
  }
};
