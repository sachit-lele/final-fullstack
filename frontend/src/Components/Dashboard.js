import React, { useState } from 'react';
import axios from 'axios';
import StockPredictor from './StockPredictor';

function Dashboard() {
  const [prediction, setPrediction] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch prediction
      const predictionResponse = await axios.post(process.env.REACT_APP_PREDICTION_API_URL);
      setPrediction(predictionResponse.data.prediction);

      // Fetch summary
      const summaryResponse = await axios.post(process.env.REACT_APP_SUMMARY_API_URL);
      setSummary(summaryResponse.data.summary);
    } catch (err) {
      console.error('Error generating data:', err);
      setError('Failed to generate data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={generateData} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Predictions and Summary'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <StockPredictor summary={summary} prediction={prediction} llmLoading={loading} />
    </div>
  );
}

export default Dashboard;