describe('Login Test', function() {
  it('Login works', function() {
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
});
