Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(username ?? Cypress.env('username'));
  cy.get('[data-test="password"]').type(password ?? Cypress.env('password'));
  cy.get('[data-test="login-button"]').click();
});
