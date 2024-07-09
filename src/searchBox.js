import React, { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import './style.css';
import SearchBoxLayout from './SearchBoxLayout';  // Ensure the correct path to the new component

// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const SearchBox = () => {
    const [inputValue, setInputValue] = useState('');
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [fuse, setFuse] = useState(null);

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

    const filterSuggestions = (query) => {
        if (!query.trim() || !fuse) {
            return [];
        }

        const results = fuse.search(query);
        return results.map(result => result.item).slice(0, 5);
    };

    const debouncedFilterSuggestions = useCallback(debounce((query) => {
        setSuggestions(filterSuggestions(query));
    }, 500), [filterSuggestions]);

    const handleInputChange = (event) => {
        const query = event.target.value.trim();
        setInputValue(query);
        debouncedFilterSuggestions(query);
    };

    const handleSuggestionClick = (term) => {
        setInputValue(term);
        setSuggestions([]);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.search-box')) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <SearchBoxLayout 
            rooms={rooms} setRooms={setRooms}
            guests={guests} setGuests={setGuests}
            inputValue={inputValue} handleInputChange={handleInputChange}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            suggestions={suggestions} handleSuggestionClick={handleSuggestionClick}
        />
    );
};

export default SearchBox;
