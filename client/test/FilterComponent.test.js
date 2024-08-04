import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterComponent from '../src/Components/FilterComponent';
import '@testing-library/jest-dom/extend-expect';

// Mock functions
const mockSetSelectedRating = jest.fn();
const mockSetSelectedScore = jest.fn();
const mockSetPriceRange = jest.fn();
const mockSetPage = jest.fn();
const mockResetFilter = jest.fn();

/**
 * Unit Tests for FilterComponent
 * These tests focus on individual component functionality and rendering.
 */
describe('FilterComponent Unit Tests', () => {
    test('renders FilterComponent and shows the filter button', () => {
        render(<FilterComponent
            selectedRating={0}
            setSelectedRating={() => { }}
            selectedScore={[0, 100]}
            setSelectedScore={() => { }}
            resetFilter={() => { }}
            priceRange={[0, 5000]}
            setPriceRange={() => { }}
            setPage={() => { }}
        />);

        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    test('updates price range correctly', () => {
        render(<FilterComponent
            selectedRating={0}
            setSelectedRating={() => { }}
            selectedScore={[0, 100]}
            setSelectedScore={() => { }}
            resetFilter={() => { }}
            priceRange={[0, 5000]}
            setPriceRange={mockSetPriceRange}
            setPage={() => { }}
        />);

        fireEvent.click(screen.getByText('Filter'));
        fireEvent.change(screen.getByLabelText('Min Price'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Max Price'), { target: { value: '1000' } });

        expect(mockSetPriceRange).toHaveBeenCalledWith([100, 1000]);
    });
});

/**
 * Integration Tests for FilterComponent
 * These tests check how the component interacts with other components or functions.
 */
describe('FilterComponent Integration Tests', () => {
    test('sets page to 1 when price range changes', () => {
        render(<FilterComponent
            selectedRating={0}
            setSelectedRating={() => { }}
            selectedScore={[0, 100]}
            setSelectedScore={() => { }}
            resetFilter={() => { }}
            priceRange={[0, 5000]}
            setPriceRange={mockSetPriceRange}
            setPage={mockSetPage}
        />);

        fireEvent.click(screen.getByText('Filter'));
        fireEvent.change(screen.getByLabelText('Min Price'), { target: { value: '200' } });
        fireEvent.change(screen.getByLabelText('Max Price'), { target: { value: '2000' } });

        expect(mockSetPage).toHaveBeenCalledWith(1);
    });
});

/**
 * System Tests for FilterComponent
 * These tests validate the overall behavior and integration of the component in various scenarios.
 */
describe('FilterComponent System Tests', () => {
    test('price inputs prevent invalid values', () => {
        render(<FilterComponent
            selectedRating={0}
            setSelectedRating={() => { }}
            selectedScore={[0, 100]}
            setSelectedScore={() => { }}
            resetFilter={() => { }}
            priceRange={[0, 5000]}
            setPriceRange={mockSetPriceRange}
            setPage={() => { }}
        />);

        fireEvent.click(screen.getByText('Filter'));
        fireEvent.change(screen.getByLabelText('Min Price'), { target: { value: '-50' } });
        fireEvent.change(screen.getByLabelText('Max Price'), { target: { value: '100' } });

        // Check that invalid input is corrected
        expect(screen.getByLabelText('Min Price').value).toBe('0');
        expect(screen.getByLabelText('Max Price').value).toBe('100');
    });
});