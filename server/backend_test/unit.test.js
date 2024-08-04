const { booking, sequelize } = require('../models'); // Adjust import as necessary
const EmailBoundary = require('../api boundary/boundary.js')

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


//create() test suite 
describe("create() test-suite", () => {

  test("all data in correct format", async () => {

    const valid_test = {

      firstName: "test",
      lastName: "one",
      phoneNo: "84572662",
      email: "glendakoh88@gmail.com",
      special_req: "help",
      hotelID: "test_id",
      destID: "test_dest_id",
      hotelName: "guest",
      startDate: "2024-01-10",
      endDate: "2024-01-10",
      roomType: "trial",
      guestDetails: "trial",
      price: "1000",
      payeeID: "4242",

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
      hotelName: "guest",
      startDate: "2024-01-10",
      endDate: "2024-01-10",
      roomType: "trial",
      guestDetails: "trial",
      price: "1000",
      payeeID: "4242",

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

});


//sendEmail() test-suite 
describe("sendEmail() test-suite", () => {

  test("sendEmail() with valid email", async () => {

    const valid_booking_req_test = {

      firstName: "unit",
      lastName: "test",
      phoneNo: "84572662",
      email: "glendakoh88@gmail.com",
      special_req: "help",
      hotelID: "test_id",
      destID: "test_dest_id",
      hotelName: "guest",
      startDate: "2024-01-10",
      endDate: "2024-01-10",
      roomType: "trial",
      guestDetails: "trial",
      price: "1000",
      payeeID: "4242",

    };

    const result = await EmailBoundary.sendEmail(valid_booking_req_test, bookingId = 1); //passing requst information to function that calls email api
    console.log(result);

    expect(result).toContain('OK');




  });

  test("expect sendEmail() with invalid email to fail", async () => {
    const invalid_email_test = {
      firstName: "a", // Should fail
      lastName: "one",
      phoneNo: "+6584572662",
      email: "invalid-email",
      special_req: "help",
      hotelID: "test_id",
      destID: "test_dest_id",
      hotelName: "guest",
      startDate: "2024-01-10",
      endDate: "2024-01-10",
      roomType: "trial",
      guestDetails: "trial",
      price: "1000",
      payeeID: "4242",

    };
    await expect(EmailBoundary.sendEmail(invalid_email_test, bookingId = 2)).rejects.toThrow()
  });

});