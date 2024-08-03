//copied code of updateDB function in Booking.js for ease of integration testing for backend 

import axios from "axios";

async function updateDB(data){
    //mock navigate
    //mock payeeID
    //mock state
    const test_payeeID = "pm_1PjXrWBQYdvRSbbU2jFqDWYu";
    data.payeeID = test_payeeID;
    try {
        const res=await axios.post("http://localhost:3004/booking", data);
        console.log(`Data added!`);
        //added for testing
        return res;

    } catch (error) {
        console.error('Error booking the hotel!', error);
        throw error;
    } 
    
};

export default updateDB;



