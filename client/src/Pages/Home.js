import React from "react";
import Footer from "../Components/Footer";
import SearchBox from "../Components/searchBox";
import Navbar from "../Components/Navbar"
import Destination from "../Components/Destinations"

function Home() {
  return (
    <div className="home-section">
      <Navbar />
      <SearchBox />
      <Destination />
      <Footer />
    </div>
  );
}

export default Home;
