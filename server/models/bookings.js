const { DataTypes } = require("sequelize");

module.exports = (sequalize, DataTypes) => {
    const testing = sequalize.define(
        "booking", 
        {
            firstName:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNo:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            email:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            special_req:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            hotelID:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            destID:{
                type: DataTypes.STRING,
                allowNull: false,
            }
        }
    );
    return testing;
};