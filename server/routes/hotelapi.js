// Desc: This file contains the route for the hotelapi endpoint
const express = require("express");
const router=require("express").Router();


//Get request to the hotelapi endpoint
router.get("/", async (req, res) => {
    
    //receiving the destID from the front end
    const destinationId = req.query.destination_id;
    
    //fetching the data from the Ascenda's endpoint --> hotel list based on the destination ID
    try {
        const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`);//query the Ascenda's endpoint 
        const text = await response.text(); // Get the response as text
        try {
            const data = JSON.parse(text); // Try to parse the text as JSON
            res.json(data); // Send the parsed JSON data to the client
        } catch (jsonError) {
            console.error('Error parsing JSON:', text); // Log the response text
            res.status(500).send('Error parsing JSON from upstream server');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from upstream server');
    }
});

module.exports = router;