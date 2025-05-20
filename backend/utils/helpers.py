import json

def read_lines(filepath):
    try:
        with open(filepath, 'r') as f:
            return [json.loads(line.strip()) for line in f if line.strip()]
    except FileNotFoundError:
        return []

def write_line(filepath, data):
    with open(filepath, 'a') as f:
        f.write(json.dumps(data) + '\n')

def write_all_lines(filepath, data_list):
    with open(filepath, 'w') as f:
        for item in data_list:
            f.write(json.dumps(item) + '\n')

def get_next_id(items):
    if not items:
        return 1
    return max(int(item['id']) for item in items) + 1
