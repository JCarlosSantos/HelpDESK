const user = JSON.parse(sessionStorage.getItem('user'));
if (!user || user.type !== 'technician') {
    window.location.href = '../login/index.html';
}

async function loadTickets() {
    try {
        const res = await fetch('/api/tickets');
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
                ${ticket.status !== 'encerrado' ? `
                    <textarea placeholder="Resposta..." id="response-${ticket.id}"></textarea>
                    <button onclick="respondTicket('${ticket.id}')">Responder e encerrar</button>
                ` : `<p><strong>Resposta:</strong> ${ticket.response}</p>`}
            `;

            list.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar chamados.');
    }
}

async function respondTicket(id) {
    const response = document.getElementById(`response-${id}`).value.trim();

    if (!response) {
        alert('Digite uma resposta antes de enviar.');
        return;
    }

    try {
        const res = await fetch(`/api/tickets/${id}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                response,
                technician_id: user.id
            })
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Erro ao responder chamado');
            return;
        }

        loadTickets();
    } catch (err) {
        console.error(err);
        alert('Erro de rede. Tente novamente.');
    }
}

document.querySelector('.logout').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/login/index.html';
});

loadTickets();
