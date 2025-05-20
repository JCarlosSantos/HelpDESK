const user = JSON.parse(sessionStorage.getItem('user'));
if (!user || user.type !== 'admin') {
    window.location.href = '../login/index.html';
}

async function loadUsers() {
    try {
        const res = await fetch('/api/users');
        const users = await res.json();

        const list = document.getElementById('users-list');
        list.innerHTML = '';

        if (!users.length) {
            list.innerHTML = '<p>Nenhum usuário encontrado.</p>';
            return;
        }

        users.forEach(u => {
            const div = document.createElement('div');
            div.className = 'user';
            div.innerHTML = `
                <p><strong>Nome:</strong> ${u.name}</p>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Tipo:</strong> ${u.type}</p>
                <div class="user-actions">
                    <button class="edit-btn" onclick="editUser('${u.id}')">Editar</button>
                    <button class="delete-btn" onclick="deleteUser('${u.id}')">Excluir</button>
                </div>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar usuários.');
    }
}

function editUser(id) {
    const newName = prompt('Novo nome:');
    const newEmail = prompt('Novo email:');

    if (!newName || !newEmail) return;

    fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail })
    })
    .then(res => {
        if (!res.ok) return res.json().then(d => { throw new Error(d.error); });
        loadUsers();
    })
    .catch(err => alert(err.message));
}

function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    fetch(`/api/users/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) return res.json().then(d => { throw new Error(d.error); });
        loadUsers();
    })
    .catch(err => alert(err.message));
}

document.querySelector('.logout').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/login/index.html';
});

loadUsers();
