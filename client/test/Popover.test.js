import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Popover from '../src/Components/Popover'; // Adjust import based on your project structure

// Unit Test for rendering Popover
test('renders Popover with correct content and position', () => {
    render(
        <Popover
            position={{ left: '100px', top: '50px' }}
            content="Test Content"
            onClose={() => { }}
        />
    );

    // Check if the Popover is rendered with the correct content
    const popover = screen.getByText('Test Content');
    expect(popover).toBeInTheDocument();

    // Check if the Popover is positioned correctly
    const popoverElement = screen.getByText('Test Content').parentElement;
    expect(popoverElement).toHaveStyle('left: 100px');
    expect(popoverElement).toHaveStyle('top: 50px');
});

// Unit Test for handling onClose
test('calls onClose function when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
        <Popover
            position={{ left: '100px', top: '50px' }}
            content="Test Content"
            onClose={handleClose}
        />
    );

    // Simulate click on the close button
    fireEvent.click(screen.getByRole('button'));

    // Verify if the onClose function is called
    expect(handleClose).toHaveBeenCalled();
});

// Unit Test for handling missing position
test('renders nothing if position is missing', () => {
    const { container } = render(
        <Popover
            position={{}}
            content="Test Content"
            onClose={() => { }}
        />
    );

    // The popover should not be rendered
    expect(container.firstChild).toBeNull();
});

// Integration Test with Parent Component
const ParentComponent = () => {
    const [isPopoverVisible, setPopoverVisible] = React.useState(true);

    const handleClose = () => {
        setPopoverVisible(false);
    };

    return (
        <div>
            {isPopoverVisible && (
                <Popover
                    position={{ left: '100px', top: '50px' }}
                    content="Test Content"
                    onClose={handleClose}
                />
            )}
            <div data-testid="popover-status">{isPopoverVisible ? 'Visible' : 'Hidden'}</div>
        </div>
    );
};

// Integration Test to verify Popover visibility and state
test('Popover visibility toggles based on parent state', () => {
    render(<ParentComponent />);

    // Check if Popover is initially visible
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Simulate click on close button
    fireEvent.click(screen.getByRole('button'));

    // Verify if Popover is hidden
    expect(screen.getByTestId('popover-status')).toHaveTextContent('Hidden');
});

// System Test to ensure Popover works within the App
test('Popover works within the App', () => {
    render(<ParentComponent />); // Use ParentComponent or your main App component

    // Check if Popover is rendered within the App
    const popover = screen.getByText('Test Content');
    expect(popover).toBeInTheDocument();
});