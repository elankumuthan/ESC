import updateDB from "../src/mock_test_functions/updateDB";

// Mock the axios module
//jest.mock("axios");

describe("Integration Test calling backend to create a booking", () => {
    test("updateDB(valid_data)", async () => {
        // Define valid test data
        const valid_data = {
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

        // Call updateDB with valid data
        const result = await updateDB(valid_data);

        // Assertions
        expect(result.status).toBe(200);
        expect(result.data).toBe('SUCCESS!! Booking confirmed and email sent.');
    });

    test("updateDB(invalid_email), booking should fail! ", async () => {
        // Define valid test data
        const invalid_data = {
            firstName: "test",
            lastName: "one",
            phoneNo: "84572662",
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

        await expect(updateDB(invalid_data)).rejects.toThrow();
    });
});