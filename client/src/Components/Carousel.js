import React, { useRef } from "react";
import Slider from "react-slick";
import DestinationCards from "./DestinationCards";
import profile1 from "../Assets/singapore.jpg";
import profile2 from "../Assets/malaysia.jpg";
import profile3 from "../Assets/japan.jpg";
import profile4 from "../Assets/aust.jpg";
import profile5 from "../Assets/korea.jpg";
import profile6 from "../Assets/bangkok.jpg";
import "../Styles/Cards.css";

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}


function AutoPlayMethods({ handleClick }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <SamplePrevArrow to="prev" />,
    nextArrow: <SampleNextArrow to="next"/>,

  };

  return (
    <div className="slider-container">
      <Slider ref={sliderRef} {...settings}>
        <div classname ='card'>
          <DestinationCards
            img={profile1}
            name="Singapore"
            title="Marina Bay Sands"
            handleClick={() => handleClick("RsBU", "Singapore")}
          />
        </div>
        <div classname ='card'>
          <DestinationCards
            img={profile2}
            name="Kuala Lumpur, Malaysia"
            title="PETRONAS Twin Towers"
            handleClick={() => handleClick("EzoR", "Kuala Lumpur, Malaysia")}
          />
        </div>
        <div classname ='card'>
          <DestinationCards
            img={profile3}
            name="Kyoto, Japan"
            title="Chureito Pagoda"
            handleClick={() => handleClick("1y34", "Japan")}
          />
        </div>
        <div classname ='card'>
          <DestinationCards
            img={profile4}
            name="Sydney, Australia"
            title="Jones Beach"
            handleClick={() => handleClick("7H9O", "Australia")}
          />
        </div >
        <div classname ='card'>
          <DestinationCards
            img={profile5}
            name="Seoul, Korea"
            title="Gyeongbokgung Palace"
            handleClick={() => handleClick("b3ni", "Australia")}
          />
        </div >

        <div classname ='card'>
          <DestinationCards
            img={profile6}
            name="Bangkok, Thailand"
            title="Wat Arun"
            handleClick={() => handleClick("Zauv", "Australia")}
          />
        </div >
      </Slider>
    </div>
  );
}

export default AutoPlayMethods; 