describe('Booking Form End-to-End Test', () => {
 
    it('should render loading spinner, disable button when both payment is SUCCESSFUL & form is VALID', () => {
      cy.intercept('POST', 'http://localhost:3004/booking', (req) => {
        req.reply({
          statusCode: 200,
          body: { success: true }
        });
      }).as('postBooking');
  
      cy.visit('http://localhost:3000/booking')
      
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
  