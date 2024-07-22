import React, { useState, useRef, useEffect } from 'react';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

const SearchBoxLayout = ({
    rooms, setRooms,
    guests, setGuests,
    inputValue, handleInputChange,
    startDate, setStartDate,
    endDate, setEndDate,
    suggestions, handleSuggestionClick,
    dropdownVisible, toggleDropdown, applySelection, adults, setAdults, children, setChildren,
    handleFocus, handleBlur, handleSearch
}) => {
    const dropdownRef = useRef(null);
    const whereInputRef = useRef(null);

    const [focusedInput, setFocusedInput] = useState(null);

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
    }, [dropdownVisible, handleClickOutside]);

    const handleDateFocus = (input) => {
        setFocusedInput(input);
    };

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
                        style={{
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            color: '#666',
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            background: 'none',
                            cursor: 'pointer',
                            paddingLeft: '20px'
                        }}
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
                <div className="clickable-element check-element" onClick={() => handleDateFocus('startDate')}>
                    <div className="date-picker-wrapper">
                        <DateRangePicker
                            startDate={startDate ? moment(startDate) : null}
                            startDateId="start_date_id"
                            endDate={endDate ? moment(endDate) : null}
                            endDateId="end_date_id"
                            onDatesChange={({ startDate, endDate }) => { setStartDate(startDate); setEndDate(endDate); }}
                            focusedInput={focusedInput}
                            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                            startDatePlaceholderText="Check-in"
                            endDatePlaceholderText="Check-out"
                            isOutsideRange={() => false}
                            displayFormat="DD/MM/YYYY"
                        />
                    </div>
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
                                    <button onClick={(e) => { e.stopPropagation(); setRooms(Math.max(1, rooms - 1)); }}>-</button>
                                    <span>{rooms}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setRooms(rooms + 1); }}>+</button>
                                </div>
                            </div>
                            <div className="dropdown-item">
                                <span>Adults</span>
                                <div className="control-group">
                                    <button onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}>-</button>
                                    <span>{adults}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }}>+</button>
                                </div>
                            </div>
                            <div className="dropdown-item">
                                <span>Children</span>
                                <div className="control-group">
                                    <button onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}>-</button>
                                    <span>{children}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }}>+</button>
                                </div>
                            </div>
                            <motion.button className="apply-button"
                                whileHover={{ scale: 1.1 }}
                                onClick={applySelection}>Apply</motion.button>
                        </div>
                    )}
                </div>
                <motion.button className="search-button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSearch}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} size='s' />
                </motion.button>
            </div>
        </div>
    );
};

export default SearchBoxLayout;