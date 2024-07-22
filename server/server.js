// Declarations
const express = require('express');
const app = express();
const db = require("./models");

// Cross origin resource sharing (CORS) for authorized resource sharing with external third parties
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Routing

// Test
const testingRouter = require('./routes/tests.js');
app.use("/test", testingRouter);

// Creating booking
const createBookingRouter = require('./routes/bookings.js');
app.use("/booking", createBookingRouter);

// API
const hotelAPIRouter = require('./routes/hotelapi.js');
app.use("/api/hotels", hotelAPIRouter);

db.sequelize.sync().then(() => {
    app.listen(3004, () => {
        console.log('server running on port 3004: http://localhost:3004');
    });
});