import GaragePage from '../pages/GaragePage';
import ExpensesPage from '../pages/ExpensesPage';

const CAR_MILEAGE = 10000;

const formatDisplayDate = (isoDate) => {
  const date = new Date(isoDate);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}`;
};

describe('Qauto - Cars & Expenses API', () => {
  let carId;
  let carLabel;
  let expense;

  beforeEach(() => {
    cy.task('getEnvValue', 'userEmail').then((userEmail) => {
      cy.task('getEnvValue', 'userPassword').then((userPassword) => {
        cy.login(userEmail, userPassword);
      });
    });
    cy.url().should('include', '/panel/garage');
  });

  it('creates a car via UI, intercepts the request, and confirms it through GET /cars', () => {
    cy.intercept('POST', '**/api/cars').as('createCarRequest');

    // Pick a brand/model this account's test data hasn't used elsewhere, so
    // the car-select-dropdown label we look for later is unambiguous.
    GaragePage.addCar({ mileage: CAR_MILEAGE, brandIndex: 3, modelIndex: 1 });

    cy.wait('@createCarRequest').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.status).to.eq('ok');
      expect(response.body.data.id).to.be.a('number');
      expect(response.body.data.mileage).to.eq(CAR_MILEAGE);

      carId = response.body.data.id;
    });

    cy.contains('Car added').should('be.visible');

    cy.request('GET', '/api/cars').then((getCarsResponse) => {
      expect(getCarsResponse.status).to.eq(200);

      const createdCar = getCarsResponse.body.data.find((car) => car.id === carId);
      expect(createdCar, `car ${carId} should be present in GET /api/cars`).to.exist;
      expect(createdCar.mileage).to.eq(CAR_MILEAGE);
      expect(createdCar.initialMileage).to.eq(CAR_MILEAGE);

      carLabel = `${createdCar.brand} ${createdCar.model}`;
    });
  });

  it('creates an expense via API for the created car and validates the response', () => {
    expect(carId, 'carId captured from the car-creation test').to.be.a('number');

    expense = {
      carId,
      reportedAt: new Date().toISOString().slice(0, 10),
      mileage: CAR_MILEAGE + (Date.now() % 100000),
      liters: 35.5,
      totalCost: 55.25,
      forceMileage: true,
    };

    cy.createExpense(expense).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('ok');
      expect(response.body.data).to.deep.include({
        carId: expense.carId,
        reportedAt: expense.reportedAt,
        mileage: expense.mileage,
        liters: expense.liters,
        totalCost: expense.totalCost,
      });
    });
  });

  it('shows the API-created expense for the correct car in the UI', () => {
    expect(carLabel, 'car label').to.be.a('string');
    expect(expense, 'expense created via the API test').to.exist;

    ExpensesPage.openFromNav();
    ExpensesPage.selectCar(carLabel);

    ExpensesPage.rowByMileage(expense.mileage)
      .should('be.visible')
      .and('contain.text', formatDisplayDate(expense.reportedAt))
      .and('contain.text', `${expense.liters}L`)
      .and('contain.text', expense.totalCost.toFixed(2));
  });
});
