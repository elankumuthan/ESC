import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import moment from 'moment';
import '../Styles/style.css';
import SearchBoxLayout from './SearchBoxLayout';  
import { useSelectedCountry } from './SelectedCountries'; 
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const SearchBox = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [fuse, setFuse] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const { selectedCountry, setSelectedCountry, startDate, setStartDate, endDate, setEndDate, guests, setGuests, destinationInput, setDestinationInput } = useSelectedCountry(); // Use the custom hook
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://raw.githubusercontent.com/elankumuthan/ESC/destinations/destinations.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLocations(data);

                const options = {
                    keys: ['term'],
                    includeScore: true,
                    threshold: 0.4,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                };
                setFuse(new Fuse(data, options));
            } catch (error) {
                console.error('Error fetching the locations:', error);
            }
        }
        fetchData();
    }, []);

    // Debounce function definition
    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }, []);

    const filterSuggestions = (query) => {
        if (!query.trim() || !fuse) {
            return [];
        }

        const results = fuse.search(query);
        return results.map(result => result.item).slice(0, 5);
    };

    const debouncedFilterSuggestions = useCallback(debounce((query) => {
        setSuggestions(filterSuggestions(query));
    }, 500), [debounce, filterSuggestions]);

    const handleInputChange = (event) => {
        const query = event.target.value.trim();
        setDestinationInput(query);
        debouncedFilterSuggestions(query);
    };

    const handleSuggestionClick = (term) => {
        const selectedCountry = locations.find(loc => loc.term === term);
        if (selectedCountry) {
            setSelectedCountry(selectedCountry);
        }
        setDestinationInput(term);
        setSuggestions([]);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const applySelection = () => {
        setGuests({ ...guests });
        setDropdownVisible(false);
    };

    const handleFocus = () => {
        setInputFocused(true);
    };

    const handleBlur = () => {
        setInputFocused(false);
    };

    const handleSearch = async () => {

        //console logs are for testing purposes 
        // console.log('Selected Dates:', { startDate, endDate });
        // console.log('Number of Guests:', guests);
        // console.log('Selected Country UID:', selectedCountry ? selectedCountry.uid : 'None');

        //change the date to a moment object
        const formatDate = (date) => {
            if (!date) return '';
            return moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : '';
        };


    if (selectedCountry) {

        try {
            //parsing the parms into a format
            const searchParams = new URLSearchParams({
                destination_id: selectedCountry.uid,
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                guests: JSON.stringify(guests)
            });

            // Redirect to /hotels page with the query parameters
            navigate(`/hotels?${searchParams.toString()}`);
        } catch (error) {
            console.error('Error during redirection:', error);
        }
    }
    };

    return (
        <SearchBoxLayout 
            rooms={guests.rooms} setRooms={(rooms) => setGuests({ ...guests, rooms })}
            guests={guests.adults + guests.children} setGuests={setGuests}
            inputValue={destinationInput} handleInputChange={handleInputChange}
            startDate={startDate ? moment(startDate) : null} setStartDate={(date) => setStartDate(moment(date))}
            endDate={endDate ? moment(endDate) : null} setEndDate={(date) => setEndDate(moment(date))}
            suggestions={suggestions} handleSuggestionClick={handleSuggestionClick}
            dropdownVisible={dropdownVisible} toggleDropdown={toggleDropdown}
            applySelection={applySelection} adults={guests.adults} setAdults={(adults) => setGuests({ ...guests, adults })}
            children={guests.children} setChildren={(children) => setGuests({ ...guests, children })}
            handleFocus={handleFocus} handleBlur={handleBlur}
            inputFocused={inputFocused} handleSearch={handleSearch}
        />
    );
};

export default SearchBox;
