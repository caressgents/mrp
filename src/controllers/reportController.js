import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import InventoryItem from '../models/InventoryItem.js';

export const inventoryReport = async (req, res) => {
  try {
    const inventoryList = await InventoryItem.find({});
    let report = 'Name,Supplier,Cost,Quantity\n';
    inventoryList.forEach(item => {
      report += `${item.name},${item.supplierName},${item.cost},${item.quantity}\n`;
    });
    res.send(report);
  } catch (error) {
    res.status(500).send('Failed to generate report.');
  }
};

export const downloadInventoryReportCSV = async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find().select('name supplierName cost quantity').lean();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(inventoryItems);
    const timestamp = new Date().toISOString();
    const filename = `inventory-report-${timestamp}.csv`;
    const filePath = path.join(__dirname, '..', 'temp', filename);
    if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'temp'));
    }
    fs.writeFileSync(filePath, csv);
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading the CSV file:', err);
      }
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting the CSV file:', unlinkErr);
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory report CSV', error: error.message });
  }
};
