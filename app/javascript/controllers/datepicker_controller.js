import { Controller } from '@hotwired/stimulus';
import Pikaday from 'pikaday';
// import flatpickr from 'flatpickr';
// import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

// Connects to data-controller='datepicker'
export default class extends Controller {
  static targets = ['form', 'input', 'year'];

  connect() {
    // const dp = new Pikaday({
    //   field: this.element,
    //   format: 'MMMM YYYY',
    //   bound: false,

    //   // Customise the calendar to show months instead of days
    //   onDraw: this.drawMonths.bind(this),
    //   onClick: this.handleMonthClick.bind(this)
    // });
  }

  // drawMonths(date) {
  //   let monthContainer = document.querySelector('.pika-lendar');
  //   let yearSelect = document.querySelector('.pika-select-year');

  //   // Clear existing content
  //   monthContainer.innerHTML = '';

  //   // Add year selection at the top
  //   let yearDiv = document.createElement('div');
  //   yearDiv.className = 'year-select';
  //   yearDiv.appendChild(yearSelect);
  //   monthContainer.appendChild(yearDiv);

  //   // Create month grid
  //   let monthGrid = document.createElement('div');
  //   monthGrid.className = 'month-grid';

  //   let months = [
  //       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  //   ];

  //   // Arrange months in a 3x4 grid
  //   for (let row = 0; row < 3; row++) {
  //     for (let col = 0; col < 4; col++) {
  //       let index = col * 3 + row;
  //       if (index < 12) {
  //         let monthButton = document.createElement('button');
  //         monthButton.className = 'month-button';
  //         monthButton.textContent = months[index];
  //         monthButton.setAttribute('data-month-index', index);
  //         monthButton.setAttribute('data-action', 'click->datepicker#handleMonthClick');
  //         // monthButton.onclick = (e) => {
  //         //   e.preventDefault();
  //         //   console.log(e);

  //         //   let selectedDate = new Date(date.getFullYear(), index, 1);
  //         //   this.setDate(selectedDate);
  //         //   submitForm(selectedDate);
  //         // };

  //         monthGrid.appendChild(monthButton);
  //       }
  //     }
  //   }

  //   monthContainer.appendChild(monthGrid);
  // }

  handleMonthClick(e) {
    e.preventDefault();

    if (e.target.matches('.month-button')) {
      this.inputTarget.setAttribute('value', e.target.getAttribute('data-month') + ' ' + this.yearTarget.getAttribute('data-year'));
      this.formTarget.submit();
    }
  //   if (event.target.matches('.month-button')) {
  //     event.preventDefault();
  //     const monthIndex = parseInt(event.target.getAttribute('data-month-index'));
  //     const year = parseInt(document.querySelector('.pika-select-year').value);
  //     const selectedDate = new Date(year, monthIndex, 1);
  //     this.picker.setDate(selectedDate);
  //     this.submitForm(selectedDate);
  //   }
  }

  decreaseYear() {
    const newYear = parseInt(this.yearTarget.getAttribute('data-year')) - 1;

    this.yearTarget.setAttribute('data-year', newYear);
    this.yearTarget.innerHTML = newYear;
  }

  increaseYear() {
    const newYear = parseInt(this.yearTarget.getAttribute('data-year')) + 1;

    this.yearTarget.setAttribute('data-year', newYear);
    this.yearTarget.innerHTML = newYear;
  }
}
