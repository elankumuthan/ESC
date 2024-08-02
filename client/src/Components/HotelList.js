import React, { useState, useEffect } from 'react';
import '../Styles/HotelList.css';
import { useNavigate, useLocation } from "react-router-dom";
import FilterComponent from './FilterComponent';
import PaginationComponent from './PaginationComponent';
import HotelMap from './HotelMap'; // Import the HotelMap component

const HotelList = ({ hotels, hotelPrices, currentImageIndices, setCurrentImageIndices, setHoveredHotelId, hoveredHotelId }) => {
    const validHotels = Array.isArray(hotels) ? hotels : [];
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedScore, setSelectedScore] = useState([0, 100]);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 18;

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const destinationId = searchParams.get('destination_id');
    let startDate = searchParams.get('start_date');
    let endDate = searchParams.get('end_date');
    const guests = searchParams.get('guests') ? JSON.parse(searchParams.get('guests')) : null;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (startDate) startDate = formatDate(startDate);
    if (endDate) endDate = formatDate(endDate);

    const defaultImage = "https://cdn.pixabay.com/photo/2012/11/21/10/24/building-66789_1280.jpg";

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

    const filteredHotels = validHotels.filter(hotel => {
        const hasTrustYouScore = hotel.trustyou && hotel.trustyou.score && hotel.trustyou.score.overall;
        return (
            (selectedRating ? hotel.rating === selectedRating : true) &&
            (hasTrustYouScore ? hotel.trustyou.score.overall >= selectedScore[0] && hotel.trustyou.score.overall <= selectedScore[1] : true)
        );
    });

    const sortedHotels = filteredHotels.sort((a, b) => {
        const priceA = hotelPrices[a.id];
        const priceB = hotelPrices[b.id];
        if (priceA && !priceB) return -1;
        if (!priceA && priceB) return 1;
        return 0;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRating, selectedScore]);

    const startIndex = (currentPage - 1) * hotelsPerPage;
    const endIndex = startIndex + hotelsPerPage;
    const paginatedHotels = sortedHotels.slice(startIndex, endIndex);

    const shouldShowPagination = sortedHotels.length > hotelsPerPage;

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
        <div className="hotel-list-page">
            <div className="filters-and-sort">
                <FilterComponent
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                    selectedScore={selectedScore}
                    setSelectedScore={setSelectedScore}
                    resetFilter={() => {
                        setSelectedRating(null);
                        setSelectedScore([0, 100]);
                    }}
                    setPage={setCurrentPage}
                />
                <button className="sort-button">SORT</button>
                <button class="filter-button">FILTER</button>
            </div>
            <div className="hotel-grid">
                {paginatedHotels.map(hotel => (
                    <div key={hotel.id} onClick={(event) => handleHotelClick(event, hotel.id, hotel.name)}>
                        <div
                            className="hotel-item"
                            onMouseEnter={() => setHoveredHotelId(hotel.id)}
                            onMouseLeave={() => setHoveredHotelId(null)}
                        >
                            <div className="image-container">
                                <img
                                    src={hotel.image_details.count > 0
                                        ? `https://d2ey9sqrvkqdfs.cloudfront.net/${hotel.id}/${currentImageIndices[hotel.id] || 0}.jpg`
                                        : defaultImage
                                    }
                                    alt={hotel.name}
                                    className="hotel-image"
                                    onError={(e) => e.target.src = defaultImage}
                                />
                                {hoveredHotelId === hotel.id && (
                                    <div className="speech-bubble">
                                        <ul>
                                            <li>Solo: {hotel.trustyou.score.solo ?? 'N/A'} | Couple: {hotel.trustyou.score.couple ?? 'N/A'} | Family: {hotel.trustyou.score.family ?? 'N/A'} | Business: {hotel.trustyou.score.business ?? 'N/A'}</li>
                                        </ul>
                                    </div>
                                )}
                                {hotel.image_details.count > 0 && (
                                    <div className="slideshow-controls">
                                        <button className="prev" onClick={(event) => previousImage(event, hotel.id)}>&#10094;</button>
                                        <button className="next" onClick={(event) => nextImage(event, hotel.id)}>&#10095;</button>
                                    </div>
                                )}
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
                                    {hotelPrices[hotel.id] ? <strong>{`$${hotelPrices[hotel.id]}`}</strong> : 'Hotel not available for selected dates'}
                                </p>
                                {hotelPrices[hotel.id] && hotel.trustyou && hotel.trustyou.score && (
                                    <p className="trustyou-score">
                                        <strong>TrustYou Score: {hotel.trustyou.score.overall ?? 'NIL'}</strong>
                                    </p>
                                )}
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
            {/* Include the HotelMap component and pass the paginatedHotels */}
            <div className="hotel-map-container">
                <HotelMap hotels={paginatedHotels} hoveredHotelId={hoveredHotelId} setHoveredHotelId={setHoveredHotelId} />
            </div>
        </div>
    );
};

export default HotelList;
