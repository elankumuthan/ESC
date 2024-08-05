import React from "react";
import "../Styles/Cards.css";
import { useSelectedCountry } from './SelectedCountries';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AutoPlayMethods from "./Carousel"; // Ensure this import path is correct

function Destination() {
  const { setStartDate, setEndDate, setDestinationInput } = useSelectedCountry();

  const handleClick = (destinationId, destinationName) => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDate = formatDate(today);
    const endDate = formatDate(nextYear);

    setStartDate(startDate);
    setEndDate(endDate);
    setDestinationInput(destinationName);

    const guests = "2";
    const url = `/hotels?destination_id=${destinationId}&start_date=${startDate}&end_date=${endDate}&guests=${encodeURIComponent(guests)}`;

    window.location.href = url;
  };

  return (
    <div className="popular-section" id="popular">
      <div className="dt-title-content">
        <h3 className="dt-title">
          <span>Popular Destinations</span>
        </h3>
      </div>

      <div className="dt-cards-content">
        <AutoPlayMethods handleClick={handleClick} />
      </div>
    </div>
  );
}

export default Destination;
