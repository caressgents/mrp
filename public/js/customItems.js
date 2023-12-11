// Logic for adding custom items to the work order table
document.getElementById('addCustomItemForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const itemName = document.getElementById('customItemName').value;
  const itemQuantity = document.getElementById('customItemQuantity').valueAsNumber;

  const tableBody = document.getElementById('customItemsTable').getElementsByTagName('tbody')[0];
  const row = tableBody.insertRow();
  row.insertCell(0).textContent = itemName;
  row.insertCell(1).textContent = itemQuantity;
  
  // Adding remove button for each row
  const removeCell = row.insertCell(2);
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = "btn btn-danger";
  removeButton.onclick = function() {
    tableBody.removeChild(row);
  };
  removeCell.appendChild(removeButton);
});