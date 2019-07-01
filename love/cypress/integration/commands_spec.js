it(`GIVEN the user is on the test window AND subscribed to the azimuthCommandedState event
WHEN it sends a command to update the ATDome azimuth on the simulator
THEN it should receive the updated data inside the message of the azimuthCommandedState event`, function() {

  //---Arrange---
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
  // subscribe to the ATDome sim  
  cy.get('#id_category').clear().type('event');
  cy.get('#id_csc').clear().type('ATDome');
  cy.get('#id_stream').clear().type('azimuthCommandedState');
  cy.get('button').contains('Subscribe').click();


  //---Act---
  // change the azimuth
  cy.get('#id_commands_csc').clear().type('ATDome')
  cy.get('#id_commands').clear().type('moveAzimuth')
  cy.get('#id_parameters').clear().type('{{}"azimuth": 123.456}')
  cy.get('button').contains('Launch').click();

  //---Assert---
  cy.get('body').contains((`"value": 123.456`));

});
