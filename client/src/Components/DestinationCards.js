// DestinationCards.js
import React from "react";
import PropTypes from "prop-types";

function DestinationCards({ img, name, title, handleClick }) {
  return (
    <div className="dt-card" >
      <img src={img} alt={name} className="dt-card-img" onClick={handleClick}/>
      <p className="dt-card-name">{name}</p>
      <p className="dt-card-title">{title}</p>
    </div>
  );
}

DestinationCards.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  stars: PropTypes.string.isRequired,
  reviews: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default DestinationCards;