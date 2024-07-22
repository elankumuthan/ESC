import React from 'react';
import '../Styles/HotelList.css';  // Import the CSS file

const HotelList = ({ hotels, hotelPrices, currentImageIndices, setCurrentImageIndices, setHoveredHotelId, hoveredHotelId }) => {
    const validHotels = Array.isArray(hotels) ? hotels : [];

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

    return (
        <div className="hotel-grid">
            {hotelsWithImages.map(hotel => (
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
            ))}
            {hotelsWithoutImages.map(hotel => (
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
            ))}
        </div>
    );
};

export default HotelList;