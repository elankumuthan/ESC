import React from 'react';
import '../Styles/SortDialog.css'; // Ensure you have the correct path to your CSS

const SortDialog = ({ isOpen, onClose, toggleSortOrder, toggleSortByRating, sortOrder }) => {
    if (!isOpen) return null;

    const getPriceButtonLabel = () => {
        return sortOrder === 'asc'
            ? 'Sort By Price ↑'
            : sortOrder === 'desc'
                ? 'Sort By Price ↓'
                : 'Sort By Price ↕️';
    };

    const getRatingButtonLabel = () => {
        return sortOrder === 'rating-asc'
            ? 'Sort By ⭐️ ↑'
            : sortOrder === 'rating-desc'
                ? 'Sort By ⭐️ ↓'
                : 'Sort By ⭐️ ↕️';
    };

    return (
        <>
            <div className="dialog-overlay" onClick={onClose}></div>
            <div className="sort-dialog">
                <div className="dialog-content">
                    <button onClick={toggleSortOrder}>
                        {getPriceButtonLabel()}
                    </button>
                    <button onClick={toggleSortByRating}>
                        {getRatingButtonLabel()}
                    </button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
};

export default SortDialog;
