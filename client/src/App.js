// Imports
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SelectedCountryProvider } from './Components/SelectedCountries';
import 'react-dates/lib/css/_datepicker.css';
import './Styles/react_dates_overrides.css';
import './App.css';
import Home from "./Pages/Home";
import Hotels from "./Pages/Hotels";
import EachHotel from "./Pages/Booking";  // Assuming this is the booking page
import Confirmation from "./Pages/Confirmed";
import HotelDetails from "./Pages/HotelDetails";

function App() {
  return (
    <div className="App">
      <SelectedCountryProvider>
        <Router basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hoteldetails/:hid" element={<EachHotel />} />  {/* Updated route */}
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/hotel" element={<Confirmation />} />
            <Route path="/hoteldetails" element={<HotelDetails />} />
          </Routes>
        </Router>
      </SelectedCountryProvider>
    </div>
  );
}

export default App;