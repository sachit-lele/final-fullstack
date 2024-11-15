import requests
from config import AZURE_ENDPOINT, AZURE_API_KEY

def get_azure_prediction(input_data):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {AZURE_API_KEY}',
    }
    response = requests.post(
        AZURE_ENDPOINT,
        json={'data': input_data},
        headers=headers
    )
    return response.json()