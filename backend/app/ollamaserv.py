import requests
from app.config import OLLAMA_API_KEY

def get_summary_from_ollama(ohlcv_string):
    url = "http://localhost:5000/generate_summary"  # Ollama's local API endpoint
    headers = {
        "Authorization": f"Bearer {OLLAMA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"ohlcv_string": ohlcv_string}
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json().get('summary')
    else:
        raise Exception(f"Ollama summary generation failed: {response.text}")
