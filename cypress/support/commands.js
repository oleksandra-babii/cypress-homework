Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(username ?? cy.env('username'));
  cy.get('[data-test="password"]').type(password ?? cy.env('password'));
  cy.get('[data-test="login-button"]').click();
});

const QAUTO_URL = 'https://qauto.forstudy.space/';
const QAUTO_AUTH = { username: 'guest', password: 'welcome2qauto' };

Cypress.Commands.add('visitQautoHome', () => {
  cy.visit(QAUTO_URL, { auth: QAUTO_AUTH });
});
