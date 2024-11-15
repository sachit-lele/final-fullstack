# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
import requests
import subprocess

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Replace with a secure key
jwt = JWTManager(app)

users = {}  # Simple in-memory user store

# Signup endpoint
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in users:
        return jsonify({'message': 'User already exists'}), 400

    users[username] = password
    return jsonify({'message': 'User registered successfully'}), 201

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if users.get(username) != password:
        return jsonify({'message': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=username)
    return jsonify({'token': access_token}), 200

# Protected endpoint
@app.route('/api/get_summary', methods=['POST'])
@jwt_required()
def get_summary():
    input_data = request.json.get('input_data')

    # Fetch Azure model results
    azure_endpoint = 'https://your-azure-model-endpoint'
    azure_headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_AZURE_API_KEY'
    }
    azure_response = requests.post(
        azure_endpoint,
        json={'data': input_data},
        headers=azure_headers
    )
    azure_prediction = azure_response.json()

    # Convert prediction to string
    prediction_str = str(azure_prediction)

    # Generate summary using Ollama with Llama 3.2
    ollama_command = [
        'ollama', 'generate',
        '--model', 'llama-3.2',
        '--input', prediction_str
    ]
    process = subprocess.Popen(ollama_command, stdout=subprocess.PIPE)
    summary_output, _ = process.communicate()
    summary_text = summary_output.decode('utf-8').strip()

    return jsonify({
        'azure_prediction': azure_prediction,
        'generated_summary': summary_text
    })

if __name__ == '__main__':
    app.run(debug=True)