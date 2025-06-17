function processCSV() {
  const file = document.getElementById("csvFile").files[0];
  if (!file) return alert("Please upload a CSV file.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const rows = e.target.result.trim().split("\n").slice(1);
    const data = rows.map(row => {
      const [name, category, stock, dailySales] = row.split(",");
      const stockNum = parseInt(stock);
      const dailyNum = parseFloat(dailySales);
      return {
        name: name.trim(),
        category: category.trim(),
        stock: stockNum,
        dailySales: dailyNum,
        burnRate: dailyNum,
        daysLeft: dailyNum > 0 ? (stockNum / dailyNum).toFixed(1) : "∞"
      };
    });

    renderTable(data);
    renderCharts(data);
  };
  reader.readAsText(file);
}

function renderTable(data) {
  const container = document.getElementById("inventoryTableContainer");
  let html = `<table>
    <thead><tr>
      <th>Product</th>
      <th>Category</th>
      <th>Stock</th>
      <th>Daily Sales</th>
      <th>Burn Rate</th>
      <th>Days Until Stockout</th>
    </tr></thead><tbody>`;
  data.forEach(item => {
    const warning = item.daysLeft !== "∞" && item.daysLeft < 5 ? "low-stock" : "";
    html += `<tr class="${warning}">
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.stock}</td>
      <td>${item.dailySales}</td>
      <td>${item.burnRate}</td>
      <td>${item.daysLeft}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

function renderCharts(data) {
  const labels = data.map(d => d.name);
  const burnRates = data.map(d => d.burnRate);
  const daysLeft = data.map(d => parseFloat(d.daysLeft));

  new Chart(document.getElementById("burnRateChart"), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Burn Rate (daily sales)',
        backgroundColor: '#0096c7',
        data: burnRates
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Burn Rate by Product' }
      }
    }
  });

  new Chart(document.getElementById("stockChart"), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Days Until Stockout',
        borderColor: '#023e8a',
        backgroundColor: 'rgba(2, 62, 138, 0.1)',
        data: daysLeft,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Stock Depletion Forecast' }
      }
    }
  });
}
