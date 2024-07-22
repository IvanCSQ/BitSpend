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

    const userCategories = this.categoryListValue.map((category) => category.name)

    const data = {
      labels: userCategories,
      datasets: [{
        // label: 'My First Dataset',
        data: Object.values(this.categoryAmountValue),
        // backgroundColor: [
        //   'rgb(255, 99, 132)',
        //   'rgb(54, 162, 235)',
        //   'rgb(255, 205, 86)'
        // ],
        hoverOffset: 4
      }]
    };

    const options = {
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          formatter: (value, context) => {
            // Calculate percentage from value and total
            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(2) + '%';

            // Return label and percentage
            return `${percentage}\n${context.chart.data.labels[context.dataIndex]}`;
          },
          anchor: 'start',
          align: 'end',
          offset: 80,
          display: 'hidden',
          rotation: 0
        }
      },
      layout: {
        padding: {
          left: 70,
          right: 70,
          top: 70,
          bottom: 70
        }
      }
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
