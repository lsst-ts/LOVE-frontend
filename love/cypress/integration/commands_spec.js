it('Sending commands causes event messages to be received', function() {
  cy.visit('http://localhost');
  cy.url().should('include', '/login');
  cy.get('#id_username').type('test');
  cy.get('#id_password').type('test');
  cy.get('button')
    .contains('Login')
    .click();
  cy.url().should('not.include', 'login');
  cy.root().should('contain', 'Component index');

  cy.visit('http://localhost/test')

  // subscribe to atdome-sim
  cy.get('#id_category').clear().type('event');
  cy.get('#id_csc').clear().type('ATDome');
  cy.get('#id_stream').clear().type('all');
  cy.get('button').contains('Subscribe').click();

  cy.get('#id_commands_csc').type('csc')
  cy.get('#id_commands').type('command')
  cy.get('#id_parameters').type('{{}"param1":1}')

});
