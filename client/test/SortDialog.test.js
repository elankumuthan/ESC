import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SortDialog from '../src/Components/SortDialog'; // Adjust import based on your project structure

// Unit Test for rendering the dialog
test('renders SortDialog with correct buttons and labels when open', () => {
    render(
        <SortDialog
            isOpen={true}
            onClose={() => { }}
            toggleSortOrder={() => { }}
            toggleSortByRating={() => { }}
            sortOrder="asc"
        />
    );

    // Check if the dialog is rendered
    expect(screen.getByText('Sort By Price ↑')).toBeInTheDocument();
    expect(screen.getByText('Sort By ⭐️ ↕️')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
});

// Unit Test for handling onClose
test('calls onClose function when overlay or close button is clicked', () => {
    const handleClose = jest.fn();
    render(
        <SortDialog
            isOpen={true}
            onClose={handleClose}
            toggleSortOrder={() => { }}
            toggleSortByRating={() => { }}
            sortOrder="asc"
        />
    );

    // Simulate click on the overlay
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));

    // Simulate click on the close button
    fireEvent.click(screen.getByText('Close'));

    // Verify if the onClose function is called
    expect(handleClose).toHaveBeenCalledTimes(2);
});

// Unit Test for handling toggleSortOrder and toggleSortByRating
test('calls toggleSortOrder and toggleSortByRating functions when buttons are clicked', () => {
    const toggleSortOrder = jest.fn();
    const toggleSortByRating = jest.fn();
    render(
        <SortDialog
            isOpen={true}
            onClose={() => { }}
            toggleSortOrder={toggleSortOrder}
            toggleSortByRating={toggleSortByRating}
            sortOrder="rating-desc"
        />
    );

    // Simulate click on sort order button
    fireEvent.click(screen.getByText('Sort By Price ↕️'));
    // Simulate click on sort by rating button
    fireEvent.click(screen.getByText('Sort By ⭐️ ↓'));

    // Verify if the functions are called
    expect(toggleSortOrder).toHaveBeenCalled();
    expect(toggleSortByRating).toHaveBeenCalled();
});

// Unit Test for conditional button labels based on sortOrder
test('displays correct button labels based on sortOrder prop', () => {
    const { rerender } = render(
        <SortDialog
            isOpen={true}
            onClose={() => { }}
            toggleSortOrder={() => { }}
            toggleSortByRating={() => { }}
            sortOrder="asc"
        />
    );

    // Check the labels based on the sortOrder prop
    expect(screen.getByText('Sort By Price ↑')).toBeInTheDocument();
    expect(screen.getByText('Sort By ⭐️ ↕️')).toBeInTheDocument();

    // Update sortOrder to "rating-desc"
    rerender(
        <SortDialog
            isOpen={true}
            onClose={() => { }}
            toggleSortOrder={() => { }}
            toggleSortByRating={() => { }}
            sortOrder="rating-desc"
        />
    );

    // Check the updated labels
    expect(screen.getByText('Sort By Price ↕️')).toBeInTheDocument();
    expect(screen.getByText('Sort By ⭐️ ↓')).toBeInTheDocument();
});

// Unit Test for rendering nothing when dialog is closed
test('does not render SortDialog when isOpen is false', () => {
    const { container } = render(
        <SortDialog
            isOpen={false}
            onClose={() => { }}
            toggleSortOrder={() => { }}
            toggleSortByRating={() => { }}
            sortOrder="asc"
        />
    );

    // The dialog should not be rendered
    expect(container.firstChild).toBeNull();
});