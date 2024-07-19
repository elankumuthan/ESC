import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import { SelectedCountryProvider } from './Components/SelectedCountries';
import 'react-dates/lib/css/_datepicker.css';
import './Styles/react_dates_overrides.css';

function App() {
  return (
    <div className="App">
      <SelectedCountryProvider>
        <Router basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </SelectedCountryProvider>
    </div>
  );
}

export default App;