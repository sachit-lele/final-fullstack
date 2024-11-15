from flask import Flask
from .routes import api_routes
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.register_blueprint(api_routes)  # Registering API routes
    return app
