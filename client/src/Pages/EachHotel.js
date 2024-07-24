import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from 'yup';
import Navbar from "../Components/Navbar";
import '../Styles/bookingform.css'; 

function EachHotel() {
    let { hid } = useParams();
    let location = useLocation();
    let navigate = useNavigate();

    const { startDate, endDate, guests, destinationId } = location.state || {};
    //console.log('Received Params:', { destinationId, startDate, endDate, guests }); //for testing

    const personal_details = {
        firstName: "",
        lastName: "",
        phoneNo: "",
        email: "",
        special_req: "",
        hotelID: hid,
        destID: destinationId
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        phoneNo: Yup.string().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/, 'Invalid Phone Number').required('Required'),
        email: Yup.string().email('Invalid email format').required('Required'),
        special_req: Yup.string(),
        hotelID: Yup.string().required('Required'),
        destID: Yup.string().required('Required')
    });

    const updateDB = (data) => {
        axios.post("http://localhost:3004/booking", data)
            .then((response) => {
                console.log(`Data added! ${personal_details}`);
                //redirection
                navigate("/confirmation");
            })
            .catch((error) => {
                console.error('There was an error booking the hotel!', error);
            });
    };

    return (
        <>
        <Navbar />
        <div className="hotel-header">
            <h1>Hotel Booking</h1>
            <p>Hotel ID: {hid}</p>
            <p>Start Date: {startDate}</p>
            <p>End Date: {endDate}</p>
            <p>Guests: {guests ? `Adults: ${guests.adults}, Children: ${guests.children}, Rooms: ${guests.rooms}` : 'N/A'}</p>
        </div>

        <div className="booking-form">
            <Formik initialValues={personal_details} onSubmit={updateDB} validationSchema={validationSchema}>
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

                    <button type="submit" className="submit-button">Confirm Booking</button>
                </Form>
            </Formik>
        </div>
    </>
    );
}

export default EachHotel;