import React, { useState, useEffect } from 'react';
import { generatePrediction, getOverviewFromHuggingFace, pingServer } from './api.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_BASE_URL = 'http://20.116.216.53:5000';

const StockPredictor = () => {
  const [textInput, setTextInput] = useState('');
  const [lastRealOhlcv, setLastRealOhlcv] = useState([]);
  const [generatedOhlcv, setGeneratedOhlcv] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [llmLoading, setLlmLoading] = useState(false);

  useEffect(() => {
    const fetchLastEntry = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/last_entry`);
        setLastRealOhlcv(response.data.last_ohlcv || []);
        setColumnNames(response.data.column_names || []);
      } catch (error) {
        console.error("Error fetching last OHLCV entry:", error);
      }
    };
    fetchLastEntry();
  }, []);

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const handlePredict = async () => {
    if (textInput.trim().split(' ').length < 30) {
      alert("Please enter at least 30 words to generate a prediction.");
      return;
    }
    setLoading(true);
    setSummary('');
    try {
      if (!lastRealOhlcv || lastRealOhlcv.length === 0) {
        console.error("Error: lastRealOhlcv is empty or invalid");
        return;
      }
      
      await pingServer();

      const generatedValues = await generatePrediction(textInput, lastRealOhlcv);
      setGeneratedOhlcv(generatedValues);

      const labeledData = columnNames
        .map((label, index) => `${label}: ${generatedValues[index]}`)
        .join(', ');

      const ohlcvString = `Generate overview for the stock values:\n${labeledData}`;

      setLlmLoading(true);
      const llmSummary = await getOverviewFromHuggingFace(ohlcvString);
      setSummary(llmSummary);
      setLlmLoading(false);

    } catch (error) {
      console.error("Prediction or summary generation failed:", error);
      setLlmLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-800 text-center">Stock Predictor</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <textarea
          value={textInput}
          onChange={handleInputChange}
          placeholder="Enter news text here (minimum 30 words)..."
          rows="6"
          className="flex-1 p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-colors resize-none"
        />
        
        <button
          onClick={handlePredict}
          disabled={loading || llmLoading}
          className={`w-full md:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-transform transform ${
            loading || llmLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:scale-105'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Prediction'}
        </button>
      </div>
      
      {generatedOhlcv.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Generated OHLCV Data</h2>
          <ResponsiveContainer width="100%" height={400}>
          <LineChart data={generatedOhlcv.map((value, i) => ({ name: columnNames[i] || `Point ${i + 1}`, value }))}>              <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
              <YAxis tick={{ fill: '#4b5563' }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <Tooltip
                contentStyle={{ backgroundColor: '#f9fafb', color: '#374151' }}
                itemStyle={{ color: '#4b5563' }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                itemStyle={{ color: '#4b5563', fontWeight: 500 }}
              />
              <Line type="monotone" dataKey="value" stroke="#2563eb" activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {llmLoading && (
        <div className="mt-8 text-gray-500 italic text-center">
          Waiting for LLM response...
        </div>
      )}
      
      {summary && !llmLoading && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Generated Summary</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default StockPredictor;