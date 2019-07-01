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
  cy.get('#id_stream').clear().type('azimuthCommandedState');
  cy.get('button').contains('Subscribe').click();


  // change commanded state
  cy.get('#id_commands_csc').clear().type('ATDome')
  cy.get('#id_commands').clear().type('moveAzimuth')
  cy.get('#id_parameters').clear().type('{{}"azimuth": 123.456}')

  cy.get('button').contains('Launch').click();

  cy.wait(2000);
  cy.get('body').contains((`"value": 123.456`));

});
