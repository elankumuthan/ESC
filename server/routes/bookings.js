//Desc: This file contains the routes for the bookings table
const express = require("express");
const router=require("express").Router();
const {booking} = require("../models") //booking refers to the table name 
const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: '2i3aungkhantmoe20@gmail.com',
        pass: 'jxqk wwqm yeet psnb'
    }
});

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
        const newBooking = await booking.create(booking_req); //INSERT INTO bookings VALUES (booking_req)

        // Prepare the email content
        const mailOptions = {
            from: {
                name: 'HotelBooking',
                address: 'HotelBooking@mail.com'
            },
            to: booking_req.email,
            subject: 'Booking Confirmation',
            text: `Dear ${booking_req.firstName},\n\nYour booking has been confirmed!\n\nDetails:\nHotel ID: ${booking_req.hotelID}\nDestination ID: ${booking_req.destID}\n\nThank you for booking with us.\n\nBest regards,\nYour Company Name`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending confirmation email.');
            }
            console.log('Email sent:', info.response);
            res.status(200).send('SUCCESS!! Booking confirmed and email sent.');
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking.' });
    }
});

module.exports = router;