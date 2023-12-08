export function renderInventoryValueChart(itemNames, itemValues) {
  const ctx = document.getElementById('itemWiseValueChart').getContext('2d');
  const inventoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: itemNames,
      datasets: [{
        label: 'Total Value',
        data: itemValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
