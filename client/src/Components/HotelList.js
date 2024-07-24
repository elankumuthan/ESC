// Imports
import React from 'react';
import '../Styles/HotelList.css';  // Import the CSS file
import { useNavigate, useLocation } from "react-router-dom";

// Define the HotelList component
const HotelList = ({ hotels, hotelPrices, currentImageIndices, setCurrentImageIndices, setHoveredHotelId, hoveredHotelId }) => {
    const validHotels = Array.isArray(hotels) ? hotels : [];

    //URL Parm Pharsing
    let navigate = useNavigate(); // For navigating to other pages
    let location = useLocation(); // For getting the params from URL
    const searchParams = new URLSearchParams(location.search);
    const destinationId = searchParams.get('destination_id');
    let startDate = searchParams.get('start_date');
    let endDate = searchParams.get('end_date');
    const guests = searchParams.get('guests') ? JSON.parse(searchParams.get('guests')) : null;

    // For testing
    console.log('Received Params:', { destinationId, startDate, endDate, guests }); 

    // Format the dates to YYYY-MM-DD if they are not already
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //Formating the dates
    if (startDate) startDate = formatDate(startDate);
    if (endDate) endDate = formatDate(endDate);


    //Image Handling 
    const nextImage = (hotelId) => {
        const hotel = validHotels.find(hotel => hotel.id === hotelId);
        if (hotel) {
            const nextIndex = (currentImageIndices[hotelId] + 1) % hotel.image_details.count;
            setCurrentImageIndices({
                ...currentImageIndices,
                [hotelId]: nextIndex,
            });
        }
    };

    const previousImage = (hotelId) => {
        const hotel = validHotels.find(hotel => hotel.id === hotelId);
        if (hotel) {
            const previousIndex = (currentImageIndices[hotelId] - 1 + hotel.image_details.count) % hotel.image_details.count;
            setCurrentImageIndices({
                ...currentImageIndices,
                [hotelId]: previousIndex,
            });
        }
    };

    const hotelsWithImages = validHotels.filter(hotel => hotel.image_details.count > 0);
    const hotelsWithoutImages = validHotels.filter(hotel => hotel.image_details.count === 0);

    // Return the JSX for the List of Hotels in Grid format
    return (
        <div className="hotel-grid">
            {hotelsWithImages.map(hotel => (
                <div onClick={() => navigate(`/hoteldetails/${hotel.id}`, { state: { startDate: new URLSearchParams(location.search).get('start_date'), endDate: new URLSearchParams(location.search).get('end_date'), guests: JSON.parse(new URLSearchParams(location.search).get('guests')), destinationId: new URLSearchParams(location.search).get('destination_id'), hotelName: hotel.name } })}>
                    <div
                        key={hotel.id}
                        className="hotel-item"
                        onMouseEnter={() => setHoveredHotelId(hotel.id)}
                        onMouseLeave={() => setHoveredHotelId(null)}
                    >
                    <div className="image-container">
                        <img
                            src={`https://d2ey9sqrvkqdfs.cloudfront.net/${hotel.id}/${currentImageIndices[hotel.id]}.jpg`}
                            alt={hotel.name}
                            className="hotel-image"
                        />
                        <div className="slideshow-controls">
                            <button className="prev" onClick={() => previousImage(hotel.id)}>&#10094;</button>
                            <button className="next" onClick={() => nextImage(hotel.id)}>&#10095;</button>
                        </div>
                    </div>
                    <div className="hotel-details">
                        <div className="hotel-name-rating">
                            <h2 className="hotel-name">{hotel.name}</h2>
                            {hotel.rating && (
                                <div className="hotel-rating">
                                    <span className="star">&#9733;</span>
                                    <span>{hotel.rating}</span>
                                </div>
                            )}
                        </div>
                        <p className="price-per-night">
                            {hotelPrices[hotel.id] ? `${hotelPrices[hotel.id]} per night` : 'Price not available'}
                        </p>
                    </div>
                </div>
                </div>
            ))}
            {hotelsWithoutImages.map(hotel => (
                <div onClick={() => navigate(`/hoteldetails/${hotel.id}`, { state: { startDate: new URLSearchParams(location.search).get('start_date'), endDate: new URLSearchParams(location.search).get('end_date'), guests: JSON.parse(new URLSearchParams(location.search).get('guests')), destinationId: new URLSearchParams(location.search).get('destination_id') } })}>
                    <div
                        key={hotel.id}
                        className="hotel-item"
                        onMouseEnter={() => setHoveredHotelId(hotel.id)}
                        onMouseLeave={() => setHoveredHotelId(null)}
                    >
                        <div className="hotel-details">
                            <div className="hotel-name-rating">
                                <h2 className="hotel-name">{hotel.name}</h2>
                                {hotel.rating && (
                                    <div className="hotel-rating">
                                        <span className="star">&#9733;</span>
                                        <span>{hotel.rating}</span>
                                    </div>
                                )}
                            </div>
                            <p className="price-per-night">
                                {hotelPrices[hotel.id] ? `${hotelPrices[hotel.id]} per night` : 'Price not available'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HotelList;