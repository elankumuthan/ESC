const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./models"); // Assuming you have Sequelize models set up

app.use(express.json());
app.use(cors());

// Import routes
const createBookingRouter = require('./routes/bookings.js');
const hotelAPIRouter = require('./routes/hotelapi.js');
const hotelPricesRouter = require('./routes/hotelPrices.js');

// Use routes
app.use("/booking", createBookingRouter);
app.use("/api/hotels", hotelAPIRouter);
app.use("/api", hotelPricesRouter); // Ensure the base route is /api

// Sync database and start server
db.sequelize.sync().then(() => {
    app.listen(3004, () => {
        console.log('server running on port 3004: http://localhost:3004');
    });
});