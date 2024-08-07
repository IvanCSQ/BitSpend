import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js";
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Connects to data-controller="chart"
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
        // // Labels display in pie chart
        // datalabels: {
        //   formatter: (value, context) => {
        //     // Calculate user's total expenses amount and convert category expenses amount into percentage of total amount
        //     const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
        //     const percentage = ((value / total) * 100).toFixed(1) + '%';

        //     return percentage;
        //   },
        //   anchor: 'end',
        //   align: 'start',
        //   font: {
        //     size: 12,
        //     family: '"Press Start 2P", "Helvetica", "sans-serif"'
        //   },
        //   rotation: function(context) {
        //     const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);

        //     // Create an object with index as key and category expenses amount as value
        //     let amountPerCategory = {}

        //     for (let counter = 0; counter < context.chart.data.datasets[0].data.length; counter++) {
        //       amountPerCategory[counter] = context.dataset.data[counter]
        //     }

        //     // Create an object with index: angle of each category pie
        //     let pieAngles = {}

        //     for (let counter = 0; counter < context.chart.data.datasets[0].data.length; counter++) {
        //       pieAngles[counter] = Math.round(amountPerCategory[counter] / total * 360);
        //     }

        //     // Create an object with index: starting angle of each category pie
        //     let pieStartingAngles = {0: 0}

        //     for (let counter = 1; counter < context.chart.data.datasets[0].data.length; counter++) {
        //       pieStartingAngles[counter] = pieAngles[counter - 1] + pieStartingAngles[counter - 1];
        //     }

        //     // Calculate the rotation angle of each category pie
        //     let rotationAngles = []

        //     for (let counter = 0; counter < context.chart.data.datasets[0].data.length; counter++) {
        //       // const initialRotation = pieStartingAngles[counter] + (pieAngles[counter] / 2)
        //       // initialRotation > 180 ? rotationAngles.push(pieStartingAngles[counter] + (pieAngles[counter] / 2) + 90) : rotationAngles.push(pieStartingAngles[counter] + (pieAngles[counter] / 2) - 90)
        //       rotationAngles.push(pieStartingAngles[counter] + (pieAngles[counter] / 2) - 90)
        //     }

        //     return rotationAngles
        //   }
        // }
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
