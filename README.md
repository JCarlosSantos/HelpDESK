# 🛠️ HelpDesk — Sistema Simples de Chamados

**HelpDesk** é um sistema web demonstrativo desenvolvido com **Python (Flask)** no backend e **HTML, CSS e JavaScript puro** no frontend.

O sistema permite o gerenciamento simples de chamados técnicos com três tipos de usuários: **Admin**, **Cliente** e **Técnico**. É focado em organização, design moderno e estrutura clara, ideal para estudos e demonstrações.

---

## 📌 Funcionalidades

### 👤 Admin (fixo)
- Visualizar todos os usuários
- Editar dados de usuários
- Excluir usuários
- **Não pode ser criado ou excluído**
- Armazenado em `backend/database/admin.json`

### 👤 Cliente
- Cadastrar conta
- Fazer login
- Abrir chamados (título e descrição)
- Visualizar seus próprios chamados

### 👨‍🔧 Técnico
- Fazer login
- Visualizar todos os chamados
- Responder chamados
- Encerrar chamados

---

## 🗂️ Estrutura do Projeto
```md
helpdesk/
├── backend/
│   ├── app.py                      # Arquivo principal que inicializa o Flask e serve frontend + backend
│   ├── controllers/
│   │   ├── auth_controller.py      # Controla login, logout e registro
│   │   ├── ticket_controller.py    # Controla abertura, visualização, resposta e fechamento de chamados
│   │   └── user_controller.py      # Controla listagem, edição e exclusão de usuários (admin)
│   ├── database/
│   │   ├── users.txt
│   │   ├── tickets.txt
│   │   └── admin.json
│   ├── utils/
│   │   └── helpers.py              # Funções auxiliares, como leitura e escrita de arquivos
│   └── requirements.txt            # Dependências (ex: Flask)
├── frontend/
│   ├── login/
│   │   └── ...
│   ├── register/
│   │   └── ...
│   ├── client/
│   │   └── ...
│   ├── technician/
│   │   └── ...
│   └── admin/
│       └── ...
├── venv/                          # Ambiente virtual Python (gerado localmente, não obrigatório no repositório)
└── README.md

```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Python 3.6 ou superior** instalado no seu sistema.  
  Você pode baixar em: [https://www.python.org/downloads/](https://www.python.org/downloads/)

- **pip** (gerenciador de pacotes Python) geralmente já vem junto com o Python.  
  Para verificar, execute no terminal:
    ```bash
    pip --version
    ````

Caso não esteja instalado, veja as instruções oficiais em: [https://pip.pypa.io/en/stable/installation/](https://pip.pypa.io/en/stable/installation/)

---

### 1. Crie um ambiente virtual

```bash
python -m venv venv
```

Ative o ambiente virtual:

* **Windows:**

  ```bash
  venv\Scripts\activate
  ```

* **Linux/macOS:**

  ```bash
  source venv/bin/activate
  ```

### 2. Instale as dependências

```bash
pip install -r backend/requirements.txt
```

### 3. Inicie o servidor

```bash
cd backend
python app.py
```

### 4. Acesse no navegador

Abra o navegador e acesse:

```
http://localhost:5000/
```

A página de login do sistema será exibida, e o backend Flask estará servindo o frontend e as APIs.

---

---

## 📎 Dados do Admin Padrão

```json
{
  "id": "0",
  "name": "Administrador",
  "email": "admin@admin.com",
  "password": "admin",
  "type": "admin"
}
```

---

## ❗ Observações

* O sistema é **apenas demonstrativo**, sem autenticação real ou criptografia.
* Os dados são armazenados em arquivos `.txt` e `.json`.

---

## 📬 Licença

Este projeto é livre para uso pessoal e educacional. Sinta-se à vontade para modificar!
