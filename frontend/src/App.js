import React, { useEffect } from 'react';
import StockPredictor from './Components/StockPredictor.js';
import { pingServer } from './Components/api.js';

function App() {
  useEffect(() => {
    const checkServer = async () => {
      try {
        await pingServer();
      } catch {
        console.error("Server is down!");
      }
    };
    checkServer();
  }, []);

  return (
    <div className="App">
      <StockPredictor />
    </div>
  );
}

export default App;