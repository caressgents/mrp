document.addEventListener('DOMContentLoaded', () => {
  fetchProductItems();
});

async function fetchProductItems() {
  try {
    const response = await fetch('/api/productitems', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch product items');
    }
    const productItems = await response.json();
    populateProductItemsTable(productItems);
  } catch (error) {
    console.error(error);
  }
}

function populateProductItemsTable(productItems) {
  const tableBody = document.getElementById('productItemsTable').querySelector('tbody');
  productItems.forEach(item => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = item.name;
    row.insertCell(1).textContent = item.description;

    const deleteCell = row.insertCell(2);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.addEventListener('click', () => deleteProductItem(item._id, row));
    
    deleteCell.appendChild(deleteButton);
  });
}

async function deleteProductItem(itemId, row) {
  if (!confirm('Are you sure you want to delete this product item?')) {
    return;
  }
  try {
    const response = await fetch(`/api/productitems/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete the product item');
    }
    row.remove(); // Remove the row from the table
    alert('Product item deleted successfully');
  } catch (error) {
    console.error('Failed to delete product item:', error);
    alert('Failed to delete product item');
  }
}
