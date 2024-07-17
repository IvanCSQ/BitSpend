import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle"
export default class extends Controller {
  static targets = ["clickableElement"]

  connect() {
  }

  show(event) {
    const toggleElement = event.currentTarget.nextElementSibling;
    toggleElement.classList.toggle("d-none");
  }
}
