// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // You can include a global stylesheet here
import App from './App'; // Import your main App component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();