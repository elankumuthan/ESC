import React from 'react';
import '../Styles/Popover.css';

const Popover = ({ position, content, onClose }) => {
    if (!position || position.left === undefined || position.top === undefined) {
        // Optionally, you can log a warning or handle this scenario differently
        console.warn("Popover position is not properly defined");
        return null; // Or return a fallback UI
    }

    return (
        <div className="popover" style={{ left: position.left, top: position.top }}>
            <div className="popover-content">
                {content}
            </div>
            <button className="popover-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Popover;
