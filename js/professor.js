// professor.js - versão com visual igual ao da secretaria

let professorAtual = null;
let professores = [];
let disciplinas = [];
let configDisciplinas = [];
let reclamacoes = [];
let alocacoes = [];

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

function carregarDados() {
    const user = localStorage.getItem('labUser');
    if (!user) { window.location.href = 'index.html'; return; }
    professorAtual = JSON.parse(user);
    document.getElementById("profNome").innerText = professorAtual.nome;

    const data = localStorage.getItem("ekuikuiLabData");
    if (data) {
        const obj = JSON.parse(data);
        professores = obj.professores || [];
        disciplinas = obj.disciplinas || [];
        configDisciplinas = obj.configDisciplinas || [];
        reclamacoes = obj.reclamacoes || [];
        alocacoes = obj.alocacoes || [];
    }
    renderizarDisciplinas();
    renderizarHorario();
    atualizarEstatisticas();
}

function salvarDados() {
    const data = localStorage.getItem("ekuikuiLabData");
    let obj = data ? JSON.parse(data) : {};
    obj.configDisciplinas = configDisciplinas;
    obj.reclamacoes = reclamacoes;
    obj.alocacoes = alocacoes;
    localStorage.setItem("ekuikuiLabData", JSON.stringify(obj));
}

function atualizarEstatisticas() {
    const disciplinasProf = disciplinas.filter(d => d.professorId === professorAtual.id);
    document.getElementById("totalDisciplinas").innerText = disciplinasProf.length;
    
    const aulasPraticas = configDisciplinas.filter(c => c.professorId === professorAtual.id)
        .reduce((sum, c) => sum + Math.round(c.totalAulas * (c.percPratica / 100)), 0);
    document.getElementById("totalAulas").innerText = aulasPraticas;
    
    const aulasAlocadas = alocacoes.filter(a => a.professorNome === professorAtual.nome).length;
    document.getElementById("totalHorarios").innerText = aulasAlocadas;
}

function renderizarDisciplinas() {
    const disciplinasProf = disciplinas.filter(d => d.professorId === professorAtual.id);
    const container = document.getElementById("listaDisciplinas");
    if (disciplinasProf.length === 0) {
        container.innerHTML = "<div style='text-align:center; padding:2rem; color:#999;'>Nenhuma disciplina atribuída pela secretaria.</div>";
        return;
    }
    let html = "";
    for (let d of disciplinasProf) {
        const config = configDisciplinas.find(c => c.professorId === professorAtual.id && c.disciplina === d.nome);
        html += `<div class="disciplina-card">
            <div class="disciplina-info">
                <h4>${d.nome}</h4>
                <p>${config ? `${config.totalAulas} aulas, ${config.percPratica}% prática, ${config.percTeorica}% teórica` : "Não configurado"}</p>
            </div>
            <button class="btn btn-primary" onclick="abrirConfig('${d.nome}')"><i class="fas fa-cog"></i> Configurar</button>
        </div>`;
    }
    container.innerHTML = html;
}

function abrirConfig(disciplinaNome) {
    const config = configDisciplinas.find(c => c.professorId === professorAtual.id && c.disciplina === disciplinaNome);
    document.getElementById("modalTitulo").innerText = `Configurar ${disciplinaNome}`;
    document.getElementById("totalAulas").value = config ? config.totalAulas : "";
    document.getElementById("percPratica").value = config ? config.percPratica : "";
    document.getElementById("percTeorica").value = config ? (100 - config.percPratica) : "";
    document.getElementById("horaInicio").value = config ? config.horaInicio : "";
    document.getElementById("horaFim").value = config ? config.horaFim : "";
    
    let diasHtml = "";
    for (let dia of diasSemana) {
        let checked = config && config.dias && config.dias.includes(dia) ? "checked" : "";
        diasHtml += `<label><input type="checkbox" value="${dia}" ${checked}> ${dia}</label>`;
    }
    document.getElementById("diasCheckbox").innerHTML = diasHtml;
    
    document.getElementById("modalConfig").dataset.disciplina = disciplinaNome;
    document.getElementById("modalConfig").style.display = "flex";
}

document.getElementById("percPratica").addEventListener("input", function() {
    let pratica = parseInt(this.value) || 0;
    if (pratica > 80) { pratica = 80; this.value = 80; }
    document.getElementById("percTeorica").value = 100 - pratica;
});

document.getElementById("salvarConfigBtn").onclick = () => {
    const disciplina = document.getElementById("modalConfig").dataset.disciplina;
    const totalAulas = parseInt(document.getElementById("totalAulas").value);
    const percPratica = parseInt(document.getElementById("percPratica").value);
    const percTeorica = parseInt(document.getElementById("percTeorica").value);
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;
    const dias = Array.from(document.querySelectorAll("#diasCheckbox input:checked")).map(cb => cb.value);
    
    if (!totalAulas || !percPratica || !horaInicio || !horaFim || dias.length === 0) {
        alert("Preencha todos os campos!");
        return;
    }
    
    const index = configDisciplinas.findIndex(c => c.professorId === professorAtual.id && c.disciplina === disciplina);
    const config = { professorId: professorAtual.id, professorNome: professorAtual.nome, disciplina, totalAulas, percPratica, percTeorica, dias, horaInicio, horaFim };
    if (index === -1) configDisciplinas.push(config);
    else configDisciplinas[index] = config;
    
    salvarDados();
    fecharModal();
    renderizarDisciplinas();
    atualizarEstatisticas();
    alert("Configuração salva!");
};

function fecharModal() { document.getElementById("modalConfig").style.display = "none"; }

function renderizarHorario() {
    const minhasAulas = alocacoes.filter(a => a.professorNome === professorAtual.nome);
    const tbody = document.getElementById("horarioBody");
    if (minhasAulas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Nenhum horário publicado ainda. Aguarde a secretaria.</td></tr>';
        return;
    }
    let html = "";
    for (let a of minhasAulas) {
        html += `<tr>
            <td>${a.dia}</td>
            <td>${a.disciplina}</td>
            <td>${a.turma || "N/A"}</td>
            <td>${a.horaInicio} - ${a.horaFim}</td>
            <td>${a.labNome} (${a.labCapacidade} lug.)</td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

document.getElementById("alterarSenhaBtn").onclick = () => {
    const novaSenha = document.getElementById("novaSenha").value.trim();
    if (!novaSenha) { alert("Digite uma nova senha"); return; }
    const idx = professores.findIndex(p => p.id === professorAtual.id);
    if (idx !== -1) professores[idx].senha = novaSenha;
    professorAtual.senha = novaSenha;
    const data = localStorage.getItem("ekuikuiLabData");
    if (data) { let obj = JSON.parse(data); obj.professores = professors; localStorage.setItem("ekuikuiLabData", JSON.stringify(obj)); }
    document.getElementById("novaSenha").value = "";
    alert("Senha alterada com sucesso!");
};

document.getElementById("reclamarBtn").onclick = () => {
    const mensagem = document.getElementById("reclamacaoMsg").value.trim();
    if (!mensagem) { alert("Escreva a reclamação"); return; }
    reclamacoes.push({ id: Date.now(), professorId: professorAtual.id, professorNome: professorAtual.nome, mensagem, data: new Date().toLocaleString() });
    salvarDados();
    document.getElementById("reclamacaoMsg").value = "";
    alert("Reclamação enviada!");
};

document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem('labUser'); window.location.href = 'index.html'; };
window.onclick = (e) => { if (e.target.classList.contains('modal')) fecharModal(); };
carregarDados();