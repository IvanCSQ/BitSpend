import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js";

export default class extends Controller {
  static values = {
    categoryList: Array,
    categoryAmount: Object
  };

  static targets = ["chart"];

  connect() {
    Chart.register(...registerables);

    // List of user's categories to be used for chart labels and legends
    const userCategories = this.categoryListValue.map((category) => category.name.toLowerCase())

    // Categories and total expenses amount per category formatting for chart data
    const data = {
      labels: userCategories,
      datasets: [{
        data: Object.values(this.categoryAmountValue),
        hoverOffset: 4,
        borderWidth: 2,
      }]
    };

    // Chart display options
    const options = {
      responsive: true,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              family: '"PixeloidSans-mLxMm", "Helvetica", "sans-serif"',
              size: 12
            },
            boxWidth: 20,
            generateLabels: function(chart) {
              const data = chart.data;
              let legendItems = [];

              // Calculate user's total expenses amount and convert category expenses amount into percentage of total amount
              const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
              const percentage = data.datasets[0].data.map((value) => ((value / total) * 100).toFixed(1) + '%');

              // Modify legend labels to include category name and percentage of total amount
              data.labels.forEach((label, index) => {
                if (percentage[index]) {
                  legendItems.push({
                    text: label + ' - ' + percentage[index],
                    fillStyle: data.datasets[0].backgroundColor[index],
                    hidden: !chart.getDataVisibility(index),
                    index: index
                  });
                }
              });

              return legendItems;
            }
          },
          align: 'start'
        },
      }
    }

    const config = {
      type: 'pie',
      data,
      options
    };

    const chart = new Chart(
      this.chartTarget,
      config
    );
  }
}
