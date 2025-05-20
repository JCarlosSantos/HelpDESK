import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
USERS_FILE = os.path.join(BASE_DIR, 'database', 'users.txt')
TICKETS_FILE = os.path.join(BASE_DIR, 'database', 'tickets.txt')
ADMIN_FILE = os.path.join(BASE_DIR, 'database', 'admin.json')
