import requests
from app.config import AZURE_API_KEY

def generate_prediction(text_input, last_real_ohlcv):
    url = "https://your-azure-model-url.com/predict"
    headers = {
        "Authorization": f"Bearer {AZURE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "text_input": text_input,
        "last_real_ohlcv": last_real_ohlcv
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json().get('generated_ohlcv')
    else:
        raise Exception(f"Azure prediction failed: {response.text}")
