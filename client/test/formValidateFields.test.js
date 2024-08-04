//test form validate inputs while user is typing
import EachHotel from '../src/Pages/Booking';
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


// Mock the image import 
jest.mock('../src/Assets/file.png', () => 'test-file-stub', { virtual: true });
// Mock fetch for the test
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ clientSecret: 'test_client_secret' }),
    })
);

//test form input validation
describe('while user types, form validation of inputs', () => {
    test('invalid First Name,Last Name, Phone Number,Email Inputs triggers 4 REQUIRED on screen', async () => {

        render(
            <MemoryRouter initialEntries={[{ pathname: '/hotels' }]}>
                <Routes>
                    <Route path="/hotels" element={<EachHotel />} />
                </Routes>
            </MemoryRouter>
        );

        await act(async () => {
            // Simulate user typing an empty value in the First Name field
            fireEvent.blur(screen.getByLabelText(/First Name/i), { target: { value: '' } });
            fireEvent.blur(screen.getByLabelText(/Last Name/i), { target: { value: '' } });
            fireEvent.blur(screen.getByLabelText(/Phone Number/i), { target: { value: '' } });
            fireEvent.blur(screen.getByLabelText(/Email/i), { target: { value: '' } });

        });

        const validationMessages = screen.getAllByText(/Required/i);
        expect(validationMessages).toHaveLength(4);

    })

})