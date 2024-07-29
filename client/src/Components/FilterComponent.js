// Imports
import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import '../Styles/FilterComponent.css';  // Import the CSS file

// Define the FilterComponent
const FilterComponent = ({ selectedRating, setSelectedRating }) => {
    return (
        <div className="filter-container">
            <h3>Filter by Rating</h3>
            <Stack spacing={1}>
                <Rating
                    name="rating-filter"
                    value={selectedRating || 0}
                    onChange={(event, newValue) => setSelectedRating(newValue)}
                    precision={0.5}
                />
            </Stack>
        </div>
    );
};

export default FilterComponent;