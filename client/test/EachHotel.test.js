/// Import necessary libraries and components
import React from 'react';
import { render, screen, act,fireEvent, waitFor  } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EachHotel from '../src/Pages/Booking';
import userEvent from '@testing-library/user-event';
import axios from 'axios';


//mock axios
jest.mock('axios');
// Mock the image import 
jest.mock('../src/Assets/file.png', () => 'test-file-stub', { virtual: true });

// Mock fetch for the test
global.fetch = jest.fn();

const createMockStripe = (paymentIntentStatus) => ({
    elements: jest.fn(),
    createToken: jest.fn(),
    createSource: jest.fn(),
    createPaymentMethod: jest.fn(),
    confirmCardPayment: jest.fn(),
    confirmCardSetup: jest.fn(),
    paymentRequest: jest.fn(),
    _registerWrapper: jest.fn(),
    retrievePaymentIntent: jest.fn().mockResolvedValue({
        paymentIntent: {
            status: paymentIntentStatus,
            payment_method: 'mock_payment_method',
        },
    }),
    confirmPayment: jest.fn().mockImplementation(() => {
        if (paymentIntentStatus === 'error') {
            return Promise.resolve({
                error: new Error('Payment failed'),
            });
        }
        return Promise.resolve({
            paymentIntent: {
                status: paymentIntentStatus,
                payment_method: 'mock_payment_method',
            },
        });
    }),
});

const mockElements = {
    getElement: jest.fn(),
  };
 
jest.mock('@stripe/react-stripe-js', () => {
const stripe = jest.requireActual('@stripe/react-stripe-js');
return {
    ...stripe,
    useStripe: () => mockStripe,
    useElements: () => mockElements,
    Elements: jest.fn(({ children }) => <div>{children}</div>),
    PaymentElement: jest.fn(() => <div data-testid="payment-element"></div>),
};
});

// Mock navigate function
const mockNavigate = jest.fn(()=>{console.log('navigated')});
const mockLocation={state: 
    {
        startDate: '2024-08-01', // Replace with actual test values
        endDate: '2024-08-10',   // Replace with actual test values
        guests: { adults: 2, children: 1, rooms: 1 }, // Replace with actual test values
        destinationId: 'destination123', // Replace with actual test values
        hotelName: 'Test Hotel', // Replace with actual test values
        hotelId: 'hotel123', // Replace with actual test values
        roomDescription: 'Deluxe Room', // Replace with actual test values
        roomPrice: 200, // Replace with actual test values
    }
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: ()=>mockLocation,
}));

let mockStripe;
let clientSecret;


//test for useEffect on init to get clientSecret before PaymentElement renders
describe('useEffect(,[]) on init call retrieve clientSecret from server and allows PaymentElement and button to render',()=>{
    beforeEach(()=>{
        fetch.mockClear();
        clientSecret = undefined;
    });

    test('PaymnetElement renders when server returns valid clientSecret',async ()=>{
        fetch.mockImplementationOnce(()=>Promise.resolve({
            json:()=>Promise.resolve({clientSecret:'test_client_secret'})
        }));
        await act(async () => {
            render(
                <Router>
                        <EachHotel />
                </Router>
            );
        });
        const button = screen.getByText('Pay & Submit');
        expect(button).toBeInTheDocument(); 
        const paymentElement= screen.getByTestId("payment-element")
        expect(paymentElement).toBeInTheDocument();
    })

    test('PaymnetElement renders when server returns valid clientSecret',async ()=>{
        fetch.mockImplementationOnce(()=>Promise.resolve({
            json:()=>Promise.resolve({clientSecret:''})
        }));
        await act(async () => {
            render(
                <Router>
                        <EachHotel />
                </Router>
            );
        });
        const button = screen.queryByText('Pay & Submit');
        expect(button).not.toBeInTheDocument(); 
        const paymentElement= screen.queryByTestId("payment-element")
        expect(paymentElement).not.toBeInTheDocument();
    })
})






//test for handleSubmitClick starts
describe('submit button front end integration test', () => {
    fetch.mockImplementation(()=>Promise.resolve({
        json:()=>Promise.resolve({clientSecret:'test_client_secret'})
    }));

    test('render loading spinner, disable button, and navigate to confirmation page when both payment is SUCCESSFUL & form is VALID', async () => {
        mockStripe = createMockStripe('succeeded');
        axios.post.mockResolvedValue({
            data: { status: 200, body: 'succeeded' }
        });
    
        await act(async () => {
            render(
                <Router>
                    <EachHotel />
                </Router>
            );
        });
    
        const button = screen.getByTestId('payment-button');
        console.log(button);
        
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'valid' } });
            fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'input' } });
            fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+6584572662' } });
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'yolo@gmail.com' } });
            userEvent.click(button);
        });
    
        await waitFor(() => {
            expect(button).toBeDisabled(); // check button remains disabled
            expect(screen.getByText(/Processing.../i)).toBeInTheDocument(); // ensure that loading message is shown
        });
    
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/confirmation', {
                state: {
                    startDate: expect.anything(),
                    endDate: expect.anything(),
                    guests: expect.anything(),
                    destinationId: expect.anything(),
                    hotelName: expect.anything(),
                    hotelId: expect.anything(),
                    roomDescription: expect.anything(),
                    roomPrice: expect.anything(),
                },
            });
        });
    });
        // Add your assertions here based on expected behavior
    


test('ensure loading spinner stops,button enabled and Required shown on screen when payment is SUCCESSFUL but form fields (First Name) are INVALID', async () => {
        mockStripe=createMockStripe('succeeded')
        await act(async () => {
            render(
                <Router>
                        <EachHotel />
                </Router>
            );
        });
        
        const button = screen.getByTestId('payment-button');
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: '' } });
            fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'input' } });
            fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+6584572662' } });
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'yolo@gmail.com' } });
            userEvent.click(button);
        });
        await waitFor(() => {
        expect(button).not.toBeDisabled(); // ensure the button is enabled after processing
        expect(screen.queryByText(/Processing.../i)).not.toBeInTheDocument(); // ensure the loading message is hidden
        expect(screen.getByText(/Required/i)).toBeInTheDocument();})

        // Add your assertions here based on expected behavior
    });

    test('ensure loading spinner stops,button enabled when payment FAILS but form fields are VALID', async () => {
        mockStripe=createMockStripe('error')
        await act(async () => {
            render(
                <Router>
                        <EachHotel />
                </Router>
            );
        });
        
        const button = screen.getByTestId('payment-button');
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'valid' } });
            fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'input' } });
            fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+6584572662' } });
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'yolo@gmail.com' } });
            userEvent.click(button);
        });

        await waitFor(() => {
        expect(button).not.toBeDisabled(); // ensure the button is enabled after processing
        expect(screen.queryByText(/Processing.../i)).not.toBeInTheDocument();}) // ensure the loading message is hidden
    });


    test('ensure loading spinner stops,button enabled when payment FAILS and form fields are INVALID', async () => {
        mockStripe=createMockStripe('error')
        await act(async () => {
            render(
                <Router>
                        <EachHotel />
                </Router>
            );
        });
        const button = screen.getByTestId('payment-button');
        await act(async () => {
            userEvent.click(button);
        });
        await waitFor(() => {
        expect(button).not.toBeDisabled(); // ensure the button is enabled after processing
        expect(screen.queryByText(/Processing.../i)).not.toBeInTheDocument();}) // ensure the loading message is hidden
    });
});

