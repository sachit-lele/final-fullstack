// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [azurePrediction, setAzurePrediction] = useState(null);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = () => {
      const inputData = {
        // Your input data here
      };

      axios
        .post(
          'http://localhost:5000/api/get_summary',
          { input_data: inputData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(response => {
          setAzurePrediction(response.data.azure_prediction);
          setGeneratedSummary(response.data.generated_summary);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          alert('Failed to fetch data. Please try again.');
        });
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Azure Model Prediction:</h2>
      <pre>{JSON.stringify(azurePrediction, null, 2)}</pre>
      <h2>Generated Summary:</h2>
      <p>{generatedSummary}</p>
    </div>
  );
}

export default Dashboard;