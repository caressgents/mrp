document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You must be logged in to view this page.');
    return;
  }

  fetch('/api/productitems', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => response.json())
  .then(productItems => {
    populateProductItemsTable(productItems);
  })
  .catch(error => {
    console.error('Error loading product items:', error);
  });
});

function populateProductItemsTable(productItems) {
  const tableBody = document.getElementById('productItemsTable').querySelector('tbody');
  productItems.forEach(item => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = item.name;
    row.insertCell(1).textContent = item.description || 'No description';
    const actionsCell = row.insertCell(2);
    const editLink = document.createElement('a');
    editLink.href = `/editProductItem.html?productId=${item._id}`;
    editLink.textContent = 'Edit';
    editLink.className = 'mr-2';
    actionsCell.appendChild(editLink);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.dataset.itemId = item._id;
    deleteButton.addEventListener('click', deleteProductItem);
    actionsCell.appendChild(deleteButton);
  });
}

function deleteProductItem(event) {
  const itemId = event.target.dataset.itemId;
  const token = localStorage.getItem('authToken');
  if (confirm('Are you sure you want to delete this product item?')) {
    fetch(`/api/productitems/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error deleting product item');
      }
      // Remove the item row from the table after successful deletion
      event.target.closest('tr').remove();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to delete product item.');
    });
  }
}