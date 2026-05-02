// Dados globais
let professores = [];
let turmas = [];
let laboratorios = [];
let aulasImportadas = [];
let alocacoes = [];
let conflitos = [];
let nextId = { professor: 1, turma: 1, lab: 1 };

const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const horarios = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

// ==================== FUNÇÕES PRINCIPAIS ====================
function carregarDados() {
    const data = localStorage.getItem("ekuikuiLabData");
    if (data) {
        const obj = JSON.parse(data);
        professores = obj.professores || [];
        turmas = obj.turmas || [];
        laboratorios = obj.laboratorios || [];
        aulasImportadas = obj.aulasImportadas || [];
        alocacoes = obj.alocacoes || [];
        conflitos = obj.conflitos || [];
        nextId = obj.nextId || { professor: professores.length+1, turma: turmas.length+1, lab: laboratorios.length+1 };
    }
    renderizarTudo();
}

function salvarDados() {
    localStorage.setItem("ekuikuiLabData", JSON.stringify({ 
        professores, turmas, laboratorios, aulasImportadas, alocacoes, conflitos, nextId 
    }));
}

// ==================== RENDERIZAÇÃO ====================
function renderizarTudo() {
    renderizarProfessores();
    renderizarTurmas();
    renderizarLaboratorios();
    renderizarEstatisticas();
    renderizarAulasPreview();
    renderizarHorarios();
    renderizarConflitos();
}

function renderizarEstatisticas() {
    document.getElementById("stats").innerHTML = `
        <div class="stat-card"><h3>${professores.length}</h3><p>Professores</p></div>
        <div class="stat-card"><h3>${turmas.length}</h3><p>Turmas</p></div>
        <div class="stat-card"><h3>${laboratorios.length}</h3><p>Laboratórios</p></div>
        <div class="stat-card"><h3>${aulasImportadas.length}</h3><p>Aulas Práticas</p></div>
        <div class="stat-card"><h3>${alocacoes.length}</h3><p>Aulas Alocadas</p></div>
    `;
    document.getElementById("conflitosCount").innerText = conflitos.length;
}

function renderizarProfessores() {
    const tbody = document.querySelector("#tabelaProfessores tbody");
    if (!tbody) return;
    if (professores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">Nenhum professor</td></tr>';
        return;
    }
    tbody.innerHTML = professores.map(p => `
        <tr>
            <td><strong>${p.nome}</strong></td>
            <td>${p.email}</td>
            <td><button class="btn-danger" style="padding:5px 12px;border-radius:20px;border:none;cursor:pointer;" onclick="removerProfessor(${p.id})">Remover</button></td>
        </tr>
    `).join('');
}

function renderizarTurmas() {
    const tbody = document.querySelector("#tabelaTurmas tbody");
    if (!tbody) return;
    if (turmas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Nenhuma turma</td></tr>';
        return;
    }
    tbody.innerHTML = turmas.map(t => `
        <tr>
            <td><strong>${t.nome}</strong></td>
            <td>${t.curso}</td>
            <td>${t.alunos}</td>
            <td><button class="btn-danger" style="padding:5px 12px;border-radius:20px;border:none;cursor:pointer;" onclick="removerTurma(${t.id})">Remover</button></td>
        </tr>
    `).join('');
}

function renderizarLaboratorios() {
    const tbody = document.querySelector("#tabelaLabs tbody");
    if (!tbody) return;
    if (laboratorios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">Nenhum laboratório</td></tr>';
        return;
    }
    tbody.innerHTML = laboratorios.map(l => `
        <tr>
            <td><strong>${l.nome}</strong></td>
            <td>${l.capacidade}</td>
            <td><button class="btn-danger" style="padding:5px 12px;border-radius:20px;border:none;cursor:pointer;" onclick="removerLab(${l.id})">Remover</button></td>
        </tr>
    `).join('');
}

