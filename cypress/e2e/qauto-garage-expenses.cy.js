import GaragePage from '../pages/GaragePage';
import ExpensesPage from '../pages/ExpensesPage';

const CAR_MILEAGE = 10000;

describe('Qauto - Garage & Fuel expenses', () => {
  beforeEach(() => {
    cy.task('getEnvValue', 'userEmail').then((userEmail) => {
      cy.task('getEnvValue', 'userPassword').then((userPassword) => {
        cy.login(userEmail, userPassword);
      });
    });
    cy.url().should('include', '/panel/garage');
  });

  it('adds a new car to the garage', () => {
    GaragePage.addCar({ mileage: CAR_MILEAGE });

    cy.contains('Car added').should('be.visible');
    GaragePage.carCard().should('have.length.greaterThan', 0);
  });

  it('adds a fuel expense to the created car', () => {
    GaragePage.addCar({ mileage: CAR_MILEAGE });
    cy.contains('Car added').should('be.visible');

    GaragePage.openAddFuelExpenseModalForLastCar();
    ExpensesPage.addFuelExpense({
      // The app rejects a second expense on the same day with a mileage that
      // was already reported, so this must be unique per run.
      mileage: CAR_MILEAGE + (Date.now() % 100000),
      liters: 40,
      totalCost: 60,
    });

    cy.contains('Fuel expense added').should('be.visible');
    cy.url().should('include', '/panel/expenses');
  });
});
