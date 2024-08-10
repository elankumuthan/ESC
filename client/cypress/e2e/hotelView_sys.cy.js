

describe('hotelView use case 2 End-to-End Test', () => {
 
    it('should render hotel details', () => {

  
    cy.visit('http://localhost:3000/hotels?destination_id=RsBU&start_date=2024-08-10&end_date=2024-08-15&guests=%7B%22adults%22%3A2%2C%22children%22%3A0%7D')

    cy.wait(20000)
    // first page ends here goes to hotel list page
    cy.get('.hotel-grid').should('be.visible');
    // Get the first hotel item and click on its image
    cy.get('.hotel-grid .hotel-item').first().within(() => {
      cy.get('.image-container .hotel-image')
        .should('be.visible')
        .click();})

    cy.wait(50000)

    })
})