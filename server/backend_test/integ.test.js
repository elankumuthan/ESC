const {booking,sequelize } = require('../models');
const request = require('supertest')
const {app,shutdown} = require('../server');

beforeAll(async () => {
    //Authenticate and sync models before tests
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Creates tables and resets the database
  });
  
  afterAll(async () => {
    //Clean up database and close connection after tests
    await sequelize.sync({ force: true });
    await sequelize.close(); // Close database connection
    shutdown(); // Shut down the server
  });


describe("UC5 integration test-suite",()=>{

    test("testing POST /bookings", async()=>{
        const valid_test= {
            firstName: "last",
            lastName: "one",
            phoneNo: "84572662",
            email: "glendakoh88@gmail.com",
            special_req: "help",
            hotelID: "test_id",
            destID: "test_dest_id",
        };
        const res = await request(app)
      .post('/booking') // Correct route
      .send(valid_test)
      .set('Content-Type', 'application/json');
        expect(res.text).toBe("SUCCESS!!");


        const lastBooking = await booking.findOne({
            order: [['createdAt', 'DESC']],
          });
      
          // Convert to JSON and compare
          expect(lastBooking.toJSON()).toMatchObject(valid_test);

    });

    test("inserting NULL values into NOT NULL fields should fail", async () => {
        const null_test = {
          firstName: null, // Should fail
          lastName: "one",
          phoneNo: null,
          email: "glendakoh88@gmail.com",
          special_req: "help",
          hotelID: "test_id",
          destID: "test_dest_id",
        };
        const res = await request(app)
      .post('/booking') // Correct route
      .send(null_test)
      .set('Content-Type', 'application/json');
      
      expect(res.status).toBe(500); // Expect server error status
      expect(res.body).toHaveProperty('error', 'Failed to create booking.'); // Expect specific error message
  
      });

      test("inserting int values into fields expecting string should fail", async () => {
        const invalid_test = {
          firstName: 12345678,//should fail
          lastName: "one",
          phoneNo: "12345678",
          email: "glendakoh88@gmail.com",
          special_req: "help",
          hotelID: "test_id",
          destID: "test_dest_id",
        };
        const res = await request(app)
      .post('/booking') // Correct route
      .send(invalid_test)
      .set('Content-Type', 'application/json');
      
      expect(res.status).toBe(500); // Expect server error status
      expect(res.body).toHaveProperty('error', 'Failed to create booking.'); // Expect specific error message
  
      });
    

});
