import React from 'react';
import { Dialog, DialogTitle, DialogContent, Rating, Button, Stack, TextField } from '@mui/material';
import '../Styles/FilterComponent.css';

const FilterComponent = ({
    selectedRating,
    setSelectedRating,
    selectedScore,
    setSelectedScore,
    resetFilter,
    priceRange,
    setPriceRange,
    setPage
}) => {
    const [open, setOpen] = React.useState(false);
    const [scoreRange, setScoreRange] = React.useState([0, 100]);

    const [minPrice, setMinPrice] = React.useState(priceRange ? priceRange[0] : 0);
    const [maxPrice, setMaxPrice] = React.useState(priceRange ? priceRange[1] : 5000);

    React.useEffect(() => {
        if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
            setMinPrice(priceRange[0]);
            setMaxPrice(priceRange[1]);
        }
    }, [priceRange]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRatingChange = (event, newValue) => {
        setSelectedRating(newValue);
        if (typeof setPage === 'function') {
            setPage(1);
        }
    };

    const handlePriceChange = (newMinPrice, newMaxPrice) => {
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
        setPriceRange([newMinPrice, newMaxPrice]);
        if (typeof setPage === 'function') {
            setPage(1);
        }
    };

    const handleScoreChange = (event, newValue) => {
        if (Array.isArray(newValue) && newValue.length === 2) {
            setScoreRange(newValue);
            if (typeof setSelectedScore === 'function') {
                setSelectedScore(newValue);
            } else {
                console.error('setSelectedScore is not a function');
            }
            if (typeof setPage === 'function') {
                setPage(1);
            }
        }
    };

    const handleMinPriceChange = (event) => {
        const value = Number(event.target.value);
        if (value >= 0) {
            handlePriceChange(value, maxPrice);
        }
    };

    const handleMaxPriceChange = (event) => {
        const value = Number(event.target.value);
        if (value >= minPrice) {
            handlePriceChange(minPrice, value);
        }
    };


    return (
        <div className="filter-container">
            <Button variant="contained" color="primary" onClick={handleClickOpen} className="filter-button">
                Filter
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Filter Options</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <div>
                            <div>Rating</div>
                            <Rating
                                name="rating-filter"
                                value={selectedRating}
                                onChange={handleRatingChange}
                                precision={0.5}
                            />
                        </div>
                        <div>
                            <div>Price Range</div>
                            <div className="price-inputs">
                                <TextField
                                    label="Min Price"
                                    type="number"
                                    value={minPrice}
                                    onChange={handleMinPriceChange}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                                <TextField
                                    label="Max Price"
                                    type="number"
                                    value={maxPrice}
                                    onChange={handleMaxPriceChange}
                                    InputProps={{ inputProps: { min: minPrice } }}
                                />
                            </div>
                        </div>
                        <Button variant="outlined" onClick={resetFilter}>Reset</Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FilterComponent;