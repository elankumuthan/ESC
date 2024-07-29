// DestinationCards.js
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function DestinationCards({ img, name, title, stars, reviews, handleClick }) {
  return (
    <div className="dt-card" onClick={handleClick}>
      <img src={img} alt={name} className="dt-card-img" />
      <p className="dt-card-name">{name}</p>
      <p className="dt-card-title">{title}</p>
      <p className="dt-card-stars">
        <FontAwesomeIcon
          icon={faStar}
          style={{ color: "#F7BB50", paddingRight: "6px" }}
        />
        {stars}
        <span className="dt-card-reviews"> ({reviews}+ Reviews)</span>
      </p>
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