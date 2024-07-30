const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define(
        "booking", 
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^[a-zA-Z\s@#$&]*$/i // Regex to allow alphabetic characters, spaces, and special characters @, #, $, &
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^[a-zA-Z\s@#$&]*$/i // Regex to allow alphabetic characters, spaces, and special characters @, #, $, &
                }
            },
            phoneNo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            special_req: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to true to allow null values
            },
            hotelID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            destID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            hotelName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roomType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            guestDetails: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payeeID: {
                type: DataTypes.STRING,
                allowNull: false, // Changed to true to allow null values
            }
        }
    );
    return Booking;
};
