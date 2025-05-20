document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Erro no login');
            return;
        }

        sessionStorage.setItem('user', JSON.stringify(data));

        switch (data.type) {
            case 'admin':
                window.location.href = '../admin/index.html';
                break;
            case 'technician':
                window.location.href = '../technician/index.html';
                break;
            default:
                window.location.href = '../client/index.html';
        }

    } catch (err) {
        console.error(err);
        alert('Erro de rede. Tente novamente.');
    }
});
