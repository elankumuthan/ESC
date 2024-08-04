// Desc: This file contains the routes for the hotelapi endpoint
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Get request to fetch hotel list based on the destination ID
router.get("/", async (req, res) => {
    // Receiving the destID from the front end
    const destinationId = req.query.destination_id;

    // Fetching the data from Ascenda's endpoint --> hotel list based on the destination ID
    try {
        const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`);
        res.json(response.data); // Send the JSON data to the client
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from upstream server');
    }
});

// Get request to fetch hotel price details based on the hotel ID and other parameters
router.get("/:hotelId/price", async (req, res) => {
    const { hotelId } = req.params;
    const { destination_id, checkin, checkout, lang, currency, country_code, guests, partner_id } = req.query;

    const apiUrl = `https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price?destination_id=${destination_id}&checkin=${checkin}&checkout=${checkout}&lang=${lang}&currency=${currency}&country_code=${country_code}&guests=${guests}&partner_id=${partner_id}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching room details:', error);
        res.status(error.response?.status || 500).json({ message: 'Error fetching room details' });
    }
});

// Get request to fetch hotel details based on the hotel ID
router.get('/:hotelId', async (req, res) => {
    const { hotelId } = req.params;

    // External API URL to fetch hotel details
    const apiUrl = `https://hotelapi.loyalty.dev/api/hotels/${hotelId}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(error.response?.status || 500).json({ message: 'Error fetching hotel details' });
    }
});

module.exports = router;
