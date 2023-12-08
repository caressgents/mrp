const socket = io.connect('/');

socket.on('connect', () => {
  console.log('Connected to the server via Socket.IO');
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
});

socket.on('inventoryUpdate', data => {
  switch (data.action) {
    case 'add':
      addToInventoryTable(data.item);
      break;
    case 'update':
      updateInventoryTable(data.item);
      break;
    case 'delete':
      removeFromInventoryTable(data.itemId);
      break;
  }
});

socket.on('initialInventoryData', inventoryItems => {
  inventoryItems.forEach(addToInventoryTable);
});

function addToInventoryTable(item) {
  const table = document.getElementById('inventoryTable');
  const row = table.insertRow(-1);
  row.setAttribute('data-id', item._id);
  row.insertCell(0).textContent = item.name;
  row.insertCell(1).textContent = item.supplierName;
  row.insertCell(2).textContent = item.cost;
  row.insertCell(3).textContent = item.quantity;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function () {
    socket.emit('deleteItem', item._id);
  };
  row.insertCell(4).appendChild(deleteButton);
}

function updateInventoryTable(item) {
  const rowToUpdate = document.querySelector(`[data-id='${item._id}']`);
  if (rowToUpdate) {
    rowToUpdate.cells[0].textContent = item.name;
    rowToUpdate.cells[1].textContent = item.supplierName;
    rowToUpdate.cells[2].textContent = item.cost;
    rowToUpdate.cells[3].textContent = item.quantity;
  }
}

function removeFromInventoryTable(itemId) {
  const rowToDelete = document.querySelector(`[data-id='${itemId}']`);
  if (rowToDelete) {
    rowToDelete.parentNode.removeChild(rowToDelete);
  }
}

