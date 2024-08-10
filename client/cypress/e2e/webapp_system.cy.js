/// <reference types="cypress" />
describe('End-to-End Test', () => {
 
    it('should carry out the flow of the entire system', () => {

  
    cy.visit('http://localhost:3000')

    cy.get('.destination-input').clear().type('Singapore, Singapore');
    // Wait for a bit t ensure the dropdown can appear
    cy.get('.suggestion-list ul li').first().click();
    cy.get('.date-picker-wrapper').eq(0).click(); // Open the start date calendar
    cy.get('.date-picker-wrapper .DayPickerNavigation_button').eq(1).click({ multiple: true, force: true }); // Adjust this to click the next or previous button as needed
    cy.wait(600)
    cy.contains('10').click({ force: true });
    cy.contains('15').click({ force: true }); // Select end date (adjust based on actual calendar date)
    cy.get('.search-button').click();

    cy.wait(40000)
    // first page ends here goes to hotel list page
    cy.get('.hotel-grid').should('be.visible');
    // Get the first hotel item and click on its image
    cy.get('.hotel-grid .hotel-item').first().within(() => {
      cy.get('.image-container .hotel-image')
        .should('be.visible')
        .click();})
    cy.wait(50000)
    cy.get('.book').click()

      
      // Fill out the form fields
      cy.get('#infirstName').type('valid');
      cy.get('#inlastName').type('input');
      cy.get('#inphoneNo').type('+6584572662');
      cy.get('#inemail').type('yolo@gmail.com');
  
      // Ensure the Stripe iframe is present and fully loaded
      cy.get('.__PrivateStripeElement > iframe').click() // in cy.get() insert stripe iframe id
      cy.wait(2000)
  
      cy.get('iframe').then($iframe => {
        const doc = $iframe.contents()
        let input = doc.find('input')[0]
        cy
          .wrap(input)
          .type('4242424242424242')
        input = doc.find('input')[1]
        cy
          .wrap(input)
          .clear()
          .type('12')
          .type('29')
        input = doc.find('input')[2]
        cy
          .wrap(input)
          .type('123')
          // .type('{enter}')
      })
  
      // Submit the form
      cy.get('[data-testid="payment-button"]').click();
      // Check that the button is disabled and loading spinner is shown
      cy.get('[data-testid="payment-button"]').should('be.disabled');
      cy.contains('Processing...').should('be.visible');
      cy.wait('@postBooking').then((interception) => {
        // Verify the mock response was returned
        cy.url().should('include', '/confirmation');
        cy.contains('Confirmation').should('be.visible');
      });
  
    });
  });