import { Controller } from "@hotwired/stimulus";
import Pikaday from "pikaday";
// import flatpickr from "flatpickr";
// import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";

// Connects to data-controller="datepicker"
export default class extends Controller {
  connect() {
    new Pikaday({ field: this.element });
  }
}
