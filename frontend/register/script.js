document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const type = e.target.type.value.trim();
    const password = e.target.password.value.trim();

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, type, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Erro no cadastro');
            return;
        }

        alert('Cadastro realizado com sucesso!');
        window.location.href = '../login/index.html';

    } catch (err) {
        console.error(err);
        alert('Erro de rede. Tente novamente.');
    }
});
