const express = require("express");
const router=require("express").Router();
const {booking} = require("../models") //booking refers to the table name 


router.get("/", async (req, res) => {
    const listofbookings = await booking.findAll();
    res.json(listofbookings);
})
router.post("/", async (req, res) => {
    try {
        const booking_req = req.body; //the json formate i called body
        const newBooking = await booking.create(booking_req); //creating the booking
        res.send("SUCCESS!!"); // display if success 
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking.' });
    }
});

module.exports = router;