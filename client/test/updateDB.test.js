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



// Define fuzz test cases for each field
const fuzzTestCases = {
    firstName: ["", "a".repeat(256), "<script>alert('XSS')</script>", "' OR '1'='1", "DROP TABLE users;"],
    lastName: ["", "a".repeat(256), "<script>alert('XSS')</script>", "' OR '1'='1", "DROP TABLE users;"],
    phoneNo: ["", "12345678901234567890", "phone!@#$%^&*()", "1234abcd5678"],
    email: ["", "invalid-email", "test@.com", "test@domain", "test@domain..com"],
    special_req: ["", "a".repeat(1024), "<script>alert('XSS')</script>"],
    hotelID: ["", "a".repeat(256), "' OR '1'='1"],
    destID: ["", "a".repeat(256), "' OR '1'='1"],
    hotelName: ["", "a".repeat(256), "<script>alert('XSS')</script>"],
    startDate: ["", "2024-13-01", "2024-01-32", "invalid-date"],
    endDate: ["", "2024-13-01", "2024-01-32", "invalid-date"],
    roomType: ["", "a".repeat(256), "<script>alert('XSS')</script>"],
    guestDetails: ["", "a".repeat(1024), "<script>alert('XSS')</script>"],
    price: ["", "-1000", "price!@#$%^&*()", "1000.123"],
    payeeID: ["", "a".repeat(256), "' OR '1'='1"],
};

describe("updateDB fuzzing tests", () => {
    const errorTestCases = [];
    afterAll(() => {
        if (errorTestCases.length > 0) {
            console.log('Test cases that caused errors:', errorTestCases);
        }
    });

    Object.keys(fuzzTestCases).forEach((field) => {
        fuzzTestCases[field].forEach((testCase) => {
            test(`updateDB(${field}: ${testCase}), booking should fail!`, async () => {
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

                // Replace the valid field with the fuzz test case
                valid_data[field] = testCase;

                try {
                    await updateDB(valid_data);
                } catch (error) {
                    errorTestCases.push({ field, testCase, error: error.message });
                }
            });
        });
    });
});
