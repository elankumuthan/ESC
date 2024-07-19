import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import { SelectedCountriesProvider } from './Components/SelectedCountries'; // Adjust the import path accordingly
import 'react-dates/lib/css/_datepicker.css';
import './Styles/react_dates_overrides.css';

function App() {
  return (
    <div className="App">
      <SelectedCountriesProvider>
        <Router basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </SelectedCountriesProvider>
    </div>
  );
}

export default App;