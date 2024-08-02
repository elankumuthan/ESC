import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from 'yup';
import Navbar from "../Components/Navbar";
import '../Styles/bookingform.css';
// Imports for Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51PVRhkBQYdvRSbbUXQbqZZEgSjlMuM8FukpdV9gtGgYfa0JnICzsxzDtP484SVHZ81fLrPyCt7qEOcagnpfRFP8M009ejwRR6i");

let payment_method = "";
let paymentIntentStatus = {};

// Payment Button Component
function Button({ isProcessingStripe, submitPayment }) {
    const stripe = useStripe();
    const elements = useElements();

    const buttonStyle = {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        width: '100%',
        textAlign: 'center'
    };

    const buttonDisabledStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>
            <button
                style={isProcessingStripe ? buttonDisabledStyle : buttonStyle}
                onClick={() => submitPayment(stripe, elements)}
                disabled={isProcessingStripe}
            >
                <span>
                    {isProcessingStripe ? "Processing... " : "Pay & Submit"}
                </span>
            </button>
        </div>
    );
}

// Form Component
function EachHotel() {
    let location = useLocation();
    let navigate = useNavigate();

    const { startDate, endDate, guests, destinationId, hotelName, hotelId, roomDescription, roomPrice } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const effectRan = useRef(false);
    const [isProcessingStripe, setIsProcessingStripe] = useState(false);
    const formikRef = useRef(null);

    const personalDetails = {
        firstName: "",
        lastName: "",
        phoneNo: "",
        email: "",
        special_req: "",
        hotelID: hotelId,
        destID: destinationId,
        hotelName: hotelName,
        startDate,
        endDate,
        roomType: roomDescription,
        guestDetails: JSON.stringify(guests),
        price: roomPrice,
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        phoneNo: Yup.string().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/, 'Invalid Phone Number').required('Required'),
        email: Yup.string().email('Invalid email format').required('Required'),
        special_req: Yup.string(),
    });

    const updateDB = async (data) => {
        setLoading(true);
        data.payeeID = payment_method;
        try {
            await axios.post("http://localhost:3004/booking", data);
            console.log(`Data added!`);
            navigate("/confirmation", {
                state: {
                    startDate,
                    endDate,
                    guests,
                    destinationId,
                    hotelName,
                    hotelId,
                    roomDescription,
                    roomPrice,
                }
            });
        } catch (error) {
            console.error('Error booking the hotel!', error);
        } finally {
            setLoading(false);
        }
    };

    async function handleSubmitClick(stripe, elements) {
        if (!stripe || !elements) return;
        setIsProcessingStripe(true);
        setLoading(true);
        paymentIntentStatus = await stripe.retrievePaymentIntent(clientSecret);
        if (paymentIntentStatus.paymentIntent.status !== 'succeeded') {
            const { error } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required'
            });

            if (error) {
                console.error('Error during payment:', error);
                setIsProcessingStripe(false);
                setLoading(false);
                return;
            }
            paymentIntentStatus = await stripe.retrievePaymentIntent(clientSecret);
        }

        if (paymentIntentStatus.paymentIntent.status === 'succeeded') {
            payment_method = paymentIntentStatus.paymentIntent.payment_method;

            const formErrors = await formikRef.current.validateForm();
            if (Object.keys(formErrors).length > 0) {
                setIsProcessingStripe(false);
                setLoading(false);
                return;
            }

            formikRef.current.submitForm();
        }
    }

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        fetch("http://localhost:3004/booking/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then(async (r) => {
                const { clientSecret } = await r.json();
                setClientSecret(clientSecret);
            })
            .catch(error => console.error('Error fetching client secret:', error));
    }, []);

    return (
        <>
            <Navbar />
            <div className="hotel-header">
                <h1>Hotel Booking</h1>
                <p>Hotel Name: {hotelName}</p>
                <p>Start Date: {startDate}</p>
                <p>End Date: {endDate}</p>
                <p>Guests: {guests ? `Adults: ${guests.adults}, Children: ${guests.children}, Rooms: ${guests.rooms}` : 'N/A'}</p>
                <p>Room Type: {roomDescription}</p>
                <p>Room Price: ${roomPrice}</p>
            </div>

            <div className="booking-form">
                <Formik
                    initialValues={personalDetails}
                    validationSchema={validationSchema}
                    onSubmit={updateDB}
                    innerRef={formikRef}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="infirstName">First Name</label>
                            <Field id="infirstName" name="firstName" placeholder="John" className="form-field" />
                            <ErrorMessage name="firstName" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="inlastName">Last Name</label>
                            <Field id="inlastName" name="lastName" placeholder="Doe" className="form-field" />
                            <ErrorMessage name="lastName" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="inphoneNo">Phone Number</label>
                            <Field id="inphoneNo" name="phoneNo" placeholder="+65 85848392" className="form-field" />
                            <ErrorMessage name="phoneNo" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="inemail">Email</label>
                            <Field id="inemail" name="email" placeholder="abc@mail.com" className="form-field" />
                            <ErrorMessage name="email" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="inspecial_req">Special Requests</label>
                            <Field id="inspecial_req" name="special_req" placeholder="Green Bed sheets" className="form-field" />
                            <ErrorMessage name="special_req" component="div" className="error-message" />
                        </div>

                        <div>
                            {clientSecret && (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <PaymentElement />
                                    <Button isProcessingStripe={isProcessingStripe} submitPayment={handleSubmitClick} />
                                </Elements>
                            )}
                        </div>

                    </Form>
                </Formik>
            </div>

            {loading && (
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Confirming your reservation...</p>
                </div>
            )}
        </>
    );
}

export default EachHotel;
