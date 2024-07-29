// Imports
import React, { useState, useEffect } from 'react';
import '../Styles/HotelList.css';  // Import the CSS file
import { useNavigate, useLocation } from "react-router-dom";
import FilterComponent from './FilterComponent';  // Import the filter component
import PaginationComponent from './PaginationComponent';  // Import the pagination component

// Define the HotelList component
const HotelList = ({ hotels, hotelPrices, currentImageIndices, setCurrentImageIndices, setHoveredHotelId, hoveredHotelId }) => {
    const validHotels = Array.isArray(hotels) ? hotels : [];
    const [selectedRating, setSelectedRating] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 18; // Number of hotels to display per page

    // URL Param Parsing
    const navigate = useNavigate(); // For navigating to other pages
    const location = useLocation(); // For getting the params from URL
    const searchParams = new URLSearchParams(location.search);
    const destinationId = searchParams.get('destination_id');
    let startDate = searchParams.get('start_date');
    let endDate = searchParams.get('end_date');
    const guests = searchParams.get('guests') ? JSON.parse(searchParams.get('guests')) : null;

    // Format the dates to YYYY-MM-DD if they are not already
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Formatting the dates
    if (startDate) startDate = formatDate(startDate);
    if (endDate) endDate = formatDate(endDate);

    // Image Handling 
    const nextImage = (event, hotelId) => {
        event.stopPropagation();
        const hotel = validHotels.find(hotel => hotel.id === hotelId);
        if (hotel) {
            const nextIndex = (currentImageIndices[hotelId] + 1) % hotel.image_details.count;
            setCurrentImageIndices({
                ...currentImageIndices,
                [hotelId]: nextIndex,
            });
        }
    };

    const previousImage = (event, hotelId) => {
        event.stopPropagation();
        const hotel = validHotels.find(hotel => hotel.id === hotelId);
        if (hotel) {
            const previousIndex = (currentImageIndices[hotelId] - 1 + hotel.image_details.count) % hotel.image_details.count;
            setCurrentImageIndices({
                ...currentImageIndices,
                [hotelId]: previousIndex,
            });
        }
    };

    // Filter hotels based on selected rating
    const filteredHotels = validHotels.filter(hotel => {
        return selectedRating ? hotel.rating === selectedRating : true;
    });

    // Sort filtered hotels by price availability
    const sortedHotels = filteredHotels.sort((a, b) => {
        const priceA = hotelPrices[a.id];
        const priceB = hotelPrices[b.id];
        if (priceA && !priceB) return -1; // Hotels with prices first
        if (!priceA && priceB) return 1;  // Hotels without prices last
        return 0; // Preserve original order if both have or don't have prices
    });

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRating]);

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * hotelsPerPage;
    const endIndex = startIndex + hotelsPerPage;

    // Paginate the sorted hotels
    const paginatedHotels = sortedHotels.slice(startIndex, endIndex);

    // Determine if pagination should be shown
    const shouldShowPagination = sortedHotels.length > hotelsPerPage;

    // Handle page changes
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleHotelClick = (event, hotelId, hotelName) => {
        if (event.target.className.includes('hotel-image')) {
            navigate(`/hoteldetails`, {
                state: {
                    hotelId,
                    startDate,
                    endDate,
                    guests,
                    destinationId,
                    hotelName
                }
            });
        }
    };

    return (
        <div>
            <FilterComponent selectedRating={selectedRating} setSelectedRating={setSelectedRating} />
            <div className="hotel-grid">
                {paginatedHotels.map(hotel => (
                    <div key={hotel.id} onClick={(event) => handleHotelClick(event, hotel.id, hotel.name)}>
                        <div
                            className="hotel-item"
                            onMouseEnter={() => setHoveredHotelId(hotel.id)}
                            onMouseLeave={() => setHoveredHotelId(null)}
                        >
                            {hotel.image_details.count > 0 && (
                                <div className="image-container">
                                    <img
                                        src={`https://d2ey9sqrvkqdfs.cloudfront.net/${hotel.id}/${currentImageIndices[hotel.id]}.jpg`}
                                        alt={hotel.name}
                                        className="hotel-image"
                                    />
                                    <div className="slideshow-controls">
                                        <button className="prev" onClick={(event) => previousImage(event, hotel.id)}>&#10094;</button>
                                        <button className="next" onClick={(event) => nextImage(event, hotel.id)}>&#10095;</button>
                                    </div>
                                </div>
                            )}
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
                                    {hotelPrices[hotel.id] ? <strong>{`$${hotelPrices[hotel.id]}`}</strong> : 'Hotel not available for selected dates'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {shouldShowPagination && (
                <PaginationComponent
                    count={Math.ceil(sortedHotels.length / hotelsPerPage)}
                    page={currentPage}
                    handleChange={(event, value) => handlePageChange(event, value)}
                />
            )}
        </div>
    );
};

export default HotelList;