function renderizarAulasPreview() {
    const container = document.getElementById("preview");
    if (!container) return;
    if (aulasImportadas.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">Nenhuma aula importada. Clique na área acima.</p>';
        return;
    }
    let html = '<table><thead><tr><th>Professor</th><th>Disciplina</th><th>Turma</th><th>Alunos</th><th>Dia</th><th>Hora</th><th>Tipo</th></tr></thead><tbody>';
    aulasImportadas.forEach(a => {
        html += `<tr>
            <td>${a.professor}</td>
            <td>${a.disciplina}</td>
            <td>${a.turma}</td>
            <td>${a.numAlunos}</td>
            <td>${a.dia}</td>
            <td>${a.horaInicio}-${a.horaFim}</td>
            <td>${a.tipo}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderizarHorarios() {
    const container = document.getElementById("horarioDisplay");
    if (!container) return;
    if (alocacoes.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;">Nenhum horário gerado. Clique em "Gerar Distribuição"</div>';
        return;
    }
    
    let html = '<table class="horario-table"><thead><tr><th>Horário</th><th>Segunda</th><th>Terça</th><th>Quarta</th><th>Quinta</th><th>Sexta</th></tr></thead><tbody>';
    
    for (let hora of horarios) {
        html += `<tr><td style="background:#1a1a2e;color:#ffd700;font-weight:bold;">${hora}</td>`;
        for (let dia of dias) {
            const aulas = alocacoes.filter(a => a.dia === dia && a.horaInicio === hora);
            if (aulas.length > 0) {
                html += '<td>';
                for (let a of aulas) {
                    html += `<div class="aula-card">
                        <strong>${a.disciplina}</strong><br>
                        <small>${a.professor}</small><br>
                        <small>🏫 ${a.labNome} (${a.labCap} lug.)</small>
                    </div>`;
                }
                html += '</td>';
            } else {
                html += '<td style="color:#ccc;">—</td>';
            }
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderizarConflitos() {
    const container = document.getElementById("conflitosList");
    if (!container) return;
    if (conflitos.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;">Nenhum conflito encontrado.</div>';
        return;
    }
    container.innerHTML = conflitos.map(c => `
        <div class="conflito-card">
            <strong>❌ ${c.disciplina}</strong> - Turma: ${c.turma} (${c.numAlunos} alunos)<br>
            <small>Professor: ${c.professor} | ${c.dia}</small><br>
            <span style="color:#dc2626;">Motivo: ${c.motivo}</span>
        </div>
    `).join('');
}

// ==================== IMPORTAÇÃO EXCEL ====================
function importarExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        if (rows.length === 0) {
            alert("Ficheiro vazio.");
            return;
        }
        
        aulasImportadas = [];
        for (let row of rows) {
            let professor = row.Professor || row.professor || "";
            let disciplina = row.Disciplina || row.disciplina || "";
            let turma = row.Turma || row.turma || "";
            let numAlunos = parseInt(row.Nº_Alunos) || parseInt(row.num_alunos) || 30;
            let dia = row.Dia || row.dia || "";
            let horaInicio = row.Hora_Inicio || row.hora_inicio || "";
            let horaFim = row.Hora_Fim || row.hora_fim || "12:00";
            let tipo = row.Tipo_Aula || row.tipo_aula || "Prática";
            
            if (professor && disciplina && dia && horaInicio) {
                aulasImportadas.push({
                    professor: String(professor).trim(),
                    disciplina: String(disciplina).trim(),
                    turma: String(turma).trim() || "Turma",
                    numAlunos: numAlunos,
                    dia: String(dia).trim(),
                    horaInicio: String(horaInicio).trim(),
                    horaFim: String(horaFim).trim(),
                    tipo: String(tipo).trim()
                });
            }
        }
        
        if (aulasImportadas.length === 0) {
            alert("Nenhuma aula válida encontrada.");
            return;
        }
        
        salvarDados();
        renderizarAulasPreview();
        renderizarEstatisticas();
        alert(`${aulasImportadas.length} aulas importadas!`);
    };
    reader.readAsArrayBuffer(file);
}

// ==================== ALGORITMO DE ALOCAÇÃO ====================
function gerarDistribuicao() {
    if (aulasImportadas.length === 0) {
        alert("Importe um Excel primeiro.");
        return;
    }
    
    let aulasPraticas = aulasImportadas.filter(a => a.tipo === "Prática" || a.tipo === "pratica");
    
    if (aulasPraticas.length === 0) {
        alert("Nenhuma aula prática encontrada.");
        return;
    }
    
    if (laboratorios.length === 0) {
        alert("Cadastre laboratórios primeiro.");
        return;
    }
    
    aulasPraticas.sort((a, b) => b.numAlunos - a.numAlunos);
    alocacoes = [];
    conflitos = [];
    
    let ocupacaoProfessor = {};
    let ocupacaoLab = {};
    
    for (let aula of aulasPraticas) {
        let alocado = false;
        
        for (let hora of horarios) {
            const chaveProf = `${aula.professor}_${aula.dia}_${hora}`;
            if (ocupacaoProfessor[chaveProf]) continue;
            
            let labsViaveis = laboratorios.filter(l => {
                const chaveLab = `${l.id}_${aula.dia}_${hora}`;
                return !ocupacaoLab[chaveLab] && l.capacidade >= aula.numAlunos;
            });
            labsViaveis.sort((a, b) => a.capacidade - b.capacidade);
            
            if (labsViaveis.length > 0) {
                const lab = labsViaveis[0];
                alocacoes.push({
                    professor: aula.professor,
                    disciplina: aula.disciplina,
                    turma: aula.turma,
                    numAlunos: aula.numAlunos,
                    dia: aula.dia,
                    horaInicio: hora,
                    horaFim: calcularHoraFim(hora),
                    labNome: lab.nome,
                    labCap: lab.capacidade
                });
                ocupacaoProfessor[chaveProf] = true;
                ocupacaoLab[`${lab.id}_${aula.dia}_${hora}`] = true;
                alocado = true;
                break;
            }
        }
        
        if (!alocado) {
            conflitos.push({
                professor: aula.professor,
                disciplina: aula.disciplina,
                turma: aula.turma,
                numAlunos: aula.numAlunos,
                dia: aula.dia,
                motivo: "Nenhum laboratório disponível com capacidade suficiente"
            });
        }
    }
    
    salvarDados();
    renderizarHorarios();
    renderizarConflitos();
    renderizarEstatisticas();
    alert(`Distribuição concluída! ${alocacoes.length} aulas alocadas, ${conflitos.length} conflitos.`);
}

function calcularHoraFim(hora) {
    const map = { "08:00": "09:30", "09:30": "11:00", "11:00": "12:30", "13:30": "15:00", "15:00": "16:30", "16:30": "18:00" };
    return map[hora] || "10:00";
}

function publicar() {
    if (conflitos.length > 0) {
        alert(`Ainda existem ${conflitos.length} conflitos. Resolva antes de publicar.`);
        return;
    }
    alert("Planeamento publicado com sucesso!");
}

// ==================== CRUD ====================
function removerProfessor(id) { professores = professores.filter(p => p.id !== id); salvarDados(); renderizarTudo(); }
function removerTurma(id) { turmas = turmas.filter(t => t.id !== id); salvarDados(); renderizarTudo(); }
function removerLab(id) { laboratorios = laboratorios.filter(l => l.id !== id); salvarDados(); renderizarTudo(); }

// ==================== EVENTOS ====================
document.getElementById("btnImportar").onclick = () => document.getElementById("fileInput").click();
document.getElementById("fileInput").onchange = (e) => { if (e.target.files[0]) importarExcel(e.target.files[0]); };
document.getElementById("btnGerar").onclick = gerarDistribuicao;
document.getElementById("btnPublicar").onclick = publicar;
document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem('labUser'); window.location.href = 'index.html'; };

function abrirModal(id) { document.getElementById(id).style.display = "flex"; }
function fecharModal(id) { document.getElementById(id).style.display = "none"; }

document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
        if (tab.dataset.tab === "tab-horarios") renderizarHorarios();
    };
});

window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };
window.removerProfessor = removerProfessor;
window.removerTurma = removerTurma;
window.removerLab = removerLab;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;

carregarDados();