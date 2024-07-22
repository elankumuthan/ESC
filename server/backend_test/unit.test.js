const { booking , sequelize } = require('../models'); // Adjust import as necessary

beforeAll(async () => {
  //Authenticate and sync models before tests
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Creates tables and resets the database
});

afterAll(async () => {
  //Clean up database and close connection after tests
  await sequelize.sync({ force: true });
  await sequelize.close(); // Close database connection
});

describe("model unit test-suite",()=>{

    test("all data in correct format", async()=>{
        
        const valid_test= {
            firstName: "test",
            lastName: "one",
            phoneNo: "84572662",
            email: "glendakoh88@gmail.com",
            special_req: "help",
            hotelID: "test_id",
            destID: "test_dest_id",
        };
        const newBooking = await booking.create(valid_test); //creating the booking
        expect(newBooking.toJSON()).toMatchObject(valid_test);

        


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
    
        try {
          await booking.create(null_test); // Attempt to create booking with invalid data
          // If we get here, it means the error was not thrown as expected
          throw new Error('Expected validation error was not thrown.');
        } catch (error) {
          // Check if the error is a Sequelize validation error
          expect(error.name).toBe('SequelizeValidationError');
        }
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
    
        try {
          await booking.create(invalid_test); // Attempt to create booking with invalid data
          // If we get here, it means the error was not thrown as expected
          throw new Error('Expected validation error was not thrown.');
        } catch (error) {
          // Check if the error is a Sequelize validation error
          expect(error.name).toBe('SequelizeValidationError');
        }
      });

});
