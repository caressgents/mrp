document.getElementById('inventoryForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('itemName').value;
  const supplierName = document.getElementById('itemSupplierName').value; // Get supplier name from the form
  const quantity = document.getElementById('itemAmount').value;
  const cost = document.getElementById('itemCost').value;

  fetch('/api/inventory/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    },
    body: JSON.stringify({ name, supplierName, cost, quantity })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error adding inventory item:', data.error);
    } else {
      console.log('Inventory item added:', data);
    }
  })
  .catch(error => console.error('Error adding inventory item:', error));
});

document.getElementById('inventoryFileUploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const fileInput = document.getElementById('inventoryFile');
  const formData = new FormData();
  formData.append('inventoryFile', fileInput.files[0]);

  fetch('/api/inventory/batch-upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error uploading CSV:', data.error);
    } else {
      console.log('Batch inventory update successful:', data);
    }
  })
  .catch(error => console.error('Error uploading CSV:', error));
});
