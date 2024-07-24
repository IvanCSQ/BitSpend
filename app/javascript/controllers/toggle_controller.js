import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle"
export default class extends Controller {
  static targets = ["clickableElement"]

  connect() {
  }

  show(event) {
    console.log(event.currentTarget.nextElementSibling);

    const expenseList = event.currentTarget.nextElementSibling;

    if (expenseList.hidden) {
      expenseList.hidden = false;
    } else {
      expenseList.hidden = true;
    }
  }
}
