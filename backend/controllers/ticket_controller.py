from flask import Blueprint, request, jsonify
import json
from utils.database_path import TICKETS_FILE
from utils.helpers import read_lines, write_line, get_next_id

ticket_bp = Blueprint('tickets', __name__)

@ticket_bp.route('/', methods=['GET'])
def get_all_tickets():
    """Retorna todos os chamados (para técnicos)"""
    tickets = read_lines(TICKETS_FILE)
    return jsonify(tickets), 200

@ticket_bp.route('/<user_id>', methods=['GET'])
def get_user_tickets(user_id):
    """Retorna chamados abertos por um cliente específico"""
    tickets = read_lines(TICKETS_FILE)
    user_tickets = [t for t in tickets if t['user_id'] == user_id]
    return jsonify(user_tickets), 200

@ticket_bp.route('/', methods=['POST'])
def create_ticket():
    """Cria um novo chamado (cliente)"""
    data = request.json
    title = data.get('title')
    description = data.get('description')
    user_id = data.get('user_id')
    print([title, description, user_id])
    if not all([title, description, user_id]):
        return jsonify({"error": "Preencha todos os campos"}), 400

    tickets = read_lines(TICKETS_FILE)
    ticket_id = get_next_id(tickets)

    new_ticket = {
        "id": str(ticket_id),
        "title": title,
        "description": description,
        "user_id": user_id,
        "status": "aberto",
        "response": ""
    }

    write_line(TICKETS_FILE, new_ticket)
    return jsonify({"message": "Chamado criado com sucesso", "ticket": new_ticket}), 201

@ticket_bp.route('<ticket_id>/respond', methods=['POST'])
def respond_ticket(ticket_id):
    """Técnico responde e encerra um chamado"""
    data = request.json
    response = data.get('response')

    if not response:
        return jsonify({"error": "Resposta não pode estar vazia"}), 400

    tickets = read_lines(TICKETS_FILE)
    updated = False

    for ticket in tickets:
        if ticket['id'] == ticket_id:
            ticket['response'] = response
            ticket['status'] = 'encerrado'
            updated = True
            break

    if not updated:
        return jsonify({"error": "Chamado não encontrado"}), 404

    with open(TICKETS_FILE, 'w') as f:
        for t in tickets:
            f.write(json.dumps(t) + '\n')

    return jsonify({"message": "Chamado respondido e encerrado com sucesso"}), 200
