import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Hotels from 'client/src/Pages/Hotels.js';

// Mock axios for API requests
jest.mock('axios');

// Mock useSelectedCountry hook
jest.mock('client/src/Components/SelectedCountries.js', () => ({
    useSelectedCountry: () => ({
        selectedCountry: { uid: 'RsBU' },
        setSelectedCountry: jest.fn(),
        startDate: '2024-07-20',
        setStartDate: jest.fn(),
        endDate: '2024-07-25',
        setEndDate: jest.fn(),
        guests: { adults: 2, children: 1, rooms: 1 },
        setGuests: jest.fn(),
        destinationInput: '',
        setDestinationInput: jest.fn(),
    }),
}));

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

test('passes destinationId from the first page to the second and shows the list of hotels', async () => {
    const mockHotels = [
        {
            id: '050G',
            name: 'The Forest by Wangz',
            rating: 4,
            image_details: { count: 3 },
        },
        {
            id: '0dAF',
            name: 'New Majestic Hotel',
            rating: 4,
            image_details: { count: 2 },
        },
    ];
    axios.get.mockResolvedValue({ data: mockHotels });

    const searchParams = new URLSearchParams({
        destination_id: 'RsBU',
        start_date: '2024-07-20',
        end_date: '2024-07-25',
        guests: JSON.stringify({ adults: 2, children: 1, rooms: 1 }),
    });

    render(
        <MemoryRouter initialEntries={[`/hotels?${searchParams.toString()}`]}>
            <Routes>
                <Route path="/hotels" element={<Hotels />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        // Check that the hotels are displayed
        expect(screen.getByText('The Forest by Wangz')).toBeInTheDocument();
        expect(screen.getByText('New Majestic Hotel')).toBeInTheDocument();
    });
});

test('does not show hotels when the wrong destination_id is used', async () => {
    const mockHotels = [];
    axios.get.mockResolvedValue({ data: mockHotels });

    const searchParams = new URLSearchParams({
        destination_id: 'qwer',
        start_date: '2024-07-20',
        end_date: '2024-07-25',
        guests: JSON.stringify({ adults: 2, children: 1, rooms: 1 }),
    });

    render(
        <MemoryRouter initialEntries={[`/hotels?${searchParams.toString()}`]}>
            <Routes>
                <Route path="/hotels" element={<Hotels />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        // Ensure that no hotels are displayed
        expect(screen.queryByText('The Forest by Wangz')).not.toBeInTheDocument();
        expect(screen.queryByText('New Majestic Hotel')).not.toBeInTheDocument();
    });

    // Check that no hotel items are in the DOM
    const hotelItems = screen.queryAllByTestId('hotel-item');
    expect(hotelItems.length).toBe(0);
});