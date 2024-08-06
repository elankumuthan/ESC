/// <reference types="cypress" />

describe('Fuzzing SearchBox', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    const fuzzInputs = [
        'New York',
        '<script>alert("XSS")</script>',
        'DROP TABLE users;',
        '1 OR 1=1',
        '"; --',
        'New York" OR "x"="x',
        'admin\'--',
        'a\' OR 1=1--',
        'SELECT * FROM users WHERE name = \'a\' OR 1=1--',
        '"; EXEC xp_cmdshell(\'dir\')--'
    ];

    fuzzInputs.forEach((input) => {
        it(`fuzzing with input: ${input}`, () => {
            cy.get('.destination-input').clear().type(input);
            cy.get('.search-button').click();
        });
    });
});
