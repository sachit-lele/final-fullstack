import axios from 'axios';

// Base URLs for different APIs
const API_BASE_URL_AdversarialModel = '/api';  // Azure model API base URL
const API_BASE_URL_Ollama = 'http://localhost:';  // Ollama running locally on port 5000

// Function to generate prediction from the Azure model
export const generatePrediction = async (textInput, lastRealOhlcv) => {
  try {
    const response = await axios.post(`${API_BASE_URL_AdversarialModel}/generate`, {
      text_input: textInput,
      last_real_ohlcv: lastRealOhlcv,
    });
    return response.data.generated_ohlcv;
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw error;
  }
};

// Function to ping the Azure server
export const pingServer = async () => {
  try {
    await axios.get(`${API_BASE_URL_AdversarialModel}/ping`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional: Ensure token validity for Azure API
      },
    });
  } catch (error) {
    console.error("Server ping failed:", error);
    throw error;
  }
};

// Function to get summary from the locally running Ollama
export const getSummaryFromOllama = async (ohlcvString) => {
  try {
    const response = await axios.post(`${API_BASE_URL_Ollama}/generate_summary`, {
      ohlcv_string: ohlcvString,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,  // Remove if Ollama doesn't require authentication locally
      },
    });
    return response.data.summary;
  } catch (error) {
    console.error("Summary generation failed:", error);
    throw error;
  }
};
