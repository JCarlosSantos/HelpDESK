from flask import Flask, send_from_directory, redirect
from flask_cors import CORS
import os

from controllers.auth_controller import auth_bp
from controllers.user_controller import user_bp
from controllers.ticket_controller import ticket_bp

app = Flask(__name__, static_folder='../frontend', static_url_path='/')

CORS(app, supports_credentials=True)  # Desativa CORS

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(ticket_bp, url_prefix='/api/tickets')

@app.route('/')
def index():
    return redirect('/login/index.html')

@app.route('/<path:path>')
def serve_static(path):
    folder = os.path.join(app.static_folder)
    return send_from_directory(folder, path)

if __name__ == '__main__':
    app.run(debug=True)
