async function fetchInventoryItems() {
  try {
    const response = await fetch('/api/inventory', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function submitProductItemForm(event) {
  event.preventDefault();
  const productName = document.getElementById('productName').value;
  const productDescription = document.getElementById('productDescription').value;
  const materials = Array.from(document.querySelectorAll('.bill-of-material')).map(row => ({
    inventoryItem: row.querySelector('.inventory-item-selection').value,
    requiredQuantity: parseInt(row.querySelector('.required-quantity').value, 10)
  }));

  try {
    const response = await fetch('/api/productitems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify({
        name: productName,
        description: productDescription,
        billOfMaterials: materials,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit product');
    }

    const result = await response.json();
    console.log('Product added successfully:', result);
    alert('Product added successfully');
    window.location.reload();
    
  } catch (error) {
    console.error('Failed to submit product:', error);
    alert('Failed to add product');
  }
}

function addBillOfMaterialsRow(inventoryItems) {
  const billOfMaterialsContainer = document.getElementById('billOfMaterialsContainer');
  const div = document.createElement('div');
  div.className = 'bill-of-material form-row align-items-center mb-2';

  const select = document.createElement('select');
  select.className = 'custom-select inventory-item-selection';
  inventoryItems.forEach(item => {
    const option = document.createElement('option');
    option.value = item._id;
    option.textContent = `${item.name} (Available: ${item.quantity})`;
    select.appendChild(option);
  });

  const input = document.createElement('input');
  input.className = 'required-quantity form-control';
  input.type = 'number';
  input.value = '1';
  input.min = '1';

  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-danger ml-2';
  removeButton.textContent = 'Remove';
  removeButton.type = 'button';
  removeButton.onclick = function() {
    billOfMaterialsContainer.removeChild(div);
  }

  div.appendChild(select);
  div.appendChild(input);
  div.appendChild(removeButton);
  billOfMaterialsContainer.appendChild(div);
}

document.addEventListener('DOMContentLoaded', async () => {
  const inventoryItems = await fetchInventoryItems();
  document.getElementById('addBOMRowButton').addEventListener('click', () => addBillOfMaterialsRow(inventoryItems));
  document.getElementById('productItemForm').addEventListener('submit', submitProductItemForm);
  addBillOfMaterialsRow(inventoryItems);
});
