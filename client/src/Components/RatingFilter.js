// src/Components/RatingFilter.js
import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const RatingFilter = ({ selectedRating, onRatingChange }) => {
    return (
        <div>
            <h2>Filter by Rating</h2>
            <Stack spacing={1}>
                <Rating
                    name="rating-filter"
                    value={selectedRating || null}
                    precision={0.5}
                    onChange={(event, newValue) => onRatingChange(newValue)}
                    size="large"
                />
            </Stack>
            <button
                onClick={() => onRatingChange(null)}
                style={{ marginTop: '10px', padding: '10px' }}
            >
                Clear Filter
            </button>
        </div>
    );
};

export default RatingFilter;