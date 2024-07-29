import React, { useState } from "react";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/file.png"; 

function Navbar() {
  const [nav, setNav] = useState(false);

  const openNav = () => {
    setNav(!nav);
  };
  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
      <Link to="/">
          <img src={logo} alt="Logo" /> {/* Corrected the img tag */}
        </Link>
      </h1>
    </div>
  );
}
export default Navbar;
