import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationComponent from '../src/Components/PaginationComponent'; // Adjust import based on your project structure

// Unit Test for rendering PaginationComponent
test('renders PaginationComponent with correct props', () => {
    const handleChange = jest.fn();
    render(
        <PaginationComponent
            count={5}
            page={1}
            handleChange={handleChange}
        />
    );

    // Check if the Pagination component is rendered
    const pagination = screen.getByRole('navigation'); // Adjust if necessary
    expect(pagination).toBeInTheDocument();
});

// Unit Test for handling page change
test('calls handleChange with correct page number on page change', () => {
    const handleChange = jest.fn();
    render(
        <PaginationComponent
            count={5}
            page={1}
            handleChange={handleChange}
        />
    );

    // Simulate page change
    fireEvent.click(screen.getByText('2')); // Adjust the selector if necessary

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 2); // Expect a second parameter of the new page number
});

// Integration Test with ParentComponent
const ParentComponent = () => {
    const [page, setPage] = useState(1);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <div>
            <PaginationComponent
                count={5}
                page={page}
                handleChange={handlePageChange}
            />
            <div data-testid="current-page">{page}</div>
        </div>
    );
};

// Integration Test to verify state updates
test('PaginationComponent updates page state on change', () => {
    render(<ParentComponent />);

    // Simulate page change
    fireEvent.click(screen.getByText('2')); // Adjust the selector if necessary

    // Check if the page state is updated correctly
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
});

// System Test to ensure component works within the App
test('PaginationComponent works within the App', () => {
    render(<ParentComponent />); // Use ParentComponent or your main App component

    // Check if PaginationComponent is rendered
    const pagination = screen.getByRole('navigation'); // Adjust if necessary
    expect(pagination).toBeInTheDocument();
});