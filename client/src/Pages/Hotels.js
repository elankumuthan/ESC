import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import HotelList from '../Components/HotelList';  // Import the HotelList component
import HotelMap from '../Components/HotelMap';  // Import the HotelMap component
import PaginationComponent from '../Components/PaginationComponent';  // Import the Pagination component
import SearchBox from '../Components/searchBox';  // Import the SearchBox component
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Define the Hotel component
function Hotels() {
    const [listofHotels, setListofHotels] = useState([]);
    const [hotelPrices, setHotelPrices] = useState({});
    const [currentImageIndices, setCurrentImageIndices] = useState({});
    const [hoveredHotelId, setHoveredHotelId] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null); // State for selected rating
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [hotelsPerPage] = useState(18); // Number of hotels per page

    const location = useLocation(); // For getting the params from URL
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        // URL Param Parsing
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

        // Formatting the dates
        if (startDate) startDate = formatDate(startDate);
        if (endDate) endDate = formatDate(endDate);

        // Calculate total number of guests
        const totalGuests = guests ? (guests.adults + guests.children) : 0;

        // Fetch list of hotels depending on the destinationID
        if (destinationId) {
            // Fetch hotel data from backend
            axios.get(`http://localhost:3004/api/hotels`, {
                params: { destination_id: destinationId }
            })
            .then(response => {
                const hotels = response.data;
                setListofHotels(hotels);
                const initialImageIndices = {};
                hotels.forEach(hotel => {
                    initialImageIndices[hotel.id] = 0;
                });
                setCurrentImageIndices(initialImageIndices);

                // Fetch hotel prices after fetching the hotel list
                return axios.get(`http://localhost:3004/api/hotel-prices`, {
                    params: {
                        destination_id: destinationId,
                        checkin: startDate,
                        checkout: endDate,
                        guests: totalGuests  // Pass total guests as a single number
                    }
                });
            })
            .then(response => {
                console.log('API Response:', response.data); // Debug API response
                const prices = response.data.hotels.reduce((acc, hotel) => {
                    acc[hotel.id] = hotel.price ? hotel.price : 'Price not available';  // Extract the price from the API response
                    return acc;
                }, {});
                console.log('Prices:', prices); // Debug extracted prices
                setHotelPrices(prices);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    console.error("Error status:", error.response.status);
                    console.error("Error headers:", error.response.headers);
                } else if (error.request) {
                    console.error("Error request:", error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            });
        }
    }, [location.search]);

    const handleHotelClick = (hotelId) => {
        const searchParams = new URLSearchParams(location.search);
        const destinationId = searchParams.get('destination_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const guests = searchParams.get('guests') ? JSON.parse(searchParams.get('guests')) : null;

        // Debug logging
        console.log('Navigating with params:', {
            hotelId,
            destinationId,
            startDate,
            endDate,
            guests
        });

        if (destinationId && startDate && endDate && guests) {
            navigate('/hoteldetails', {
                state: {
                    hotelId,
                    destinationId,
                    checkinDate: startDate,
                    checkoutDate: endDate,
                    numberOfGuests: guests,
                    hotelName: "The Forest by Wangz" // Assuming you want to pass the hotel name as well
                }
            });
        } else {
            console.error("Missing required parameters for navigation.");
        }
    };

    // Filter hotels based on selected rating and search query
    const filteredHotels = listofHotels.filter(hotel => {
        const matchesRating = selectedRating ? hotel.rating === selectedRating : true;
        const matchesSearchQuery = hotel.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRating && matchesSearchQuery;
    });

    // Sort filtered hotels by price availability
    const sortedHotels = filteredHotels.sort((a, b) => {
        const priceA = hotelPrices[a.id];
        const priceB = hotelPrices[b.id];
        if (priceA && !priceB) return -1; // Hotels with prices first
        if (!priceA && priceB) return 1;  // Hotels without prices last
        return 0; // Preserve original order if both have or don't have prices
    });

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * hotelsPerPage;
    const endIndex = startIndex + hotelsPerPage;

    // Paginate the sorted hotels
    const paginatedHotels = sortedHotels.slice(startIndex, endIndex);

    // Determine if pagination should be shown
    const shouldShowPagination = sortedHotels.length > hotelsPerPage;

    // Handle page changes
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Adjust map scroll when the footer appears
    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('.footer-section');
            const mapContainer = document.querySelector('.hotel-map-container');
            if (footer && mapContainer) {
                const footerTop = footer.getBoundingClientRect().top;
                const mapBottom = mapContainer.getBoundingClientRect().bottom;
                if (mapBottom > footerTop) {
                    const scrollAmount = mapBottom - footerTop;
                    mapContainer.style.marginBottom = `${scrollAmount}px`;
                } else {
                    mapContainer.style.marginBottom = '0px';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="hotels-page">
            <div className="fixed-header">
                <Navbar />
                <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Added SearchBox component */}
            </div>
            <div className="content" style={{ flex: 1, display: 'flex' }}>
                {/* Hotels container */}
                <div className="hotel-list-container" style={{ flex: 1 }} >
                    <HotelList
                        hotels={paginatedHotels}
                        handleHotelClick={handleHotelClick} // Add this line
                        hotelPrices={hotelPrices} // Pass hotel prices to HotelList
                        currentImageIndices={currentImageIndices}
                        setCurrentImageIndices={setCurrentImageIndices}
                        setHoveredHotelId={setHoveredHotelId}
                        hoveredHotelId={hoveredHotelId}
                        selectedRating={selectedRating} // Pass selectedRating to HotelList
                        setSelectedRating={setSelectedRating} // Pass setSelectedRating to HotelList
                    />
                    {shouldShowPagination && (
                        <PaginationComponent
                            count={Math.ceil(sortedHotels.length / hotelsPerPage)}
                            page={currentPage}
                            handleChange={handlePageChange}
                        />
                    )}
                </div>

                {/* Google Map display container */}
                <div className="hotel-map-container" style={{ flex: 1 }}>
                    <HotelMap
                        hotels={paginatedHotels}
                        hoveredHotelId={hoveredHotelId}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Hotels;