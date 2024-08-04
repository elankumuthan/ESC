//Desc: This file contains the routes for the bookings table
const express = require("express");
const router = require("express").Router();
const { booking } = require("../models") //booking refers to the table name 
const Model = require("../api boundary/boundary.js")

//Get request to the bookings endpoint
router.get("/", async (req, res) => {
    try {
        const listofbookings = await booking.findAll();
        res.json(listofbookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
});

//Post request to store the booking details in the database
router.post("/", async (req, res) => {
    try {
        //Creating a new booking entry in the database
        const booking_req = req.body; // the JSON format is called body
        const payment_method = booking_req.payeeID
        const last4 = await Model.retrieve_last4digits(payment_method);
        booking_req.payeeID = last4;
        const newBooking = await booking.create(booking_req); //INSERT INTO bookings VALUES (booking_req)

        try {
            response = await Model.sendEmail(booking_req, newBooking.id);
            console.log('Email sent:', response);
            res.status(200).send('SUCCESS!! Booking confirmed and email sent.');
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending confirmation email.');
        }


    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking.' });
    }
});

//stripe getting clientSecret to handle paymentIntent( for a single transaction object )
router.post('/checkout', async function (req, res, next) {

    const paymentIntent = await Model.getPaymentSession();
    res.send({ clientSecret: paymentIntent.client_secret });

});
module.exports = router;