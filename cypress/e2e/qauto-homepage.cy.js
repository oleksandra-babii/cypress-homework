describe('Qauto homepage - header and footer elements', () => {
  beforeEach(() => {
    cy.visitQautoHome();
  });

  describe('Header', () => {
    it('displays the logo link pointing to the homepage', () => {
      cy.get('header').within(() => {
        cy.get('a.header_logo').should('be.visible').and('have.attr', 'href', '/');
      });
    });

    const navLinks = ['Home', 'About', 'Contacts'];

    navLinks.forEach((label) => {
      it(`displays the "${label}" navigation button`, () => {
        cy.get('header .header_nav').within(() => {
          cy.contains('a, button', label).should('be.visible').and('not.be.disabled');
        });
      });
    });

    const authButtons = ['Guest log in', 'Sign In'];

    authButtons.forEach((label) => {
      it(`displays the "${label}" button`, () => {
        cy.get('header .header_right').within(() => {
          cy.contains('button', label).should('be.visible').and('not.be.disabled');
        });
      });
    });

    it('does not render any unexpected extra buttons or links', () => {
      cy.get('header').within(() => {
        cy.get('button').should('have.length', 4);
        cy.get('a').should('have.length', 2);
      });
    });
  });

  describe('Footer', () => {
    it('displays the footer logo link pointing to the homepage', () => {
      cy.get('footer').within(() => {
        cy.get('a.footer_logo').should('be.visible').and('have.attr', 'href', '/');
      });
    });

    it('does not render any unexpected extra links or buttons', () => {
      cy.get('footer').within(() => {
        cy.get('a, button').should('have.length', 1);
      });
    });
  });
});
