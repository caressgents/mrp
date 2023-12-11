import cron from 'node-cron';
import InventoryItem from '../models/InventoryItem.js';
import { alertInventoryReorderLevel } from './emailNotifier.js';
import { getReorderAlertEmailConfig } from '../configuration.js';

const checkAndNotifyReorder = () => {
  InventoryItem.find({ $expr: { $lte: ['$quantity', '$supplierReorderLevel'] } })
    .then(itemsBelowReorderLevel => {
      if (itemsBelowReorderLevel.length > 0) {
        const alertEmailConfig = getReorderAlertEmailConfig();
        alertInventoryReorderLevel(alertEmailConfig, itemsBelowReorderLevel);
      }
    })
    .catch(err => {
      console.error('Failed to check inventory for reorder levels:', err);
    });
};

export const startCronJobs = () => {
  cron.schedule('0 9 * * *', () => {
    console.log('Running a daily check for inventory reorder...');
    checkAndNotifyReorder();
  });
};

