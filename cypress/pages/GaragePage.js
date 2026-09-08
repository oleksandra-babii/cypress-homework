class GaragePage {
  visit() {
    cy.visitQauto('/panel/garage');
    return this;
  }

  openAddCarModal() {
    cy.contains('.panel-page_heading button', 'Add car').click();
    return this;
  }

  addCarSubmitButton() {
    return cy.get('.modal-footer button.btn-primary');
  }

  fillAddCarForm({ mileage, brandIndex = 1, modelIndex = 1 } = {}) {
    cy.get('#addCarBrand option').should('have.length.greaterThan', brandIndex);
    cy.get('#addCarBrand').select(brandIndex);

    cy.get('#addCarModel').should('not.be.disabled');
    cy.get('#addCarModel option').should('have.length.greaterThan', modelIndex);
    cy.get('#addCarModel').select(modelIndex);

    if (mileage !== undefined) {
      cy.get('#addCarMileage').clear().type(String(mileage));
    }

    return this;
  }

  addCar({ mileage, brandIndex, modelIndex } = {}) {
    this.openAddCarModal();
    this.fillAddCarForm({ mileage, brandIndex, modelIndex });
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
