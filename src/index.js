import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';  // Ensure the correct path to the consolidated CSS file
import SearchBox from './searchBox';  // Ensure the correct path to the consolidated component

ReactDOM.render(
  <React.StrictMode>
    <SearchBox />
  </React.StrictMode>,
  document.getElementById('root')
);
