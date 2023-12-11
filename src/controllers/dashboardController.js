import path from 'path';

export const getInventoryDashboard = (req, res) => {
  res.sendFile(path.join(path.resolve(), 'public', 'inventoryDashboard.html'));
};
