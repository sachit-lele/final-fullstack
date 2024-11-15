from flask import Blueprint, request, jsonify
from services.azure_service import get_azure_prediction
from services.ollama_service import generate_summary

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/api/get_summary', methods=['POST'])
def get_summary():
    input_data = request.json.get('input_data')
    azure_prediction = get_azure_prediction(input_data)
    prediction_str = str(azure_prediction)
    summary_text = generate_summary(prediction_str)
    return jsonify({
        'azure_prediction': azure_prediction,
        'generated_summary': summary_text
    })