// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import StockPredictor from './Components/StockPredictor'; // Import the component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} /> 
          <Route path="/stock-predictor" component={StockPredictor} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
