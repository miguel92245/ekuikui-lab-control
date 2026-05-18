let professorAtual = null;
let professores = [];
let disciplinas = [];      // 👈 esta variável é essencial
let turmas = [];
let laboratorios = [];
let configDisciplinas = [];
let diasAulas = [];
let reclamacoes = [];
let alocacoes = [];

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
        diasAulas = obj.diasAulas || [];
        reclamacoes = obj.reclamacoes || [];
        alocacoes = obj.alocacoes || [];
    }
    renderizarHorario();
}

function salvarDados() {
    const data = localStorage.getItem("ekuikuiLabData");
    let obj = data ? JSON.parse(data) : {};
    obj.configDisciplinas = configDisciplinas;
    obj.diasAulas = diasAulas;
    obj.reclamacoes = reclamacoes;
    obj.alocacoes = alocacoes;
    localStorage.setItem("ekuikuiLabData", JSON.stringify(obj));
}

function abrirUnidadeCurricular() {
    const disciplinasProf = disciplinas.filter(d => d.professorId === professorAtual.id);
    const container = document.getElementById("listaDisciplinasModal");
    if (disciplinasProf.length === 0) {
        container.innerHTML = "<p>Nenhuma disciplina atribuída pela secretaria.</p>";
    } else {
        let html = "";
        for (let d of disciplinasProf) {
            const config = configDisciplinas.find(c => c.professorId === professorAtual.id && c.disciplina === d.nome);
            html += `<div class="disciplina-item-modal">
                <div><strong>${d.nome}</strong><br><small>${config ? config.totalAulas + " aulas, Lab: " + config.percLab + "%, Conf: " + config.percConf + "%" : "Não configurado"}</small></div>
                <button class="btn btn-primary" onclick="abrirConfigDisciplina('${d.nome}')">Configurar</button>
            </div>`;
        }
        container.innerHTML = html;
    }
    document.getElementById("modalUnidade").style.display = "flex";
}

function abrirConfigDisciplina(disciplinaNome) {
    const config = configDisciplinas.find(c => c.professorId === professorAtual.id && c.disciplina === disciplinaNome);
    document.getElementById("modalConfigTitulo").innerText = `Configurar ${disciplinaNome}`;
    document.getElementById("totalAulas").value = config ? config.totalAulas : "";
    document.getElementById("percLab").value = config ? config.percLab : "";
    document.getElementById("percConf").value = config ? (100 - config.percLab) : "";
    document.getElementById("modalConfigDisciplina").dataset.disciplina = disciplinaNome;
    document.getElementById("modalConfigDisciplina").style.display = "flex";
}

document.getElementById("percLab").addEventListener("input", function() {
    let lab = parseInt(this.value) || 0;
    if (lab > 80) { lab = 80; this.value = 80; }
    document.getElementById("percConf").value = 100 - lab;
});

document.getElementById("salvarConfigBtn").onclick = () => {
    const disciplina = document.getElementById("modalConfigDisciplina").dataset.disciplina;
    const totalAulas = parseInt(document.getElementById("totalAulas").value);
    const percLab = parseInt(document.getElementById("percLab").value);
    const percConf = parseInt(document.getElementById("percConf").value);
    if (!totalAulas || !percLab) { alert("Preencha todos os campos"); return; }
    const index = configDisciplinas.findIndex(c => c.professorId === professorAtual.id && c.disciplina === disciplina);
    const config = { professorId: professorAtual.id, professorNome: professorAtual.nome, disciplina, totalAulas, percLab, percConf };
    if (index === -1) configDisciplinas.push(config);
    else configDisciplinas[index] = config;
    salvarDados();
    fecharModal('modalConfigDisciplina');
    alert("Configuração salva!");
};

document.getElementById("btnUnidadeCurricular").onclick = () => abrirUnidadeCurricular();
document.getElementById("btnDiasAulas").onclick = () => document.getElementById("modalDias").style.display = "flex";

document.getElementById("salvarDiasBtn").onclick = () => {
    const dataAula = document.getElementById("dataAula").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;
    if (!dataAula || !horaInicio || !horaFim) { alert("Preencha todos os campos"); return; }
    diasAulas.push({ professorId: professorAtual.id, data: dataAula, horaInicio, horaFim });
    salvarDados();
    fecharModal('modalDias');
    document.getElementById("dataAula").value = "";
    document.getElementById("horaInicio").value = "";
    document.getElementById("horaFim").value = "";
    alert("Dia de aula salvo!");
};

function renderizarHorario() {
    const minhasAulas = alocacoes.filter(a => a.professorNome === professorAtual.nome);
    const tbody = document.getElementById("horarioBody");
    if (minhasAulas.length === 0) { tbody.innerHTML = '<tr><td colspan="5">Nenhum horário publicado</td></tr>'; return; }
    let html = "";
    for (let a of minhasAulas) {
        html += `<tr><td>${a.dia}</td><td>${a.disciplina}</td><td>${a.turma}</td><td>${a.horaInicio} - ${a.horaFim}</td><td>${a.labNome} (${a.labCapacidade} lug.)</td></tr>`;
    }
    tbody.innerHTML = html;
}

document.getElementById("reclamarBtn").onclick = () => {
    const msg = document.getElementById("reclamacaoMsg").value.trim();
    if (!msg) { alert("Escreva a reclamação"); return; }
    reclamacoes.push({ id: Date.now(), professorId: professorAtual.id, professorNome: professorAtual.nome, mensagem: msg, data: new Date().toLocaleString() });
    salvarDados();
    document.getElementById("reclamacaoMsg").value = "";
    alert("Reclamação enviada!");
};

document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem('labUser'); window.location.href = 'index.html'; };
function fecharModal(id) { document.getElementById(id).style.display = "none"; }
window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };
function carregarDados() {
    const user = localStorage.getItem('labUser');
    if (!user) { window.location.href = 'index.html'; return; }
    professorAtual = JSON.parse(user);
    document.getElementById("profNome").innerText = professorAtual.nome;

    const data = localStorage.getItem("ekuikuiLabData");
    if (data) {
        const obj = JSON.parse(data);
        professores = obj.professores || [];
        turmas = obj.turmas || [];
        laboratorios = obj.laboratorios || [];
        configDisciplinas = obj.configDisciplinas || [];
        diasAulas = obj.diasAulas || [];
        reclamacoes = obj.reclamacoes || [];
        alocacoes = obj.alocacoes || [];

        // 👇 IMPORTANTE: Buscar as disciplinas do professor atual
        const professorLogado = professores.find(p => p.id === professorAtual.id);
        if (professorLogado && professorLogado.disciplinas) {
            disciplinas = professorLogado.disciplinas.map(d => ({
                nome: d,
                professorId: professorAtual.id
            }));
        } else {
            disciplinas = [];
        }
    }
    renderizarHorario();
}