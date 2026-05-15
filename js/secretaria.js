// Dados globais
let professores = [];
let turmas = [];
let laboratorios = [];
let salas = [];
let alocacoes = [];
let conflitos = [];
let nextId = { professor: 1, turma: 1, lab: 1, sala: 1 };

const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const horarios = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

// Verificar login
const userStr = localStorage.getItem('labUser');
if (!userStr) { window.location.href = 'index.html'; }
else {
    try {
        const user = JSON.parse(userStr);
        if (user.tipo !== 'secretaria') window.location.href = 'index.html';
    } catch(e) { window.location.href = 'index.html'; }
}

// ==================== FUNÇÕES ====================
function carregarDados() {
    const data = localStorage.getItem("ekuikuiLabData");
    if (data) {
        const obj = JSON.parse(data);
        professores = obj.professores || [];
        turmas = obj.turmas || [];
        laboratorios = obj.laboratorios || [];
        salas = obj.salas || [];
        alocacoes = obj.alocacoes || [];
        conflitos = obj.conflitos || [];
        nextId = obj.nextId || { professor: professores.length+1, turma: turmas.length+1, lab: laboratorios.length+1, sala: salas.length+1 };
    }
    renderizarTudo();
}

function salvarDados() {
    localStorage.setItem("ekuikuiLabData", JSON.stringify({ 
        professores, turmas, laboratorios, salas, alocacoes, conflitos, nextId 
    }));
}

function renderizarTudo() {
    renderizarProfessores();
    renderizarTurmas();
    renderizarSalas();
    renderizarLaboratorios();
    renderizarEstatisticas();
    renderizarConflitos();
}

function renderizarEstatisticas() {
    document.getElementById("totalProfessores").innerText = professores.length;
    document.getElementById("totalTurmas").innerText = turmas.length;
    document.getElementById("totalSalas").innerText = salas.length;
    document.getElementById("totalLaboratorios").innerText = laboratorios.length;
    document.getElementById("conflitosCount").innerText = conflitos.length;
}

function renderizarProfessores() {
    const tbody = document.querySelector("#tabelaProfessores tbody");
    if (!tbody) return;
    if (professores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhum professor cadastrado</td></tr>';
        return;
    }
    let html = '';
    for (let p of professores) {
        html += `<tr>
            <td><strong>${p.nome}</strong></td>
            <td>${p.email}</td>
            <td>${p.disciplinas ? p.disciplinas.join(", ") : "Nenhuma"}</td>
            <td><button class="btn-danger" onclick="removerProfessor(${p.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarTurmas() {
    const tbody = document.querySelector("#tabelaTurmas tbody");
    if (!tbody) return;
    if (turmas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhuma turma cadastrada</td></tr>';
        return;
    }
    let html = '';
    for (let t of turmas) {
        html += `<tr>
            <td><strong>${t.nome}</strong></td>
            <td>${t.curso}</td>
            <td>${t.alunos}</td>
            <td><button class="btn-danger" onclick="removerTurma(${t.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarSalas() {
    const tbody = document.querySelector("#tabelaSalas tbody");
    if (!tbody) return;
    if (salas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhuma sala cadastrada</td></tr>';
        return;
    }
    let html = '';
    for (let s of salas) {
        html += `<tr>
            <td><strong>${s.nome}</strong></td>
            <td>${s.capacidade}</td>
            <td><button class="btn-danger" onclick="removerSala(${s.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarLaboratorios() {
    const tbody = document.querySelector("#tabelaLaboratorios tbody");
    if (!tbody) return;
    if (laboratorios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum laboratório cadastrado</td></tr>';
        return;
    }
    let html = '';
    for (let l of laboratorios) {
        html += `<tr>
            <td><strong>${l.nome}</strong></td>
            <td>${l.capacidade}</td>
            <td><button class="btn-danger" onclick="removerLab(${l.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarConflitos() {
    const container = document.getElementById("conflitosList");
    if (!container) return;
    if (conflitos.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;">Nenhum conflito encontrado.</div>';
        return;
    }
    let html = '';
    for (let c of conflitos) {
        html += `<div class="conflito-card">
            <strong>❌ ${c.disciplina}</strong> - Turma: ${c.turma} (${c.numAlunos} alunos)<br>
            <small>Professor: ${c.professor} | ${c.dia}</small><br>
            <span style="color:#dc2626;">Motivo: ${c.motivo}</span>
        </div>`;
    }
    container.innerHTML = html;
}

// ==================== CRUD ====================
function removerProfessor(id) { professores = professores.filter(p => p.id !== id); salvarDados(); renderizarTudo(); }
function removerTurma(id) { turmas = turmas.filter(t => t.id !== id); salvarDados(); renderizarTudo(); }
function removerSala(id) { salas = salas.filter(s => s.id !== id); salvarDados(); renderizarTudo(); }
function removerLab(id) { laboratorios = laboratorios.filter(l => l.id !== id); salvarDados(); renderizarTudo(); }

// ==================== CADASTROS (SEM ALERTAS) ====================
document.getElementById("formProfessor").addEventListener("submit", (e) => {
    e.preventDefault();
    let nome = document.getElementById("profNome").value.trim();
    let email = document.getElementById("profEmail").value.trim();
    let senha = document.getElementById("profSenha").value;
    let disciplinasTexto = document.getElementById("profDisciplinas").value.trim();
    let disciplinas = disciplinasTexto ? disciplinasTexto.split(",").map(d => d.trim()) : [];
    
    if (nome && email) {
        professores.push({
            id: nextId.professor++,
            nome, email, senha, disciplinas
        });
        salvarDados();
        renderizarTudo();
        fecharModal("modalProfessor");
        document.getElementById("formProfessor").reset();
    }
});

document.getElementById("formTurma").addEventListener("submit", (e) => {
    e.preventDefault();
    turmas.push({
        id: nextId.turma++,
        nome: document.getElementById("turmaNome").value.trim(),
        curso: document.getElementById("turmaCurso").value.trim(),
        alunos: parseInt(document.getElementById("turmaAlunos").value)
    });
    salvarDados();
    renderizarTudo();
    fecharModal("modalTurma");
    document.getElementById("formTurma").reset();
});

document.getElementById("formSala").addEventListener("submit", (e) => {
    e.preventDefault();
    salas.push({
        id: nextId.sala++,
        nome: document.getElementById("salaNome").value.trim(),
        capacidade: parseInt(document.getElementById("salaCapacidade").value)
    });
    salvarDados();
    renderizarTudo();
    fecharModal("modalSala");
    document.getElementById("formSala").reset();
});

document.getElementById("formLab").addEventListener("submit", (e) => {
    e.preventDefault();
    laboratorios.push({
        id: nextId.lab++,
        nome: document.getElementById("labNome").value.trim(),
        capacidade: parseInt(document.getElementById("labCap").value)
    });
    salvarDados();
    renderizarTudo();
    fecharModal("modalLab");
    document.getElementById("formLab").reset();
});

// ==================== EVENTOS ====================
document.getElementById("btnGerar").onclick = () => {};
document.getElementById("btnPublicar").onclick = () => {};
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem('labUser');
    window.location.href = 'index.html';
};

function abrirModal(id) { document.getElementById(id).style.display = "flex"; }
function fecharModal(id) { document.getElementById(id).style.display = "none"; }

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    };
});

window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };
window.removerProfessor = removerProfessor;
window.removerTurma = removerTurma;
window.removerSala = removerSala;
window.removerLab = removerLab;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;

carregarDados();