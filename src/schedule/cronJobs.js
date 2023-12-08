const cron = require('node-cron');
const InventoryItem = require('../models/InventoryItem');
const { alertInventoryReorderLevel } = require('./emailNotifier');

const { getReorderAlertEmailConfig } = require('../configuration');

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

const startCronJobs = () => {
  cron.schedule('0 9 * * *', () => {
    console.log('Running a daily check for inventory reorder...');
    checkAndNotifyReorder();
  });
};

module.exports = startCronJobs;
