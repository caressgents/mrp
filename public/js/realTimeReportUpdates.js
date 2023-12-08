import { updateInventoryReports } from './reports.js';

const socket = io.connect('/');

socket.on('inventoryChange', () => {
  updateInventoryReports();
});

export { socket };
