// Declarations
const express = require('express');
const app = express();
const db = require("./models");

// Cross origin resource sharing (CORS) for authorized resource sharing with external third parties
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

// Routing

// Creating booking
const createBookingRouter = require('./routes/bookings.js');
app.use("/booking", createBookingRouter);

// API to call for hotel data
const hotelAPIRouter = require('./routes/hotelapi.js');
app.use("/api/hotels", hotelAPIRouter);

// Syncing the database and starting the server
db.sequelize.sync().then(() => {
    app.listen(3004, () => {
        console.log('server running on port 3004: http://localhost:3004');
    });
});