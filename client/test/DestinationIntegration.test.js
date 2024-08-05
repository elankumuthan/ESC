import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Destination from 'client/src/Components/Destinations';
import { useSelectedCountry } from 'client/src/Components/SelectedCountries';

jest.mock('client/src/Components/SelectedCountries', () => ({
    useSelectedCountry: jest.fn(),
}));

jest.mock('client/src/Components/Carousel', () => ({ handleClick }) => (
    <div>
        <button data-testid="destination-card" onClick={() => handleClick('RsBU', 'Test Destination')}>
            Test Destination
        </button>
    </div>
));

describe('Destination Component', () => {
    beforeEach(() => {
        useSelectedCountry.mockReturnValue({
            setStartDate: jest.fn(),
            setEndDate: jest.fn(),
            setDestinationInput: jest.fn(),
        });
    });

    test('should navigate to hotels page when a destination card is clicked', () => {
        const { setStartDate, setEndDate, setDestinationInput } = useSelectedCountry();

        delete window.location;
        window.location = { href: '' };

        render(
            <MemoryRouter>
                <Destination />
            </MemoryRouter>
        );

        const destinationCard = screen.getByTestId('destination-card');
        fireEvent.click(destinationCard);

        expect(setStartDate).toHaveBeenCalled();
        expect(setEndDate).toHaveBeenCalled();
        expect(setDestinationInput).toHaveBeenCalledWith('Test Destination');
        expect(window.location.href).toContain('/hotels?destination_id=RsBU');
    });
});