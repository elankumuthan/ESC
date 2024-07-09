import React from "react";
import Footer from "../Components/Footer";
import SearchBox  from "../Components/searchBox";
import Navbar from "../Components/Navbar"

function Home() {
  return (
    <div className="home-section">
      <Navbar />
      <SearchBox />
      <Footer />
    </div>
  );
}

export default Home;
