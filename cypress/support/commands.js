const QAUTO_URL = 'https://qauto.forstudy.space/';
const QAUTO_AUTH = { username: 'guest', password: 'welcome2qauto' };

Cypress.Commands.add('visitQautoHome', () => {
  cy.visit(QAUTO_URL, { auth: QAUTO_AUTH });
});

Cypress.Commands.add('login', (email, password) => {
  cy.visitQautoHome();
  cy.contains('button', 'Sign In').click();
  cy.get('#signinEmail').type(email);
  cy.get('#signinPassword').type(password, { sensitive: true });
  cy.contains('.modal-footer button', 'Login').click();
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false;
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    });
  }

  return originalFn(element, text, options);
});
