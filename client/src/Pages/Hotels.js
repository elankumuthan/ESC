import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import HotelList from '../Components/HotelList';
import HotelMap from '../Components/HotelMap';
import SearchBox from '../Components/searchBox'; // Fixed the import name
import FilterComponent from '../Components/FilterComponent';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SortDialog from '../Components/SortDialog'; // Import the dialog component

function Hotels() {
    const [listofHotels, setListofHotels] = useState([]);
    const [hotelPrices, setHotelPrices] = useState({});
    const [currentImageIndices, setCurrentImageIndices] = useState({});
    const [hoveredHotelId, setHoveredHotelId] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
    const [currentPage, setCurrentPage] = useState(1);
    const [hotelsPerPage] = useState(18);
    const [filterApplied, setFilterApplied] = useState(false);
    const [guestDetails, setGuestDetails] = useState({ adults: 0, children: 0 });
    const [sortOrder, setSortOrder] = useState('default'); // Updated state for sorting order
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
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

        const totalGuests = guests ? (guests.adults + guests.children) : 0;

        // Set guest details
        setGuestDetails(guests || { adults: 0, children: 0 });

        if (destinationId) {
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

                    return axios.get(`http://localhost:3004/api/hotel-prices`, {
                        params: {
                            destination_id: destinationId,
                            checkin: startDate,
                            checkout: endDate,
                            guests: totalGuests
                        }
                    });
                })
                .then(response => {
                    const prices = response.data.hotels.reduce((acc, hotel) => {
                        acc[hotel.id] = hotel.price ? hotel.price : 'Price not available';
                        return acc;
                    }, {});
                    setHotelPrices(prices);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [location.search]);

    useEffect(() => {
        setCurrentPage(1); // Ensure currentPage starts from 1 on mount
    }, []);


    const handleHotelClick = (hotelId) => {
        const searchParams = new URLSearchParams(location.search);
        const destinationId = searchParams.get('destination_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        if (destinationId && startDate && endDate) {
            navigate(`/hoteldetails/${hotelId}`, {
                state: {
                    hotelId,
                    destinationId,
                    checkinDate: startDate,
                    checkoutDate: endDate,
                    numberOfGuests: guestDetails, // Pass guest details here
                    hotelName: "The Forest by Wangz"
                }
            });
        } else {
            console.error("Missing required parameters for navigation.");
        }
    };

    const filteredHotels = listofHotels.filter(hotel => {
        const matchesRating = selectedRating ? hotel.rating === selectedRating : true;
        const matchesSearchQuery = hotel.name.toLowerCase().includes(searchQuery.toLowerCase());
        const hotelPrice = hotelPrices[hotel.id] || 0;
        const matchesPrice = hotelPrice >= priceRange[0] && hotelPrice <= priceRange[1];
        return matchesRating && matchesSearchQuery && matchesPrice;
    });

    const sortedHotels = filteredHotels.sort((a, b) => {
        const priceA = hotelPrices[a.id] || 0;
        const priceB = hotelPrices[b.id] || 0;
        if (sortOrder === 'rating-asc') {
            return a.rating - b.rating; // Sort by rating ascending
        }
        if (sortOrder === 'rating-desc') {
            return b.rating - a.rating; // Sort by rating descending
        }
        // Default sorting by price
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    const paginatedHotels = sortedHotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);

    const handleFilterChange = (newRating) => {
        setSelectedRating(newRating);
        setFilterApplied(true);
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (newPriceRange) => {
        setPriceRange(newPriceRange);
        setFilterApplied(true);
        setCurrentPage(1);
    };

    const handleFilterReset = () => {
        setSelectedRating(null);
        setPriceRange([0, 1000]); // Reset to default range
        setFilterApplied(false);
        setCurrentPage(1);
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => {
            if (prevOrder === 'default') {
                return 'asc';
            }
            if (prevOrder === 'asc') {
                return 'desc';
            }
            return 'default'; // Return to default order
        });
    };

    const toggleSortByRating = () => {
        setSortOrder(prevOrder => {
            // Check if the current sort order is based on price
            if (prevOrder === 'asc' || prevOrder === 'desc') {
                // If sorting by price, switch to rating sorting
                return 'rating-asc';
            }
            if (prevOrder === 'rating-asc') {
                return 'rating-desc'; // Switch to descending order for rating
            }
            if (prevOrder === 'rating-desc') {
                return 'default'; // Return to default order
            }
            return 'rating-asc'; // Default to rating ascending if no sorting is applied
        });
    };

    const openSortDialog = () => setIsDialogOpen(true);
    const closeSortDialog = () => setIsDialogOpen(false);


    return (
        <div className="hotels-page">
            <div className="fixed-header">
                <Navbar />
                <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <FilterComponent
                    setSelectedRating={handleFilterChange}
                    resetFilter={handleFilterReset}
                    priceRange={priceRange}
                    setPriceRange={handlePriceRangeChange}
                    setPage={setCurrentPage}
                />
                <button className="sort-button" onClick={openSortDialog}>
                    SORT
                </button>
                <SortDialog
                    isOpen={isDialogOpen}
                    onClose={closeSortDialog}
                    toggleSortOrder={toggleSortOrder}
                    toggleSortByRating={toggleSortByRating}
                    sortOrder={sortOrder}
                />
            </div>
            <div className="content" style={{ flex: 1, display: 'flex' }}>
                <div className="hotel-list-container" style={{ flex: 1 }}>
                    <HotelList
                        hotels={sortedHotels}
                        onHotelClick={handleHotelClick}
                        hotelPrices={hotelPrices}
                        currentImageIndices={currentImageIndices}
                        setCurrentImageIndices={setCurrentImageIndices}
                        setHoveredHotelId={setHoveredHotelId}
                        hoveredHotelId={hoveredHotelId}
                        selectedRating={selectedRating}
                        setSelectedRating={setSelectedRating}
                    />
                </div>

                <div className="hotel-map-container" style={{ flex: 1 }}>
                    <HotelMap
                        hotels={filterApplied ? filteredHotels : paginatedHotels}
                        handleHotelClick={handleHotelClick}
                        setHoveredHotelId={setHoveredHotelId}
                        hoveredHotelId={hoveredHotelId}
                        hotelPrices={hotelPrices}
                        guestDetails={guestDetails} // Pass guest details here
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Hotels;
