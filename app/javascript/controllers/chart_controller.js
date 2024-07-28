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

    // List of user's categories to be used for chart labels and legends
    const userCategories = this.categoryListValue.map((category) => category.name.toLowerCase())

    // Categories and total expenses amount per category formatting for chart data
    const data = {
      labels: userCategories,
      datasets: [{
        data: Object.values(this.categoryAmountValue),
        hoverOffset: 4
      }]
    };

    // Chart display options
    const options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              family: '"Press Start 2P", "Helvetica", "sans-serif"',
              size: 12
            },
            boxWidth: 20
          },
          align: 'start'
        },
        // Labels display in pie chart
        datalabels: {
          formatter: (value, context) => {
            // Calculate user's total expenses amount and convert category expenses amount into percentage of total amount
            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';

            return percentage;
          },
          anchor: 'end',
          align: 'start',
          font: {
            size: 12,
            family: '"Press Start 2P", "Helvetica", "sans-serif"'
          },
          rotation: function(context) {
            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);

            // Create an object with index as key and category expenses amount as value
            let amountPerCategory = {}

            for (let counter = 0; counter < context.chart.data.datasets[0].data.length; counter++) {
              amountPerCategory[counter] = context.dataset.data[counter]
            }

            // Create an object with index: angle of each category pie
            let pieAngles = {}

            for (let counter = 0; counter < context.chart.data.datasets[0].data.length; counter++) {
              pieAngles[counter] = Math.round(amountPerCategory[counter] / total * 360);
            }

            // Create an object with index: starting angle of each category pie
            let pieStartingAngles = {0: 0}

            for (let counter = 1; counter < context.chart.data.datasets[0].data.length; counter++) {
              pieStartingAngles[counter] = pieAngles[counter - 1] + pieStartingAngles[counter - 1];
            }

            // Calculate the rotation angle of each category pie
            let rotationAngles = []

            for (let counter = 0; counter < context.chart.data.datasets[0].data.length; counter++) {
              // const initialRotation = pieStartingAngles[counter] + (pieAngles[counter] / 2)
              // initialRotation > 180 ? rotationAngles.push(pieStartingAngles[counter] + (pieAngles[counter] / 2) + 90) : rotationAngles.push(pieStartingAngles[counter] + (pieAngles[counter] / 2) - 90)
              rotationAngles.push(pieStartingAngles[counter] + (pieAngles[counter] / 2) - 90)
            }

            return rotationAngles
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
