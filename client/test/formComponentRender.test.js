//unit tests to ensure components rendered properly 

import EachHotel,{Button} from '../src/Pages/Booking';
import React from 'react';
import {render,screen,waitFor,fireEvent,act} from '@testing-library/react';
import {MemoryRouter,Route,Routes} from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";


// Mock the image import 
jest.mock('../src/Assets/file.png', () => 'test-file-stub', { virtual: true });
// Mock fetch for the test
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ clientSecret: 'pi_3Pjxv3BQYdvRSbbU1n6BHquX_secret_75LvkrCT9l1LMfL4vNUfuumXU' }),
    })
);
//mock functions for stripe 
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

let mockStripe=createMockStripe('succeeded');
const mockElements = {
    getElement: jest.fn(),
  };

 // Mock the Stripe context
jest.mock('@stripe/react-stripe-js', () => ({
    Elements: jest.fn(({ children }) => <div>{children}</div>),
    PaymentElement: jest.fn(() => <div data-testid="payment-element"></div>),
    useStripe: jest.fn(() => mockStripe),
    useElements: jest.fn(() => mockElements),
}));




//test for rendering of all components of form starts here
describe ("unit test to ensure Booking Form components rendered on screen following correct logic",()=>{
    

    test ('Form is rendered on Booking Page',()=>{
        // Mock data
        const mockData = {
            startDate: '2024-07-20',
            endDate: '2024-07-25',
            guests: { adults: 2, children: 1, rooms: 1 },
            destinationId: 'RsBU',
            hotelName: 'The Forest by Wangz',
            hotelId: '123',
            roomDescription: 'Deluxe Suite',
            roomPrice: 200
        };

        // Render the component with a route and mock state
        render(
            <MemoryRouter initialEntries={[{ pathname: '/hotels', state: mockData }]}>
                <Routes>
                    <Route path="/hotels" element={<EachHotel />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Hotel Booking')).toBeInTheDocument();
        expect(screen.getByText(`Hotel Name: ${mockData.hotelName}`)).toBeInTheDocument();
        expect(screen.getByText(`Start Date: ${mockData.startDate}`)).toBeInTheDocument();
        expect(screen.getByText(`End Date: ${mockData.endDate}`)).toBeInTheDocument();
        expect(screen.getByText(`Guests: Adults: ${mockData.guests.adults}, Children: ${mockData.guests.children}, Rooms: ${mockData.guests.rooms}`)).toBeInTheDocument();
        expect(screen.getByText(`Room Type: ${mockData.roomDescription}`)).toBeInTheDocument();
        expect(screen.getByText(`Room Price: $${mockData.roomPrice}`)).toBeInTheDocument();

        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Special Requests')).toBeInTheDocument();



    })

    //test for button rendered only when client secret present
    test('Button and Payment Element is rendered on screen when clientSecret is present',()=>{
        // Mock stripePromise and set clientSecret
        const isProcessingStripe = false;
        const stripePromise = loadStripe("pk_test_51PVRhkBQYdvRSbbUXQbqZZEgSjlMuM8FukpdV9gtGgYfa0JnICzsxzDtP484SVHZ81fLrPyCt7qEOcagnpfRFP8M009ejwRR6i");
        const clientSecret='pi_3Pjxv3BQYdvRSbbU1n6BHquX_secret_75LvkrCT9l1LMfL4vNUfuumXU' ;
        const handleSubmitClick = jest.fn(); // Mock function
        render(
        <div>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentElement/>
                    <Button isProcessingStripe={isProcessingStripe} submitPayment={handleSubmitClick} />
                </Elements>
            )}
        </div>)

        const button = screen.getByText('Pay & Submit');
        expect(button).toBeInTheDocument(); 
        // Check if PaymentElement is rendered
        const paymentElement = screen.getByTestId('payment-element');
        expect(paymentElement).toBeInTheDocument();
    })


    //test that button not rendered when client secret absent
    test('Button and Payment Element is not rendered on screen when clientSecret is an empty string', () => {
        const isProcessingStripe = false;
        const handleSubmitClick = jest.fn(); // Mock function
        const clientSecret = ''; // Empty string
    
        render(
            <div>
                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentElement />
                        <Button isProcessingStripe={isProcessingStripe} submitPayment={handleSubmitClick} />
                    </Elements>
                )}
            </div>
        );
        // Check if the Elements component and Button component are not rendered
        const button = screen.queryByText('Pay & Submit');
        expect(button).not.toBeInTheDocument();
        const paymentElement = screen.queryByTestId('payment-element');
        expect(paymentElement).not.toBeInTheDocument();
    });

});


