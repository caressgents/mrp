import { renderInventoryValueChart } from './charts/inventory-value-chart.js';
import { renderLowStockChart } from './charts/low-stock-chart.js';

const socket = io.connect('/');

socket.on('inventoryUpdate', (data) => {
  updateInventoryReports();
});

document.addEventListener('DOMContentLoaded', () => {
  updateInventoryReports();
});

document.getElementById('downloadCsvButton').addEventListener('click', () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    window.open('/api/reports/inventory/csv', '_blank');
  } else {
    alert('You must be logged in to download the report.');
  }
});

export async function updateInventoryReports() {
  try {
    const response = await fetch('/api/reports/inventory', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    updateReportTables(data);
    renderCharts(data);
  } catch (error) {
    console.error('Failed to fetch inventory report:', error);
  }
}

function updateReportTables(data) {
  const totalInventoryValueElement = document.getElementById('total-inventory-value');
  const itemWiseValueTableBody = document.getElementById('item-wise-value-table').querySelector('tbody');
  const lowStockItemsTableBody = document.getElementById('low-stock-items-table').querySelector('tbody');

  clearTableBody(itemWiseValueTableBody);
  clearTableBody(lowStockItemsTableBody);

  totalInventoryValueElement.textContent = data.totalInventoryValue.toFixed(2);

  for (const itemName in data.itemWiseTotalValue) {
    const row = itemWiseValueTableBody.insertRow();
    row.insertCell(0).textContent = itemName;
    row.insertCell(1).textContent = data.itemWiseTotalValue[itemName].toFixed(2);
  }

  data.lowStockItems.forEach(item => {
    const row = lowStockItemsTableBody.insertRow();
    row.insertCell(0).textContent = item.name;
    row.insertCell(1).textContent = item.quantity;
  });
}

function renderCharts(data) {
  const itemNames = Object.keys(data.itemWiseTotalValue);
  const itemValues = Object.values(data.itemWiseTotalValue);
  renderInventoryValueChart(itemNames, itemValues);

  const lowStockItemNames = data.lowStockItems.map(item => item.name);
  const lowStockItemQuantities = data.lowStockItems.map(item => item.quantity);
  renderLowStockChart(lowStockItemNames, lowStockItemQuantities);
}

function clearTableBody(tableBody) {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}
