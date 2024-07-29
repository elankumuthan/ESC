//Desc: This file contains the routes for the bookings table
const express = require("express");
const router=require("express").Router();
const {booking} = require("../models") //booking refers to the table name 
const nodemailer = require('nodemailer');

//stripe 
const stripe = require('stripe')('sk_test_51PVRhkBQYdvRSbbU9Y9xlRheqP1XPfW6CizK8QNLhFe0aMzeUCDyH1BWo5MZQZC9PK8v6akTVcBlJ25rccSyX1FQ00Zfwqb9cb');

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
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Your receipt from HotelBooking</h2>
                    <p>Receipt ID: ${newBooking.id} &middot; ${new Date().toLocaleDateString()}</p>
                    <h3>Booking Confirmation</h3>
                    <p>Dear ${booking_req.firstName} ${booking_req.lastName},</p>
                    <p>Thank you for booking with us. Here are your booking details:</p>
                    <ul>
                        <li>Hotel ID: ${booking_req.hotelID}</li>
                        <li>Destination ID: ${booking_req.destID}</li>
                        <li>Special Requests: ${booking_req.special_req}</li>
                    </ul>
                    <p>We look forward to hosting you!</p>
                    <p>Best regards,<br>HotelBooking.com</p>
                </div>
            `
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

//stripe getting clientSecret to handle paymentIntent( for a single transaction object )
router.post('/checkout', async function(req,res,next){

    const paymentIntent=await stripe.paymentIntents.create({
        currency:"sgd",
        amount:2000,//put this first based on actual hotel price
        automatic_payment_methods:{
            enabled:true,
        },
    });

    res.send({clientSecret:paymentIntent.client_secret});
  
  });
module.exports = router;