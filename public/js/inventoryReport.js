document.addEventListener('DOMContentLoaded', () => {
  const totalInventoryValueElement = document.getElementById('total-inventory-value');
  const itemWiseValueTableBody = document.getElementById('item-wise-value-table').querySelector('tbody');
  const lowStockItemsTableBody = document.getElementById('low-stock-items-table').querySelector('tbody');

  fetch('/api/reports/inventory', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  })
  .then(data => {
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
  })
  .catch(error => console.error('Failed to fetch inventory report:', error));
});

function clearTableBody(tableBody) {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

function updateReportTables(updatedData) {
  clearTableBody(itemWiseValueTableBody);
  clearTableBody(lowStockItemsTableBody);
}
