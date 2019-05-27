describe('Given the user just submitted its credentials', function() {
  it('When accepted it should display the Component Index screen', function() {
    cy.visit('http://localhost');
    cy.url().should('include', '/login');
    cy.get('#id_username').type('test');
    cy.get('#id_password').type('test');
    cy.get('button')
      .contains('Login')
      .click();
    cy.url().should('not.include', 'login');
    cy.root().should('contain', 'Component index');
  });

  it('When rejected it should display a warning message', async function() {
    cy.visit('http://localhost');
    cy.url().should('include', '/login');
    cy.get('#id_username').type('asdf');
    cy.get('#id_password').type('asdf');
    cy.get('button')
      .contains('Login')
      .click();
    cy.root().should('contain', "Your username and password didn't match. Please try again.");
  });
});

it('Logout works', function() {
  cy.visit('http://localhost');
  cy.get('#id_username').type('test');
  cy.get('#id_password').type('test');
  cy.get('button')
    .contains('Login')
    .click();

  cy.url().should('not.include', 'login');
  cy.get('button')
    .contains('Logout')
    .click();
  cy.visit('http://localhost/auxiliary-telescope');
  cy.url().should('include', '/login');
});

it('If the token expired before logging in it should display a warning message', function() {
  localStorage.setItem('LOVE-TOKEN', 'asdf');
  cy.visit('http://localhost/auxiliary-telescope');
  cy.root().should('contain', 'Your session has expired, you have been logged out.');
});
