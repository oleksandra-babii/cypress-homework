class ExpensesPage {
  submitButton() {
    return cy.get('.modal-footer button.btn-primary');
  }

  setReportDateToday() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    cy.get('#addExpenseDate').clear().type(`${dd}.${mm}.${now.getFullYear()}`).blur();
    return this;
  }

  fillFuelExpenseForm({ mileage, liters, totalCost } = {}) {
    this.setReportDateToday();
    if (mileage !== undefined) cy.get('#addExpenseMileage').clear().type(String(mileage));
    if (liters !== undefined) cy.get('#addExpenseLiters').clear().type(String(liters));
    if (totalCost !== undefined) cy.get('#addExpenseTotalCost').clear().type(String(totalCost));
    return this;
  }

  addFuelExpense({ mileage, liters, totalCost } = {}) {
    this.fillFuelExpenseForm({ mileage, liters, totalCost });
    this.submitButton().should('not.be.disabled').click();
    return this;
  }

  openFromNav() {
    cy.contains('a', 'Fuel expenses').click();
    return this;
  }

  selectCar(label) {
    cy.get('#carSelectDropdown').click();
    cy.contains('.car-select-dropdown_item', label).then(($item) => {
      if ($item.hasClass('disabled')) {
        // Already the active car in the dropdown - just close it.
        cy.get('#carSelectDropdown').click();
      } else {
        cy.wrap($item).click();
      }
    });
    return this;
  }

  rowByMileage(mileage) {
    return cy.contains('.expenses_table tbody tr', String(mileage));
  }
}

export default new ExpensesPage();
