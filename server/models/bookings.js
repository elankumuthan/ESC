const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Booking = sequelize.define(
        "booking", 
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "First name cannot be null"
                    },
                    notEmpty: {
                        msg: "First name cannot be empty"
                    },
                    is: {
                        args: /^[a-zA-Z\s]+$/,
                        msg: "First name can only contain letters and spaces"
                    }
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Last name cannot be null"
                    },
                    notEmpty: {
                        msg: "Last name cannot be empty"
                    },
                    is: {
                        args: /^[a-zA-Z\s]+$/,
                        msg: "Last name can only contain letters and spaces"
                    }
                }
            },
            phoneNo: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Phone number cannot be null"
                    },
                    notEmpty: {
                        msg: "Phone number cannot be empty"
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Email cannot be null"
                    },
                    notEmpty: {
                        msg: "Email cannot be empty"
                    },
                    isEmail: {
                        msg: "Email must be a valid email address"
                    }
                }
            },
            special_req: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    is: {
                        args: /^[a-zA-Z0-9\s]*$/,
                        msg: "Special requests can only contain letters, numbers, and spaces"
                    }
                }
            },
            hotelID: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Hotel ID cannot be null"
                    },
                    notEmpty: {
                        msg: "Hotel ID cannot be empty"
                    }
                }
            },
            destID: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Destination ID cannot be null"
                    },
                    notEmpty: {
                        msg: "Destination ID cannot be empty"
                    }
                }
            },
            hotelName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Hotel name cannot be null"
                    },
                    notEmpty: {
                        msg: "Hotel name cannot be empty"
                    }
                }
            },
            startDate: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Start date cannot be null"
                    },
                    notEmpty: {
                        msg: "Start date cannot be empty"
                    }
                }
            },
            endDate: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "End date cannot be null"
                    },
                    notEmpty: {
                        msg: "End date cannot be empty"
                    }
                }
            },
            roomType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Room type cannot be null"
                    },
                    notEmpty: {
                        msg: "Room type cannot be empty"
                    }
                }
            },
            guestDetails: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Guest details cannot be null"
                    },
                    notEmpty: {
                        msg: "Guest details cannot be empty"
                    }
                }
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Price cannot be null"
                    },
                    notEmpty: {
                        msg: "Price cannot be empty"
                    },
                }
            },
            payeeID: {
                type: DataTypes.STRING,
                allowNull: false, // ensure this matches your requirements
                validate: {
                    notNull: {
                        msg: "Payee ID cannot be null"
                    },
                    notEmpty: {
                        msg: "Payee ID cannot be empty"
                    }
                }
            }
        }
    );
    return Booking;
};
