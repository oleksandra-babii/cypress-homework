describe('SauceDemo - login', () => {
  it('should login with valid credentials', () => {
    cy.login();
    cy.url().should('include', '/inventory.html');
  });
});
