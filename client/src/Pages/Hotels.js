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

    let location = useLocation(); // For getting the params from URL
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        // URL Param Parsing
        const searchParams = new URLSearchParams(location.search);
        const destinationId = searchParams.get('destination_id');
        let startDate = searchParams.get('start_date');
        let endDate = searchParams.get('end_date');
        const guests = searchParams.get('guests') ? JSON.parse(searchParams.get('guests')) : null;

        // For testing
        //console.log('Received Params:', { destinationId, startDate, endDate, guests }); 

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

        // Fetch list of hotels depending on the destinationID
        if (destinationId) {
            // Fetch hotel data from backend
            axios.get(`http://localhost:3004/api/hotels?destination_id=${destinationId}`)
                .then((response) => {
                    const hotels = response.data;
                    setListofHotels(hotels);
                    const initialImageIndices = {};
                    hotels.forEach(hotel => {
                        initialImageIndices[hotel.id] = 0;
                    });
                    setCurrentImageIndices(initialImageIndices);
                })
                .catch(error => console.error("Error fetching hotels:", error));

            // Fetch hotel prices
            axios.get(`https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=${destinationId}&checkin=${startDate}&checkout=${endDate}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}&partner_id=1`)
                .then((response) => {
                    //console.log('API Response:', response.data); // Debug API response
                    const prices = response.data.hotels.reduce((acc, hotel) => {
                        acc[hotel.id] = hotel.price;  // Extract the price from the API response
                        return acc;
                    }, {});
                    //console.log('Prices:', prices); // Debug extracted prices
                    setHotelPrices(prices);
                })
                .catch(error => console.error("Error fetching hotel prices:", error));
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

    // Get current hotels for the page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
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
                        hotels={currentHotels}
                        handleHotelClick={handleHotelClick} // Add this line
                        hotelPrices={hotelPrices} // Pass hotel prices to HotelList
                        currentImageIndices={currentImageIndices}
                        setCurrentImageIndices={setCurrentImageIndices}
                        setHoveredHotelId={setHoveredHotelId}
                        hoveredHotelId={hoveredHotelId}
                        selectedRating={selectedRating} // Pass selectedRating to HotelList
                        setSelectedRating={setSelectedRating} // Pass setSelectedRating to HotelList
                    />
                    <PaginationComponent
                        count={Math.ceil(filteredHotels.length / hotelsPerPage)}
                        page={currentPage}
                        handleChange={handlePageChange}
                    />
                </div>

                {/* Google Map display container */}
                <div className="hotel-map-container" style={{ flex: 1 }}>
                    <HotelMap
                        hotels={currentHotels}
                        hoveredHotelId={hoveredHotelId}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Hotels;