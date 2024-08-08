import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['form', 'input', 'year', 'calendar'];

  connect() {
  }

  // When month is clicked, submit form with selected month and year
  handleMonthClick(e) {
    e.preventDefault();

    if (e.target.matches('.month-button')) {
      this.inputTarget.setAttribute('value', e.target.getAttribute('data-month') + ' ' + this.yearTarget.getAttribute('data-year'));
      this.formTarget.submit();
    }
  }

  // Toggle datepicker visibility
  toggle() {
    this.calendarTarget.hidden ? this.calendarTarget.hidden = false : this.calendarTarget.hidden = true;
  }

  // Reduce year by 1 when left arrow is clicked
  decreaseYear() {
    const newYear = parseInt(this.yearTarget.getAttribute('data-year')) - 1;

    this.yearTarget.setAttribute('data-year', newYear);
    this.yearTarget.innerHTML = newYear;
  }

  // Increase year by 1 when right arrow is clicked
  increaseYear() {
    const newYear = parseInt(this.yearTarget.getAttribute('data-year')) + 1;

    this.yearTarget.setAttribute('data-year', newYear);
    this.yearTarget.innerHTML = newYear;
  }
}
