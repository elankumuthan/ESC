import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const SearchBoxLayout = ({ 
    rooms, setRooms, 
    guests, setGuests, 
    inputValue, handleInputChange, 
    startDate, setStartDate, 
    endDate, setEndDate, 
    suggestions, handleSuggestionClick 
}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [room, SetRoom] = useState(1)
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const applySelection = () => {
        setGuests(adults + children);
        setDropdownVisible(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="search-box">
            <div className="row">
                <div className="guests-rooms" onClick={toggleDropdown}>
                    <span>{rooms} Room | {adults + children} Guests per room</span>
                    {dropdownVisible && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <div className="dropdown-item">
                                <span>Rooms</span>
                                <div className="control-group">
                                    <button onClick={(e) => {e.stopPropagation(); SetRoom(Math.max(1, room - 1));}}>-</button>
                                    <span>{room}</span>
                                    <button onClick={(e) => {e.stopPropagation(); SetRoom(room + 1);}}>+</button>
                                </div>

                            </div>
                            <div className="dropdown-item">
                                <span>Adults</span>
                                <div className="control-group">
                                    <button onClick={(e) => {e.stopPropagation(); setAdults(Math.max(1, adults - 1));}}>-</button>
                                    <span>{adults}</span>
                                    <button onClick={(e) => {e.stopPropagation(); setAdults(adults + 1);}}>+</button>
                                </div>
                            </div>
                            <div className="dropdown-item">
                                <span>Children</span>
                                <div className="control-group">
                                    <button onClick={(e) => {e.stopPropagation(); setChildren(Math.max(0, children - 1));}}>-</button>
                                    <span>{children}</span>
                                    <button onClick={(e) => {e.stopPropagation(); setChildren(children + 1);}}>+</button>
                                </div>
                            </div>
                            <button className="apply-button" onClick={applySelection}>Apply</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="row">
                <input
                    type="text"
                    id="input-box"
                    className="destination-input"
                    placeholder="Destinations"
                    autoComplete="off"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className="stay-period">
                    <span>Stay Period</span>
                    <span>{startDate} - {endDate}</span>
                </div>
                <button className="search-button"> Search</button>
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

export default SearchBoxLayout;
