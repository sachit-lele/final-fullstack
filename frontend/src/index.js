// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // You can include a global stylesheet here
import App from './App'; // Import your main App component

// Render the App component inside the root element
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This targets the div with id="root" in your public/index.html
);
