import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js";

// Connects to data-controller="chart"
export default class extends Controller {
  static values = {
    categoryList: Array,
    categoryAmount: Object
  };

  connect() {
    Chart.register(...registerables)

    const userCategories = this.categoryListValue.map((category) => category.name)

    const data = {
      labels: userCategories,
      legend: {
        display: false
      },
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

    const config = {
      type: 'pie',
      data: data,
    };

    const chart = new Chart(
      this.element, config
    );
  }
}
