const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const InventoryItem = require('../models/InventoryItem');

exports.inventoryReport = async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find({});
    let totalInventoryValue = 0;
    const itemWiseTotalValue = {};
    const lowStockItems = [];

    inventoryItems.forEach(item => {
      const itemTotalValue = item.cost * item.quantity;
      itemWiseTotalValue[item.name] = itemTotalValue;
      totalInventoryValue += itemTotalValue;
      if (item.quantity <= Number(process.env.LOW_STOCK_THRESHOLD)) {
        lowStockItems.push({ name: item.name, quantity: item.quantity });
      }
    });
    console.log('Inventory Report Data:', { totalInventoryValue, itemWiseTotalValue, lowStockItems });
    res.status(200).json({
      totalInventoryValue: totalInventoryValue,
      itemWiseTotalValue: itemWiseTotalValue,
      lowStockItems: lowStockItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory report', error: error.message });
  }
};

exports.downloadInventoryReportCSV = async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find({});
    const fields = ['name', 'supplierName', 'quantity', 'cost', 'totalValue'];
    const data = inventoryItems.map(item => ({
      name: item.name,
      supplierName: item.supplierName,
      quantity: item.quantity,
      cost: item.cost,
      totalValue: (item.cost * item.quantity).toFixed(2)
    }));

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const filePath = path.join(__dirname, '..', 'temp', `inventory-report-${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'inventory-report.csv', (err) => {
      if (err) {
        throw new Error(err);
      }
      fs.unlinkSync(filePath); // Clean up the file after sending it to the client
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory report CSV', error: error.message });
  }
};
