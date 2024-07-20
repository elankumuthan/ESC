import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as Yup from 'yup';
import Navbar from "../Components/Navbar";

function EachHotel() {
    let { hid } = useParams();
    let location = useLocation();

    const { startDate, endDate, guests, destinationId } = location.state || {};
    //console.log('Received Params:', { destinationId, startDate, endDate, guests }); //for testing

    const initialValues = {
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

    const onSubmit = (data) => {
        axios.post("http://localhost:3004/booking", data)
            .then((response) => {
                console.log("Data's Added!!!");
            });
    };

    return (
        <>
            <Navbar />
            <h1>I AM A HOTEL {hid}</h1>
            <p>Start Date: {startDate}</p>
            <p>End Date: {endDate}</p>
            <p>Guests: {guests ? `Adults: ${guests.adults}, Children: ${guests.children}, Rooms: ${guests.rooms}` : 'N/A'}</p>

            <div className="bookingHotel">
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                    <Form>
                        <label htmlFor="infirstName">First Name:</label><br />
                        <ErrorMessage name="firstName" component="span" style={{ color: "red" }} /><br />
                        <Field id="infirstName" name="firstName" placeholder="John" /><br />

                        <label htmlFor="inlastName">Last Name:</label><br />
                        <ErrorMessage name="lastName" component="span" style={{ color: "red" }} /><br />
                        <Field id="inlastName" name="lastName" placeholder="Doe" /><br />

                        <label htmlFor="inphoneNo">Phone Number</label><br />
                        <ErrorMessage name="phoneNo" component="span" style={{ color: "red" }} /><br />
                        <Field id="inphoneNo" name="phoneNo" placeholder="+65 85848392" /><br />

                        <label htmlFor="inemail">Email:</label><br />
                        <ErrorMessage name="email" component="span" style={{ color: "red" }} /><br />
                        <Field id="inemail" name="email" placeholder="abc@mail.com" /><br />

                        <label htmlFor="inspecial_req">Special Requests</label><br />
                        <ErrorMessage name="special_req" component="span" style={{ color: "red" }} /><br />
                        <Field id="inspecial_req" name="special_req" placeholder="Green Bed sheets" /><br />

                        <Field id="hotelID" name="hotelID" hidden />
                        <Field id="destID" name="destID" hidden /><br />

                        <button type="submit">Confirm Booking</button>
                    </Form>
                </Formik>
            </div>
        </>
    );
}

export default EachHotel;
