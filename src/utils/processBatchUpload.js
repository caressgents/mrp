const fs = require('fs');
const InventoryItem = require('../models/InventoryItem');
const csvParser = require('csv-parser');

const processInventoryBatchUpload = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (data) => {
        await InventoryItem.updateOne(
          { name: data.name, supplierName: data.supplierName },
          { $set: { cost: data.cost, quantity: data.quantity } },
          { upsert: true }
        );
        results.push(data);
      })
      .on('end', () => {
        fs.unlinkSync(filePath);
        resolve(results);
      })
      .on('error', reject);
  });
};

module.exports = { processInventoryBatchUpload };
