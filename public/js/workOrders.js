document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/productitems', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
  })
  .then(response => response.json())
  .then(productItems => {
    const productItemSelect = document.getElementById('productItemSelect');
    productItems.forEach(item => {
      let option = new Option(item.name, item._id);
      productItemSelect.add(option);
    });
  })
  .catch(error => {
    console.error('Error loading product items:', error);
    alert('Error loading product items from the server. Please try again later.');
  });
});

document.getElementById('new-work-order-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Get the selected product item
  const productItemSelect = document.getElementById('productItemSelect');
  const selectedProductItemId = productItemSelect.value;
  
  fetch('/api/workorders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    },
    body: JSON.stringify({ items: [{ inventoryItem: selectedProductItemId, quantity: 1 }] }) // Quantity is hardcoded to 1, you may need to change this based on the actual form structure
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  })
  .then(result => {
    console.log('Success:', result);
    // Handle success notifications or redirection here
  })
  .catch(error => {
    console.error('Failed to create work order:', error);
    // Handle failure notifications or error messages here
  });
});
