import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Hotels() {
    const [listofHotels, setListofHotels] = useState([]);
    let navigate = useNavigate(); //for navigating to other page
    let location = useLocation(); //for getting the parms from URL

    useEffect(() => {

        //parsing the received parms into respective fields 
        const searchParams = new URLSearchParams(location.search);
        const destinationId = searchParams.get('destination_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const guests = searchParams.get('guests') ? JSON.parse(searchParams.get('guests')) : null;

        //console.log('Received Params:', { destinationId, startDate, endDate, guests }); //for testing

        if (destinationId) {
            //sending an API req to the backend 
            axios.get(`http://localhost:3004/api/hotels?destination_id=${destinationId}`)
                .then((response) => {
                    setListofHotels(response.data);
                })
                .catch(error => console.error("Error fetching hotels:", error));
        }
    }, [location.search]);

    return (
        <>
            <h1>LIST OF HOTELS</h1>
            {listofHotels.map((value) => {
                return (
                    <div 
                        key={value.id} 
                        onClick={() => navigate(`/hoteldetails/${value.id}`, { state: { startDate: new URLSearchParams(location.search).get('start_date'), endDate: new URLSearchParams(location.search).get('end_date'), guests: JSON.parse(new URLSearchParams(location.search).get('guests')), destinationId: new URLSearchParams(location.search).get('destination_id') } })}
                    >
                        {value.name}
                    </div>
                );
            })}
        </>
    );
}

export default Hotels;
