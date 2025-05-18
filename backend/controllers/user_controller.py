from flask import Blueprint, request, jsonify
from utils.database_path import USERS_FILE
from utils.helpers import read_lines, write_all_lines

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    """Retorna todos os usuários cadastrados (exceto admin)"""
    users = read_lines(USERS_FILE)
    return jsonify(users), 200

@user_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Atualiza dados de um usuário"""
    data = request.json
    users = read_lines(USERS_FILE)
    updated = False

    for user in users:
        if user['id'] == user_id:
            user.update({
                "name": data.get("name", user["name"]),
                "email": data.get("email", user["email"]),
                "password": data.get("password", user["password"]),
                "type": data.get("type", user["type"])
            })
            updated = True
            break

    if not updated:
        return jsonify({"error": "Usuário não encontrado"}), 404

    write_all_lines(USERS_FILE, users)
    return jsonify({"message": "Usuário atualizado com sucesso"}), 200

@user_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Remove um usuário pelo ID"""
    users = read_lines(USERS_FILE)
    new_users = [user for user in users if user['id'] != user_id]

    if len(users) == len(new_users):
        return jsonify({"error": "Usuário não encontrado"}), 404

    write_all_lines(USERS_FILE, new_users)
    return jsonify({"message": "Usuário excluído com sucesso"}), 200
