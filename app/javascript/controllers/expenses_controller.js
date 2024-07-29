import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    // Access the JSON data from the data attribute
    const expensesData = this.element.dataset.expenses;
    // Parse the JSON data
    const expenses = JSON.parse(expensesData);
    // console.log(expenses); // Use the expenses data as needed

    const categorySelect = this.element.querySelector("#category");
    const tagSelect = this.element.querySelector("#tag");

    // Category change event
    categorySelect.addEventListener("change", (event) => {
      const categoryId = event.currentTarget.value;
      // Reset tag selection
      tagSelect.value = "";

      if (categoryId === "") {
        this.hideExpenses();
        return;
      }

      // Filter expenses by selected category
      const filteredExpenses = expenses.filter(
        (expense) => expense.category_id == categoryId
      );

      // Display filtered expenses and update total
      this.displayExpenses(filteredExpenses);
      this.updateTotal(filteredExpenses);
    });

    // Tag change event
    tagSelect.addEventListener("change", (event) => {
      const tagName = event.currentTarget.value;
      const selectedCategoryId = categorySelect.value;

      // if (tagName === "") {
      //   this.hideExpenses();
      //   return;
      // }

      if (tagName === "") {
        if (selectedCategoryId) {
          // If the category has a value, display the category details
          const filteredExpenses = expenses.filter(
            (expense) => expense.category_id == selectedCategoryId
          );
          this.displayExpenses(filteredExpenses);
          this.updateTotal(filteredExpenses);
        } else {
          this.hideExpenses();
        }
        return;
      }

      let filteredExpenses;

      if (selectedCategoryId) {
        // Filter expenses by selected category and tag
        filteredExpenses = expenses.filter(
          (expense) =>
            expense.category_id == selectedCategoryId &&
            expense.tag_list.includes(tagName)
        );

        // If no expenses match the selected tag within the selected category, reset the category selection
        if (filteredExpenses.length === 0) {
          categorySelect.value = "";
          filteredExpenses = expenses.filter((expense) =>
            expense.tag_list.includes(tagName)
          );
        }
      } else {
        // Filter expenses by selected tag only
        filteredExpenses = expenses.filter((expense) =>
          expense.tag_list.includes(tagName)
        );
      }

      // Display filtered expenses and update total
      this.displayExpenses(filteredExpenses);
      this.updateTotal(filteredExpenses);
    });
  }

  displayExpenses(filteredExpenses) {
    const displayExpenses = this.element.querySelector("#display-expenses");
    displayExpenses.innerHTML = "";
    filteredExpenses.forEach((expense) => {
      const expenseElement = document.createElement("div");
      expenseElement.classList.add("expense-item"); // Add a single class
      expenseElement.innerHTML = `
        <p>${expense.name}</p>
        <p><span>$</span>${expense.amount}</p>
      `;
      displayExpenses.appendChild(expenseElement);
    });
    // Remove the 'hidden' class to display the expenses
    displayExpenses.classList.remove("hidden");
  }

  hideExpenses() {
    const displayExpenses = this.element.querySelector("#display-expenses");
    displayExpenses.classList.add("hidden");
    displayExpenses.innerHTML = ""; // Clear the displayed expenses
    this.updateTotal([]); // Reset the total
  }

  updateTotal(filteredExpenses) {
    const totalElement = this.element.querySelector("#count-total");
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    totalElement.textContent = `Total: ${total}`;
  }
}
