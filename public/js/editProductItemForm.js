async function fetchProductItemDetails(productId) {
  try {
    const response = await fetch(`/api/productitems/${productId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch product item details');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function updateProductItem(event) {
  event.preventDefault();
  const productId = document.getElementById('productItemId').value;
  const productName = document.getElementById('editProductName').value;
  const productDescription = document.getElementById('editProductDescription').value;
  const productMaterials = document.getElementById('editProductMaterials').value;
  try {
    const response = await fetch(`/api/productitems/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: productName,
        description: productDescription,
        materials: productMaterials.split(',')
      })
    });
    if (!response.ok) {
      throw new Error('Failed to update product item');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function populateForm(productId) {
  const productDetails = await fetchProductItemDetails(productId);
  if (productDetails) {
    document.getElementById('editProductName').value = productDetails.name;
    document.getElementById('editProductDescription').value = productDetails.description;
    document.getElementById('editProductMaterials').value = productDetails.materials.join(', ');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const productId = new URLSearchParams(window.location.search).get('productId');
  if (productId) {
    await populateForm(productId);
    document.getElementById('editProductItemForm').addEventListener('submit', updateProductItem);
  }
});