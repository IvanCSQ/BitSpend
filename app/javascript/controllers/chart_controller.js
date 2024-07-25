import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Connects to data-controller="chart"
export default class extends Controller {
  static values = {
    categoryList: Array,
    categoryAmount: Object
  };

  connect() {
    Chart.register(...registerables, ChartDataLabels);

    const userCategories = this.categoryListValue.map((category) => category.name.toLowerCase())

    const data = {
      labels: userCategories,
      datasets: [{
        data: Object.values(this.categoryAmountValue),
        hoverOffset: 4
      }]
    };

    const options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              family: '"Press Start 2P", "Helvetica", "sans-serif"',
              size: 12,
            },
            boxWidth: 20
          },
          align: 'start'
        },
        datalabels: {
          formatter: (value, context) => {
            // Calculate percentage from value and total
            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';

            // Return label and percentage
            return percentage;
          },
          anchor: 'end',
          align: 'end',
          offset: 0,
          display: 'hidden',
          rotation: 0,
          font: {
            size: 12,
            family: '"Press Start 2P", "Helvetica", "sans-serif"'
          }
        }
      },
      layout: {
        padding: {
          left: 80,
          right: 80,
          top: 0,
          bottom: 0
        }
      },
    }

    const config = {
      type: 'pie',
      data,
      options
    };

    const chart = new Chart(
      this.element,
      config
    );
  }
}
