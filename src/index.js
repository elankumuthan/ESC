import React from 'react';
import ReactDOM from 'react-dom/client';
import './Styles/index.css';  // Ensure the correct path to the consolidated CSS file
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


/*ReactDOM.render(
  <React.StrictMode>
    <SearchBox />
  </React.StrictMode>,
  document.getElementById('root')
);
*/