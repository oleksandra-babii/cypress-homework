const GATE_AUTH = { username: 'guest', password: 'welcome2qauto' };

Cypress.Commands.add('visitQauto', (path = '/') => {
  cy.visit(path, { auth: GATE_AUTH });
});

Cypress.Commands.add('visitQautoHome', () => {
  cy.visitQauto('/');
});

Cypress.Commands.add('login', (email, password) => {
  cy.visitQautoHome();
  cy.contains('button', 'Sign In').click();
  cy.get('#signinEmail').type(email);
  cy.get('#signinPassword').type(password, { sensitive: true });
  cy.contains('.modal-footer button', 'Login').click();
});

Cypress.Commands.add('createExpense', (expense) => {
  return cy.request({
    method: 'POST',
    url: '/api/expenses',
    body: expense,
  });
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
