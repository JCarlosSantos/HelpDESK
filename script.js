function abrirModal(mensagem, callback) {
    document.getElementById('modalMessage').innerText = mensagem;
    document.getElementById('modal').style.display = "flex";
    document.getElementById('modal').callback = callback;
}

function fecharModal() {
    document.getElementById('modal').style.display = "none";
    if (document.getElementById('modal').callback) {
        document.getElementById('modal').callback();
    }
}

document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const permissao = document.getElementById('permissao').value;

    if (!nome || !email || !senha) {
        abrirModal("⚠️ Todos os campos são obrigatórios!");
        return;
    }

    localStorage.setItem('usuario', JSON.stringify({ nome, email, senha, permissao }));

    abrirModal(`✅ Cadastro realizado com sucesso!`, () => {
        document.getElementById('cadastro').style.display = "none";

        if (permissao === "tecnico") {
            document.getElementById('todosChamados').style.display = "block";
            listarChamadosTecnico();
        } else {
            document.getElementById('chamados').style.display = "block";
            document.getElementById('meusChamados').style.display = "block";
            mostrarMeusChamados();
        }
    });
});

document.getElementById('chamadoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

    if (!titulo || !descricao) {
        abrirModal("⚠️ Preencha todos os campos!");
        return;
    }

    const chamado = {
        id: Date.now(),
        titulo,
        descricao,
        status: "Aberto",
        usuarioEmail: usuarioSalvo.email,
        dataCriacao: new Date().toLocaleString(),
        respostas: [],
    };

    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];
    chamados.push(chamado);
    localStorage.setItem('chamados', JSON.stringify(chamados));

    abrirModal("✅ Chamado aberto com sucesso!", () => {
        document.getElementById('chamados').style.display = "none";
        document.getElementById('meusChamados').style.display = "block";
        mostrarMeusChamados();
    });
});

function mostrarMeusChamados() {
    let lista = document.getElementById('listaChamados');
    lista.innerHTML = "";

    let usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];
    let chamadosUsuario = chamados.filter(chamado => chamado.usuarioEmail === usuarioSalvo.email);

    if (chamadosUsuario.length === 0) {
        lista.innerHTML = "<p>📌 Nenhum chamado encontrado.</p>";
    } else {
        chamadosUsuario.forEach(chamado => {
            lista.innerHTML += `<div class="chamado-box">
                <h3>${chamado.titulo}</h3>
                <p>${chamado.descricao}</p>
                <p><strong>Status:</strong> ${chamado.status}</p>
                <p><strong>Data de criação:</strong> ${chamado.dataCriacao}</p>
                <button class="btn" onclick="visualizarChamado(${chamado.id})">Visualizar</button>
            </div><hr>`;
        });
    }
}

function listarChamadosTecnico() {
    let lista = document.getElementById("listaChamadosTecnico");
    lista.innerHTML = "";

    let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
    let chamadosAbertos = chamados.filter(c => c.status === "Aberto");

    if (chamadosAbertos.length === 0) {
        lista.innerHTML = "<p>📌 Nenhum chamado aberto no momento.</p>";
    } else {
        chamadosAbertos.forEach(chamado => {
            lista.innerHTML += `<div class='chamado-box'>
                <h3>${chamado.titulo}</h3>
                <p><strong>Status:</strong> ${chamado.status} | <strong>Data:</strong> ${chamado.dataCriacao}</p>
                <button class="btn" onclick="abrirChamadoTecnico(${chamado.id})">Ver detalhes</button>
            </div>`;
        });
    }
}


function abrirChamadoTecnico(idChamado) {
    let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
    let chamadoSelecionado = chamados.find(c => c.id == idChamado);

    if (!chamadoSelecionado) {
        abrirModal("❌ Chamado não encontrado.");
        return;
    }

    document.getElementById("tituloChamadoTecnico").innerText = chamadoSelecionado.titulo;
    document.getElementById("descricaoChamadoTecnico").innerText = chamadoSelecionado.descricao;
    document.getElementById("statusChamadoTecnico").innerText = chamadoSelecionado.status;
    document.getElementById("dataCriacaoChamadoTecnico").innerText = chamadoSelecionado.dataCriacao;
    document.getElementById("dataResolucaoChamadoTecnico").innerText = chamadoSelecionado.dataResolucao || "--";

    document.getElementById("tecnicoChamado").setAttribute("data-id", idChamado);
    document.getElementById("todosChamados").style.display = "none";
    document.getElementById("tecnicoChamado").style.display = "block";
}

function fecharChamadoTecnico() {
    let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
    let idChamado = document.getElementById("tecnicoChamado").getAttribute("data-id");
    let chamadoSelecionado = chamados.find(c => c.id == idChamado);

    if (!chamadoSelecionado) {
        abrirModal("❌ Chamado não encontrado.");
        return;
    }

    chamadoSelecionado.status = "Fechado";
    chamadoSelecionado.dataResolucao = new Date().toLocaleString();

    localStorage.setItem("chamados", JSON.stringify(chamados));

    abrirModal("✅ Chamado fechado com sucesso!", () => {
        document.getElementById("tecnicoChamado").style.display = "none";
        document.getElementById("todosChamados").style.display = "block";

        listarChamadosTecnico();
    });
}

function salvarRespostaTecnico() {
    const respostaTexto = document.getElementById("respostaTextoTecnico").value.trim();
    if (!respostaTexto) {
        abrirModal("⚠️ A resposta não pode estar vazia!");
        return;
    }

    let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
    let idChamado = document.getElementById("tecnicoChamado").getAttribute("data-id");
    let chamadoSelecionado = chamados.find(c => c.id == idChamado);

    if (!chamadoSelecionado) {
        abrirModal("❌ Chamado não encontrado.");
        return;
    }

    chamadoSelecionado.respostas.push({
        atendente: "Técnico",
        texto: respostaTexto,
        data: new Date().toLocaleString(),
    });

    localStorage.setItem("chamados", JSON.stringify(chamados));

    abrirModal("✅ Resposta enviada com sucesso!", () => {
        document.getElementById("respostaTextoTecnico").value = "";
        abrirChamadoTecnico(idChamado);
    });
}


function voltarTecnico() {
    document.getElementById("tecnicoChamado").style.display = "none"; 
    document.getElementById("todosChamados").style.display = "block"; 
    listarChamadosTecnico();
}
