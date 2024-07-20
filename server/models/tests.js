const { DataTypes } = require("sequelize");

module.exports = (sequalize, DataTypes) => {
    const testing = sequalize.define(
        "test", 
        {
            testString:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            testString2:{
                type: DataTypes.STRING,
                allowNull: false,
            }
        }
    );
    return testing;
};