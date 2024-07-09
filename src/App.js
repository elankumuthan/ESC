import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const Autocomplete = () => {
    const [inputValue, setInputValue] = useState('');
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

    const handleInputChange = (event) => {
        const query = event.target.value.trim();
        setInputValue(query);

        if (query.length > 0) {
            setSuggestions(filterSuggestions(query));
        } else {
            setSuggestions([]);
        }
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
        <div className="search-box">
            <div className="row">
                <input
                    type="text"
                    id="input-box"
                    placeholder="Destination/Hotel"
                    autoComplete="off"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            {suggestions.length > 0 && (
                <div className="result-box" id="result-box">
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion.term)}>
                                {suggestion.term}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Autocomplete;
