from flask import Blueprint, request, jsonify
from .azureserv import generate_prediction
from .ollamaserv import get_summary_from_ollama

api_routes = Blueprint('api', __name__)

@api_routes.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    text_input = data.get('text_input')
    last_real_ohlcv = data.get('last_real_ohlcv')
    
    try:
        prediction = generate_prediction(text_input, last_real_ohlcv)
        return jsonify({'generated_ohlcv': prediction}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api_routes.route('/generate_summary', methods=['POST'])
def generate_summary():
    data = request.get_json()
    ohlcv_string = data.get('ohlcv_string')
    
    try:
        summary = get_summary_from_ollama(ohlcv_string)
        return jsonify({'summary': summary}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
