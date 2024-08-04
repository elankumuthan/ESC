import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import HotelList from '../src/Components/HotelList';

// Mock data
const mockHotels = [
    {
        id: '1',
        name: 'Hotel One',
        rating: 4.5,
        image_details: { count: 2 },
        trustyou: { score: { overall: 85 } },
    },
    {
        id: '2',
        name: 'Hotel Two',
        rating: 4.0,
        image_details: { count: 1 },
        trustyou: { score: { overall: 70 } },
    },
    // Add more mock hotels as needed
];

const mockHotelPrices = { '1': 100, '2': 120 };

const mockSetCurrentImageIndices = jest.fn();
const mockSetHoveredHotelId = jest.fn();

describe('HotelList Component', () => {
    // Unit Tests
    describe('Unit Tests', () => {
        test('renders hotel list with images and details', () => {
            render(
                <MemoryRouter>
                    <HotelList
                        hotels={mockHotels}
                        hotelPrices={mockHotelPrices}
                        currentImageIndices={{ '1': 0 }}
                        setCurrentImageIndices={mockSetCurrentImageIndices}
                        setHoveredHotelId={mockSetHoveredHotelId}
                        hoveredHotelId={null}
                    />
                </MemoryRouter>
            );

            expect(screen.getByText('Hotel One')).toBeInTheDocument();
            expect(screen.getByText('Hotel Two')).toBeInTheDocument();
            expect(screen.getByText('$100')).toBeInTheDocument();
            expect(screen.getByText('$120')).toBeInTheDocument();
        });

        test('changes image on next and previous button click', () => {
            render(
                <MemoryRouter>
                    <HotelList
                        hotels={mockHotels}
                        hotelPrices={mockHotelPrices}
                        currentImageIndices={{ '1': 0 }}
                        setCurrentImageIndices={mockSetCurrentImageIndices}
                        setHoveredHotelId={mockSetHoveredHotelId}
                        hoveredHotelId={null}
                    />
                </MemoryRouter>
            );

            // Use queryAllByText to find all buttons with the text
            const buttons = screen.getAllByText(/❯|❮/i);
            const nextButton = buttons.find(button => button.textContent === '❯');
            const prevButton = buttons.find(button => button.textContent === '❮');

            // Ensure buttons are in the document
            expect(nextButton).toBeInTheDocument();
            expect(prevButton).toBeInTheDocument();

            // Simulate button clicks
            fireEvent.click(nextButton);
            expect(mockSetCurrentImageIndices).toHaveBeenCalledWith(expect.any(Object));

            fireEvent.click(prevButton);
            expect(mockSetCurrentImageIndices).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    // System Tests
    describe('System Tests', () => {
        test('renders hotels correctly with real data', () => {
            render(
                <MemoryRouter>
                    <HotelList
                        hotels={mockHotels}
                        hotelPrices={mockHotelPrices}
                        currentImageIndices={{ '1': 0 }}
                        setCurrentImageIndices={() => { }}
                        setHoveredHotelId={() => { }}
                        hoveredHotelId={null}
                    />
                </MemoryRouter>
            );

            expect(screen.getByText('Hotel One')).toBeInTheDocument();
            expect(screen.getByText('Hotel Two')).toBeInTheDocument();
            expect(screen.getByText('$100')).toBeInTheDocument();
            expect(screen.getByText('$120')).toBeInTheDocument();
        });
    });
});