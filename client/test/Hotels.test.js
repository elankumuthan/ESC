import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Hotels from 'client/src/Pages/Hotels.js';

// Mock axios for API requests
jest.mock('axios');

test('passes destinationId from the first page to the second and shows the list of hotels', async () => {
    const mockHotels = [
        { id: '050G', name: 'The Forest by Wangz' }, 
        { id: '0dAF', name: 'New Majestic Hotel' }
    ];
    axios.get.mockResolvedValue({ data: mockHotels });

    const searchParams = new URLSearchParams({
        destination_id: 'RsBU',
        start_date: '2024-07-20',
        end_date: '2024-07-25',
        guests: JSON.stringify({ adults: 2, children: 1, rooms: 1 })
    });

    render(
        <MemoryRouter initialEntries={[`/hotels?${searchParams.toString()}`]}>
            <Routes>
                <Route path="/hotels" element={<Hotels />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('LIST OF HOTELS')).toBeInTheDocument();
        expect(screen.getByText('The Forest by Wangz')).toBeInTheDocument();
        expect(screen.getByText('New Majestic Hotel')).toBeInTheDocument();
    });

    const hotelListContainer = screen.getByText('LIST OF HOTELS');
    expect(hotelListContainer).toBeInTheDocument();
});

test('does not show hotels when the wrong destination_id is used', async () => {
    const mockHotels = [];
    axios.get.mockResolvedValue({ data: mockHotels });

    const searchParams = new URLSearchParams({
        destination_id: 'qwer',
        start_date: '2024-07-20',
        end_date: '2024-07-25',
        guests: JSON.stringify({ adults: 2, children: 1, rooms: 1 })
    });

    render(
        <MemoryRouter initialEntries={[`/hotels?${searchParams.toString()}`]}>
            <Routes>
                <Route path="/hotels" element={<Hotels />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('LIST OF HOTELS')).toBeInTheDocument();
        expect(screen.queryByText('The Forest by Wangz')).not.toBeInTheDocument();
        expect(screen.queryByText('New Majestic Hotel')).not.toBeInTheDocument();
    });

    const hotelListContainer = screen.getByText('LIST OF HOTELS');
    expect(hotelListContainer).toBeInTheDocument();
});