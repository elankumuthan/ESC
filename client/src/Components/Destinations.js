// Destination.js
import React from "react";
import DestinationCards from "./DestinationCards";
import profile1 from "../Assets/singapore.jpg";
import profile2 from "../Assets/malaysia.jpg";
import profile3 from "../Assets/japan.jpg";
import profile4 from "../Assets/aust.jpg";
import "../Styles/Cards.css";
import { useSelectedCountry } from './SelectedCountries'; 

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

    const guests = JSON.stringify({ adults: 4, children: 0, rooms: 2 });
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
        <DestinationCards
          img={profile1}
          name="Singapore"
          title="A Beautiful City"
          stars="4.9"
          reviews="1800"
          handleClick={() => handleClick("RsBU", "Singapore")}
        />
        <DestinationCards
          img={profile2}
          name="Kuala Lumpur, Malaysia"
          title="Cultural Hub"
          stars="4.8"
          reviews="700"
          handleClick={() => handleClick("EzoR", "Kuala Lumpur, Malaysia")}
        />
        <DestinationCards
          img={profile3}
          name="Tokyo, Japan"
          title="Land of the Rising Sun"
          stars="4.7"
          reviews="450"
          handleClick={() => handleClick("1y34", "Japan")}
        />
        <DestinationCards
          img={profile4}
          name="Sydney, Australia"
          title="Down Under"
          stars="4.8"
          reviews="500"
          handleClick={() => handleClick("7H9O", "Australia")}
        />
      </div>
    </div>
  );
}

export default Destination;