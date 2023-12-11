import fs from 'fs';
import InventoryItem from '../models/InventoryItem.js';
import csvParser from 'csv-parser';

export const processInventoryBatchUpload = (filePath) => {
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

