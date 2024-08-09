import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    // Access the JSON data from the data attribute
    const expensesData = this.element.dataset.expenses;
    // Parse the JSON data
    const expenses = JSON.parse(expensesData);

    const categorySelect = this.element.querySelector("#category");
    const tagSelect = this.element.querySelector("#tag");

    // Create a mapping of category IDs to tags
    const categoryTagMap = {};
    expenses.forEach((expense) => {
      if (!categoryTagMap[expense.category_id]) {
        categoryTagMap[expense.category_id] = new Set();
      }
      expense.tag_list.forEach((tag) =>
        categoryTagMap[expense.category_id].add(tag)
      );
    });
    //categoryTagMap look like this:
    //{21: Set(9), 22: Set(5)}

    // Add a special entry for "All Categories" to include all tags
    categoryTagMap[""] = new Set(
      expenses.flatMap((expense) => expense.tag_list)
    );

    categorySelect.addEventListener("change", (event) => {
      const categoryId = event.currentTarget.value;
      // Reset tag selection
      tagSelect.value = "";

      // Update tag options based on selected category
      this.updateTagOptions(categoryId, categoryTagMap);

      if (categoryId === "") {
        this.hideExpenses();
        return;
      }

      // Filter expenses by selected category
      const filteredExpenses = expenses.filter(
        (expense) => expense.category_id == categoryId
      );

      if (filteredExpenses.length === 0) {
        this.displayMessage("Current category is empty.");
      } else {
        this.displayExpenses(filteredExpenses);
        this.updateTotal(filteredExpenses);
      }
    });

    // Tag
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

      this.displayExpenses(filteredExpenses);
      this.updateTotal(filteredExpenses);
    });
  }

  updateTagOptions(categoryId, categoryTagMap) {
    const tagSelect = this.element.querySelector("#tag");
    tagSelect.innerHTML = '<option value="">Tag</option>';

    if (categoryTagMap[categoryId]) {
      const sortedTags = Array.from(categoryTagMap[categoryId]).sort();
      sortedTags.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
      });
    }
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

    displayExpenses.classList.remove("hidden");
  }

  hideExpenses() {
    const displayExpenses = this.element.querySelector("#display-expenses");
    displayExpenses.classList.add("hidden");
    displayExpenses.innerHTML = ""; // Clear the displayed expenses
    this.updateTotal([]); // Reset the total
  }

  displayMessage(message) {
    const displayExpenses = this.element.querySelector("#display-expenses");
    displayExpenses.innerHTML = `<p>${message}</p>`;
    displayExpenses.classList.remove("hidden");
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
