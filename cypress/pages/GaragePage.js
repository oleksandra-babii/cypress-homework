class GaragePage {
  visit() {
    cy.visit('/panel/garage');
    return this;
  }

  openAddCarModal() {
    cy.contains('.panel-page_heading button', 'Add car').click();
    return this;
  }

  addCarSubmitButton() {
    return cy.get('.modal-footer button.btn-primary');
  }

  fillAddCarForm({ mileage } = {}) {
    cy.get('#addCarBrand option').should('have.length.greaterThan', 1);
    cy.get('#addCarBrand').select(1);

    cy.get('#addCarModel').should('not.be.disabled');
    cy.get('#addCarModel option').should('have.length.greaterThan', 1);
    cy.get('#addCarModel').select(1);

    if (mileage !== undefined) {
      cy.get('#addCarMileage').clear().type(String(mileage));
    }

    return this;
  }

  addCar({ mileage } = {}) {
    this.openAddCarModal();
    this.fillAddCarForm({ mileage });
    this.addCarSubmitButton().should('not.be.disabled').click();
    return this;
  }

  carCard() {
    return cy.get('.car');
  }

  openAddFuelExpenseModalForLastCar() {
    this.carCard().last().contains('button', 'Add fuel expense').click();
    return this;
  }
}

export default new GaragePage();
