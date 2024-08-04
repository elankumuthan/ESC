import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchBox from 'client/src/Components/searchBox.js';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the useSelectedCountry hook
jest.mock('client/src/Components/SelectedCountries.js', () => ({
  useSelectedCountry: () => ({
    selectedCountry: "USA",
    setSelectedCountry: jest.fn(),
    startDate: null,
    setStartDate: jest.fn(),
    endDate: null,
    setEndDate: jest.fn(),
    guests: 1,
    setGuests: jest.fn(),
    destinationInput: "",
    setDestinationInput: jest.fn(),
  }),
}));

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

// Suppress specific console.error warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' &&
      (args[0].includes('Support for defaultProps will be removed') ||
        args[0].includes('Warning: `ReactDOMTestUtils.act` is deprecated'))) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders the search box with all elements', async () => {
  await act(async () => {
    render(
      <Router>
        <SearchBox />
      </Router>
    );
  });

  // Check if the 'Where' input is rendered
  const whereInput = screen.getByPlaceholderText(/search destinations/i);
  expect(whereInput).toBeInTheDocument();

  // Check if the 'Check-in' and 'Check-out' date pickers are rendered
  const checkInInput = screen.getByPlaceholderText(/check-in/i);
  const checkOutInput = screen.getByPlaceholderText(/check-out/i);
  expect(checkInInput).toBeInTheDocument();
  expect(checkOutInput).toBeInTheDocument();

  // Check if the 'Guests' selection is rendered
  const guestsLabel = screen.getByText(/guests/i);
  expect(guestsLabel).toBeInTheDocument();

});