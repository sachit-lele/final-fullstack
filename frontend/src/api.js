import axios from 'axios';

const API_BASE_URL = 'http://20.116.216.53:5000';
const MODEL_ID = 'Abiggj99/stock-summary-model'; // Replace with your specific model ID
const HUGGING_FACE_API_KEY = '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';

export const generatePrediction = async (textInput, lastRealOhlcv) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      text_input: textInput,
      last_real_ohlcv: lastRealOhlcv,
    });
    return response.data.generated_ohlcv;
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw error;
  }
};

export const getOverviewFromHuggingFace = async (ohlcvData, retries = 3) => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: ohlcvData }),
    });
    const data = await response.json();

    if (response.status === 503 && retries > 0) {  // 503 indicates model is loading
      const waitTime = data.estimated_time * 1000 || 20000; // Default to 20s if no estimate
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return getOverviewFromHuggingFace(ohlcvData, retries - 1);
    }
    
    if (!response.ok) throw new Error(data.error || 'Error from model');
    
    // Check the response structure for summary text
    if (data && Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else {
      console.warn("Unexpected response format:", data);
      return "";
    }
  } catch (error) {
    console.error("Error generating overview:", error.message);
    throw error;
  }
};

export const pingServer = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ping`);
    return response.data;
  } catch (error) {
    console.error("Error pinging server:", error);
    throw error;
  }
};