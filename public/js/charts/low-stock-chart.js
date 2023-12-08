export function renderLowStockChart(itemNames, itemQuantities) {
  const ctx = document.getElementById('lowStockChart').getContext('2d');
  const lowStockChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: itemNames,
      datasets: [{
        label: 'Quantity',
        data: itemQuantities,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
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
