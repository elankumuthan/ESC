describe('hotelSearch use case 1 End-to-End Test', () => {
 
    it('should render list of hotels', () => {

  
    cy.visit('http://localhost:3000')

    cy.get('.destination-input').clear().type('Singapore, Singapore');
    cy.wait(600)
    // Wait for a bit t ensure the dropdown can appear
    cy.get('.suggestion-list ul li').first().click();
    cy.get('.date-picker-wrapper').eq(0).click(); // Open the start date calendar
    cy.get('.date-picker-wrapper .DayPickerNavigation_button').eq(1).click({ multiple: true, force: true }); // Adjust this to click the next or previous button as needed
    cy.wait(600)
    cy.contains('10').click({ force: true });
    cy.contains('15').click({ force: true }); // Select end date (adjust based on actual calendar date)
    cy.get('.search-button').click();

    cy.wait(7000)
    // first page ends here goes to hotel list page
    cy.get('.hotel-grid').should('be.visible');

    })
})