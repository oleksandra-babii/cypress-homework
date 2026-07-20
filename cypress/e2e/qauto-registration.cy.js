const uniqueEmail = () => `qauto.user.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;

const VALID_PASSWORD = 'Password1';

const openRegistrationForm = () => {
  cy.visitQautoHome();
  cy.contains('button', 'Sign In').click();
  cy.contains('button', 'Registration').click();
};

const fillRegistrationForm = ({ name, lastName, email, password, repeatPassword } = {}) => {
  if (name !== undefined) cy.get('#signupName').clear().type(name).blur();
  if (lastName !== undefined) cy.get('#signupLastName').clear().type(lastName).blur();
  if (email !== undefined) cy.get('#signupEmail').clear().type(email).blur();
  if (password !== undefined) cy.get('#signupPassword').clear().type(password, { sensitive: true }).blur();
  if (repeatPassword !== undefined) cy.get('#signupRepeatPassword').clear().type(repeatPassword, { sensitive: true }).blur();
};

const registerButton = () => cy.get('.modal-footer button.btn-primary');

const fieldError = (selector) => cy.get(selector).should('have.class', 'is-invalid').siblings('.invalid-feedback');

describe('Qauto - Registration', () => {
  beforeEach(() => {
    openRegistrationForm();
  });

  describe('Name field', () => {
    it('shows an error when left empty', () => {
      cy.get('#signupName').focus().blur();
      fieldError('#signupName').should('contain.text', 'Name required');
    });

    it('shows an error for invalid characters (digits)', () => {
      fillRegistrationForm({ name: '12345' });
      fieldError('#signupName').should('contain.text', 'Name is invalid');
    });

    it('shows an error when shorter than 2 characters', () => {
      fillRegistrationForm({ name: 'A' });
      fieldError('#signupName').should('contain.text', 'Name has to be from 2 to 20 characters long');
    });

    it('shows an error when longer than 20 characters', () => {
      fillRegistrationForm({ name: 'A'.repeat(21) });
      fieldError('#signupName').should('contain.text', 'Name has to be from 2 to 20 characters long');
    });

    it('accepts a valid English name without errors', () => {
      fillRegistrationForm({ name: 'John' });
      cy.get('#signupName').should('not.have.class', 'is-invalid');
    });
  });

  describe('Last name field', () => {
    it('shows an error when left empty', () => {
      cy.get('#signupLastName').focus().blur();
      fieldError('#signupLastName').should('contain.text', 'Last name required');
    });

    it('shows an error for invalid characters (digits)', () => {
      fillRegistrationForm({ lastName: '12345' });
      fieldError('#signupLastName').should('contain.text', 'Last name is invalid');
    });

    it('shows an error when shorter than 2 characters', () => {
      fillRegistrationForm({ lastName: 'B' });
      fieldError('#signupLastName').should('contain.text', 'Last name has to be from 2 to 20 characters long');
    });

    it('shows an error when longer than 20 characters', () => {
      fillRegistrationForm({ lastName: 'B'.repeat(21) });
      fieldError('#signupLastName').should('contain.text', 'Last name has to be from 2 to 20 characters long');
    });

    it('accepts a valid English last name without errors', () => {
      fillRegistrationForm({ lastName: 'Doe' });
      cy.get('#signupLastName').should('not.have.class', 'is-invalid');
    });
  });

  describe('Email field', () => {
    it('shows an error when left empty', () => {
      cy.get('#signupEmail').focus().blur();
      fieldError('#signupEmail').should('contain.text', 'Email required');
    });

    it('shows an error for an incorrectly formatted email', () => {
      fillRegistrationForm({ email: 'not-an-email' });
      fieldError('#signupEmail').should('contain.text', 'Email is incorrect');
    });

    it('accepts a valid, unique email without errors', () => {
      fillRegistrationForm({ email: uniqueEmail() });
      cy.get('#signupEmail').should('not.have.class', 'is-invalid');
    });
  });

  describe('Password field', () => {
    it('shows an error when left empty', () => {
      cy.get('#signupPassword').focus().blur();
      fieldError('#signupPassword').should(
        'contain.text',
        'Password required'
      );
    });

    it('shows an error when shorter than 8 characters', () => {
      fillRegistrationForm({ password: 'Pass1' });
      fieldError('#signupPassword').should(
        'contain.text',
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
      );
    });

    it('shows an error when longer than 15 characters', () => {
      fillRegistrationForm({ password: 'Password123456789' });
      fieldError('#signupPassword').should(
        'contain.text',
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
      );
    });

    it('shows an error when missing a capital letter', () => {
      fillRegistrationForm({ password: 'password1' });
      fieldError('#signupPassword').should(
        'contain.text',
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
      );
    });

    it('shows an error when missing a digit', () => {
      fillRegistrationForm({ password: 'PasswordOnly' });
      fieldError('#signupPassword').should(
        'contain.text',
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
      );
    });

    it('accepts a valid password without errors', () => {
      fillRegistrationForm({ password: VALID_PASSWORD });
      cy.get('#signupPassword').should('not.have.class', 'is-invalid');
    });
  });

  describe('Re-enter password field', () => {
    it('shows an error when left empty', () => {
      cy.get('#signupRepeatPassword').focus().blur();
      fieldError('#signupRepeatPassword').should('contain.text', 'Re-enter password required');
    });

    it("shows an error when it does not match the password", () => {
      fillRegistrationForm({ password: VALID_PASSWORD, repeatPassword: 'Password2' });
      fieldError('#signupRepeatPassword').should('contain.text', 'Passwords do not match');
    });

    it('shows no error when it matches the password', () => {
      fillRegistrationForm({ password: VALID_PASSWORD, repeatPassword: VALID_PASSWORD });
      cy.get('#signupRepeatPassword').should('not.have.class', 'is-invalid');
    });
  });

  describe('Register button', () => {
    it('is disabled while the form is incomplete', () => {
      fillRegistrationForm({ name: 'John' });
      registerButton().should('be.disabled');
    });

    it('is disabled while any field is invalid', () => {
      fillRegistrationForm({
        name: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
        password: VALID_PASSWORD,
        repeatPassword: VALID_PASSWORD,
      });
      registerButton().should('be.disabled');
    });

    it('is enabled once all fields are valid', () => {
      fillRegistrationForm({
        name: 'John',
        lastName: 'Doe',
        email: uniqueEmail(),
        password: VALID_PASSWORD,
        repeatPassword: VALID_PASSWORD,
      });
      registerButton().should('not.be.disabled');
    });
  });

  describe('Successful registration', () => {
    it('creates a new account and logs the user into the app', () => {
      const email = uniqueEmail();

      fillRegistrationForm({
        name: 'John',
        lastName: 'Doe',
        email,
        password: VALID_PASSWORD,
        repeatPassword: VALID_PASSWORD,
      });
      registerButton().should('not.be.disabled').click();

      cy.url().should('include', '/panel/garage');
      cy.contains('button', 'My profile').should('be.visible');

      cy.get('#userNavDropdown').click();
      cy.contains('.dropdown-item', 'Logout').click();
      cy.contains('button', 'Sign In').should('be.visible');

      cy.login(email, VALID_PASSWORD);

      cy.url().should('include', '/panel/garage');
      cy.contains('button', 'My profile').should('be.visible');
    });
  });
});
