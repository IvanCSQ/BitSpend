import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js";

// Connects to data-controller="chart"
export default class extends Controller {
  connect() {
    Chart.register(...registerables)

    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'pie',
      data: data,
    };

    const chart = new Chart(
      this.element, config
    );
  }
}
