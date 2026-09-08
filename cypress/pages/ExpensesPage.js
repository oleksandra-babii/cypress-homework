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
}

export default new ExpensesPage();
