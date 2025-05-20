const user = JSON.parse(sessionStorage.getItem('user'));
if (!user || user.type !== 'client') {
    window.location.href = '../login/index.html';
}

async function loadTickets() {
    try {
        const res = await fetch(`/api/tickets/${user.id}`);
        const tickets = await res.json();

        const list = document.getElementById('tickets-list');
        list.innerHTML = '';

        if (!tickets.length) {
            list.innerHTML = '<p>Nenhum chamado encontrado.</p>';
            return;
        }

        tickets.forEach(ticket => {
            const div = document.createElement('div');
            div.className = 'ticket';
            div.innerHTML = `
                <h3>${ticket.title}</h3>
                <p><strong>Decrição:</strong> ${ticket.description}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Resposta:</strong> ${ticket.response}</p>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar chamados.');
    }
}

document.getElementById('ticket-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const description = e.target.description.value.trim();

    try {
        const res = await fetch('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                user_id: user.id
            })
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Erro ao abrir chamado');
            return;
        }

        e.target.reset();
        loadTickets();

    } catch (err) {
        console.error(err);
        alert('Erro de rede. Tente novamente.');
    }
});

document.querySelector('.logout').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/login/index.html';
});

loadTickets();
