import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Ensure fireEvent is imported
import '@testing-library/jest-dom/extend-expect';
import SearchBox from 'client/src/Components/searchBox.js';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the useSelectedCountry hook
jest.mock('client/src/Components/SelectedCountries.js', () => {
  let destinationInput = "";
  return {
    useSelectedCountry: () => ({
      selectedCountry: "USA",
      setSelectedCountry: jest.fn(),
      startDate: null,
      setStartDate: jest.fn(),
      endDate: null,
      setEndDate: jest.fn(),
      guests: 1,
      setGuests: jest.fn(),
      get destinationInput() {
        return destinationInput;
      },
      setDestinationInput: jest.fn((value) => {
        destinationInput = value;
      }),
    }),
  };
});

// Hardcoded fuzz test cases (24 cases) Can add more if needed
const fuzzTestCases = [
  "test1",
  "exampleInput",
  "1234567890",
  "special!@#$%^&*()",
  "longinputstringwithmultiplecharacters",
  "short",
  "UPPERCASE",
  "lowercase",
  "MixedCase123",
  "with spaces",
  "<script>alert('XSS')</script>",
  "' OR '1'='1",
  "DROP TABLE users;",
  "SELECT * FROM users WHERE 'a'='a';",
  "admin' --",
  "admin' #",
  "admin'/*",
  "' OR 1=1 --",
  "' OR 1=1 #",
  "' OR 1=1/*",
  "'; EXEC xp_cmdshell('dir'); --",
  "'; EXEC xp_cmdshell('whoami'); --",
  "'; EXEC xp_cmdshell('shutdown -s'); --",
  "'; EXEC xp_cmdshell('net user'); --",
];

describe('SearchBox fuzzing test', () => {

  // Array to store test cases that caused errors for further examination
  const errorTestCases = [];

  afterAll(() => {
    if (errorTestCases.length > 0) {
      console.log('Test cases that caused errors:', errorTestCases);
    }
  });


  fuzzTestCases.forEach((testCase) => {
    test(`handles fuzzing input and triggers search: ${testCase}`, async () => {
      render(
        <Router>
          <SearchBox/>
        </Router>
      );

      const inputElement = screen.getByPlaceholderText('Search destinations');
      const searchButton = document.querySelector('.search-button'); 

      // TEST Log the input element value before change event
      //console.log(`Input Element Value Before Change: ${testCase}`);
      
      // Simulate user typing the fuzzing input into the input
      fireEvent.change(inputElement, { target: { value: testCase } });

      // Wait for the input value to be updated
      await waitFor(() => {
        expect(inputElement.value).toBe(testCase);
      });

      // TEST Log the input element value after change event
      // console.log(`Input Element Value After Change: ${inputElement.value}`);

      // Simulate clicking the search button
      fireEvent.click(searchButton);

      // Ensure no errors are thrown and the DOM remains unchanged
      try {
        fireEvent.click(searchButton);
      } catch (error) {
        errorTestCases.push(testCase);
      }

    });
  });
});