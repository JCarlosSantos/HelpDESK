import json
from flask import Blueprint, request, jsonify
from utils.database_path import USERS_FILE, ADMIN_FILE
from utils.helpers import read_lines, write_line, get_next_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    with open(ADMIN_FILE, 'r') as f:
        admin = json.load(f)
        if admin['email'] == email and admin['password'] == password:
            return jsonify({**admin, "message": "Login como admin"}), 200

    users = read_lines(USERS_FILE)
    for user in users:
        if user['email'] == email and user['password'] == password:
            return jsonify({**user, "message": "Login bem-sucedido"}), 200

    return jsonify({"error": "Credenciais inválidas"}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('type', 'client')  # Default = client

    if not all([name, email, password]):
        return jsonify({"error": "Preencha todos os campos"}), 400

    users = read_lines(USERS_FILE)
    if any(u['email'] == email for u in users):
        return jsonify({"error": "Email já cadastrado"}), 400

    user_id = get_next_id(users)
    new_user = {
        "id": str(user_id),
        "name": name,
        "email": email,
        "password": password,
        "type": user_type
    }

    write_line(USERS_FILE, new_user)

    return jsonify({"message": "Usuário registrado com sucesso", "user": new_user}), 201
