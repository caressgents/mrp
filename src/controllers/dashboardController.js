const path = require('path');

exports.getInventoryDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'inventoryDashboard.html'));
};