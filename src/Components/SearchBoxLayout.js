import React, { useRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchBoxLayout = ({ 
    rooms, setRooms, 
    guests, setGuests, 
    inputValue, handleInputChange, 
    startDate, setStartDate, 
    endDate, setEndDate, 
    suggestions, handleSuggestionClick,
    dropdownVisible, toggleDropdown, applySelection, adults, setAdults, children, setChildren,
    handleFocus, handleBlur 
}) => {
    const dropdownRef = useRef(null);
    const whereInputRef = useRef(null);
    const checkInRef = useRef(null);
    const checkOutRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            applySelection();
            toggleDropdown(false);
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
                <div className="clickable-element where-element" onClick={() => { whereInputRef.current.focus(); }}>
                    <div className="label">Where</div>
                    <input
                        type="text"
                        id="input-box"
                        ref={whereInputRef}
                        className="destination-input"
                        placeholder="Search destinations"
                        autoComplete="off"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {suggestions.length > 0 && (
                        <div className="suggestion-list">
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
                <Divider orientation="vertical" flexItem className="custom-divider" sx={{ height: '60px', margin: 'auto' }} />
                <div className="clickable-element check-element" onClick={() => { checkInRef.current.setFocus(); }}>
                    <div className="label">Check in</div>
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Add dates"
                        className="date-input"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={checkInRef}
                    />
                </div>
                <Divider orientation="vertical" flexItem className="custom-divider" sx={{ height: '60px', margin: 'auto' }} />
                <div className="clickable-element check-element" onClick={() => { checkOutRef.current.setFocus(); }}>
                    <div className="label">Check out</div>
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="Add dates"
                        className="date-input"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={checkOutRef}
                    />
                </div>
                <Divider orientation="vertical" flexItem className="custom-divider" sx={{ height: '60px', margin: 'auto' }} />
                <div className="clickable-element who-element" onClick={() => { toggleDropdown(); }}>
                    <div className="label">Who</div>
                    <div className="travellers">
                        <span>{adults + children} Guests</span>
                    </div>
                    {dropdownVisible && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <div className="dropdown-item">
                                <span>Rooms</span>
                                <div className="control-group">
                                    <button onClick={(e) => {e.stopPropagation(); setRooms(Math.max(1, rooms - 1));}}>-</button>
                                    <span>{rooms}</span>
                                    <button onClick={(e) => {e.stopPropagation(); setRooms(rooms + 1);}}>+</button>
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
                <button className="search-button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='s' />
                </button>
            </div>
        </div>
    );
};

export default SearchBoxLayout;
