import React from "react";
import DestinationCards from "./DestinationCards";
import profile1 from "../Assets/singapore.jpg";
import profile2 from "../Assets/malaysia.jpg";
import profile3 from "../Assets/japan.jpg";
import profile4 from "../Assets/aust.jpg";
import "../Styles/Cards.css";

function Destination() {
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
          stars="4.9"
          reviews="1800"
        />
        <DestinationCards
          img={profile2}
          name="Malaysia"
          stars="4.8"
          reviews="700"
        />
        <DestinationCards
          img={profile3}
          name="Japan"
          stars="4.7"
          reviews="450"
        />
        <DestinationCards
          img={profile4}
          name="Australia"
          stars="4.8"
          reviews="500"
        />
      </div>
    </div>
  );
}

export default Destination;
