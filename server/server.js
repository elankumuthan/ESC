//declarations
const express = require('express');
const app = express();
const db = require("./models");

//cross origin resource sharing (CORS) for for authorized resource sharing with external third partie
const cors = require("cors");

app.use(express.json())
app.use(cors());

//Routing

//test
const testingRouter = require('./routes/tests.js')
app.use("/test", testingRouter);

//creating booking
const createBookinggRouter = require('./routes/bookings.js')
app.use("/booking", createBookinggRouter);

//api
const hotelAPIRouter = require('./routes/hotelapi.js')
app.use("/api/hotels", hotelAPIRouter);

let server;

db.sequelize.sync().then(() =>{
   server = app.listen(3004, () =>{
        console.log('server running on port 3004: http://localhost:3004');
    });

});

const shutdown = () => {
    if (server) {
        server.close(() => {
            db.sequelize.close();
        });
    }
};

module.exports = { app, shutdown };
