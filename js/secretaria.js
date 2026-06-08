// secretaria.js - usando API (CORRIGIDO)

let professores = [];
let turmas = [];
let laboratorios = [];
let salas = [];
let alocacoes = [];
let conflitos = [];

// ==================== CARREGAR CONFIGURAÇÕES DOS PROFESSORES ====================
async function carregarConfiguracoes() {
    try {
        const data = await apiRequest('/secretaria/configuracoes');
        const configuracoes = data.configuracoes || [];
        
        const tbody = document.querySelector("#tabelaConfig tbody");
        if (!tbody) return;
        
        if (configuracoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Nenhuma configuração enviada pelos professores</td></tr>';
            return;
        }
        
        let html = '';
        for (let c of configuracoes) {
            html += `<tr>
                <td>${c.professor_nome || '?'}</td>
                <td>${c.disciplina_nome || '?'}</td>
                <td>${c.total_aulas || '?'}</td>
                <td>${c.perc_lab || '?'}%</td>
                <td>${c.perc_conf || '?'}%</td>
            </tr>`;
        }
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// ==================== CARREGAR DADOS INICIAIS ====================
async function carregarDados() {
    try {
        // Verificar login
        const userStr = localStorage.getItem('labUser') || sessionStorage.getItem('labUser');
        if (!userStr) {
            window.location.href = 'index.html';
            return;
        }
        
        const user = JSON.parse(userStr);
        if (user.tipo !== 'secretaria') {
            window.location.href = 'index.html';
            return;
        }
        
        // Carregar todos os dados
        await Promise.all([
            carregarProfessores(),
            carregarTurmas(),
            carregarLaboratorios(),
            carregarSalas(),
            carregarAlocacoes(),
            carregarConflitos()
        ]);
        
        renderizarEstatisticas();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// ==================== CARREGAR PROFESSORES ====================
async function carregarProfessores() {
    try {
        const data = await apiRequest('/secretaria/professores');
        professores = data.professores || [];
        renderizarProfessores();
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        professores = [];
        renderizarProfessores();
    }
}

// ==================== CARREGAR TURMAS ====================
async function carregarTurmas() {
    try {
        const data = await apiRequest('/secretaria/turmas');
        turmas = data.turmas || [];
        renderizarTurmas();
    } catch (error) {
        console.error('Erro ao carregar turmas:', error);
        turmas = [];
        renderizarTurmas();
    }
}

// ==================== CARREGAR LABORATÓRIOS ====================
async function carregarLaboratorios() {
    try {
        const data = await apiRequest('/secretaria/laboratorios');
        laboratorios = data.laboratorios || [];
        renderizarLaboratorios();
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        laboratorios = [];
        renderizarLaboratorios();
    }
}

// ==================== CARREGAR SALAS ====================
async function carregarSalas() {
    try {
        const data = await apiRequest('/secretaria/salas');
        salas = data.salas || [];
        renderizarSalas();
    } catch (error) {
        console.error('Erro ao carregar salas:', error);
        salas = [];
        renderizarSalas();
    }
}

// ==================== CARREGAR ALOCAÇÕES ====================
async function carregarAlocacoes() {
    try {
        const data = await apiRequest('/alocacao');
        alocacoes = data.alocacoes || [];
    } catch (error) {
        console.error('Erro ao carregar alocações:', error);
        alocacoes = [];
    }
}

// ==================== CARREGAR CONFLITOS ====================
async function carregarConflitos() {
    try {
        const data = await apiRequest('/alocacao/conflitos');
        conflitos = data.conflitos || [];
        renderizarConflitos();
    } catch (error) {
        console.error('Erro ao carregar conflitos:', error);
        conflitos = [];
        renderizarConflitos();
    }
}

// ==================== RENDERIZAÇÃO ====================
function renderizarProfessores() {
    const tbody = document.querySelector("#tabelaProfessores tbody");
    if (!tbody) return;
    
    if (!professores || professores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Nenhum professor cadastrado</td></tr>';
        return;
    }
    
    let html = '';
    for (let p of professores) {
        html += `<tr>
            <td><strong>${p.nome || '?'}</strong></td>
            <td>${p.email || '?'}</td>
            <td>${p.disciplinas || 'Nenhuma'}</td>
            <td><button class="btn-danger" onclick="removerProfessor(${p.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarTurmas() {
    const tbody = document.querySelector("#tabelaTurmas tbody");
    if (!tbody) return;
    
    if (!turmas || turmas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Nenhuma turma cadastrada</td></tr>';
        return;
    }
    
    let html = '';
    for (let t of turmas) {
        html += `<tr>
            <td><strong>${t.nome || '?'}</strong></td>
            <td>${t.curso || '?'}</td>
            <td>${t.num_alunos || '?'}</td>
            <td><button class="btn-danger" onclick="removerTurma(${t.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarLaboratorios() {
    const tbody = document.querySelector("#tabelaLaboratorios tbody");
    if (!tbody) return;
    
    if (!laboratorios || laboratorios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">Nenhum laboratório cadastrado</td></tr>';
        return;
    }
    
    let html = '';
    for (let l of laboratorios) {
        html += `<tr>
            <td><strong>${l.nome || '?'}</strong></td>
            <td>${l.capacidade || '?'}</td>
            <td><button class="btn-danger" onclick="removerLab(${l.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarSalas() {
    const tbody = document.querySelector("#tabelaSalas tbody");
    if (!tbody) return;
    
    if (!salas || salas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">Nenhuma sala cadastrada</td></tr>';
        return;
    }
    
    let html = '';
    for (let s of salas) {
        html += `<tr>
            <td><strong>${s.nome || '?'}</strong></td>
            <td>${s.capacidade || '?'}</td>
            <td><button class="btn-danger" onclick="removerSala(${s.id})">Remover</button></td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderizarConflitos() {
    const container = document.getElementById("conflitosList");
    if (!container) return;
    
    if (!conflitos || conflitos.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;">Nenhum conflito encontrado.</div>';
        return;
    }
    
    let html = '';
    for (let c of conflitos) {
        html += `<div class="conflito-card">
            <strong>❌ ${c.disciplina || '?'}</strong> - Turma: ${c.turma_nome || '?'}<br>
            <small>Professor: ${c.professor_nome || '?'} | ${c.dia || '?'}</small><br>
            <span style="color:#dc2626;">Motivo: ${c.motivo || '?'}</span>
        </div>`;
    }
    container.innerHTML = html;
}

function renderizarEstatisticas() {
    const profElem = document.getElementById("totalProfessores");
    const turmasElem = document.getElementById("totalTurmas");
    const salasElem = document.getElementById("totalSalas");
    const labsElem = document.getElementById("totalLaboratorios");
    const conflitosElem = document.getElementById("conflitosCount");
    
    if (profElem) profElem.innerText = professores ? professores.length : 0;
    if (turmasElem) turmasElem.innerText = turmas ? turmas.length : 0;
    if (salasElem) salasElem.innerText = salas ? salas.length : 0;
    if (labsElem) labsElem.innerText = laboratorios ? laboratorios.length : 0;
    if (conflitosElem) conflitosElem.innerText = conflitos ? conflitos.length : 0;
}

// ==================== CRUD (USANDO API) ====================
async function removerProfessor(id) {
    if (!confirm('Remover este professor?')) return;
    try {
        await apiRequest(`/secretaria/professores/${id}`, { method: 'DELETE' });
        await carregarProfessores();
        renderizarEstatisticas();
        mostrarToast('Professor removido com sucesso', 'success');
    } catch (error) {
        mostrarToast('Erro ao remover professor', 'error');
    }
}

async function carregarReclamacoes() { // Função assíncrona pra buscar reclamações
    const div = document.getElementById('aba-reclamacoes'); // Pega div da aba reclamações

    try { // Tenta buscar da API
        const res = await fetch('/api/reclamacoes'); // Faz GET na rota da API
        const reclamacoes = await res.json(); // Converte resposta pra array JS

        if(reclamacoes.length === 0) { // Verifica se array está vazio
            div.innerHTML = '<p>Nenhuma reclamação registrada</p>'; // Mostra mensagem vazia
            return; // Para função aqui
        }

        let html = '<h3>Reclamações dos Professores</h3>'; // Inicia HTML com título
        reclamacoes.forEach(r => { // Percorre cada reclamação
            html += `<div style="border:1px solid #ccc; margin:10px; padding:10px">`; // Abre card com borda
            html += `<b>Prof: ${r.prof_nome}</b><br>`; // Mostra nome do professor
            html += `<b>Assunto:</b> ${r.assunto}<br>`; // Mostra assunto
            html += `<b>Mensagem:</b> ${r.mensagem}<br>`; // Mostra mensagem que ele escreveu
            html += `<small>Enviado em: ${new Date(r.criado_em).toLocaleString()}</small>`; // Mostra data formatada
            html += `</div>`; // Fecha card
        });
        div.innerHTML = html; // Joga HTML dentro da div da secretaria
    } catch(erro) { // Se der erro
        div.innerHTML = '<p style="color:red">Erro ao carregar</p>'; // Mostra erro vermelho
    }
} // Fecha função



async function removerTurma(id) {
    if (!confirm('Remover esta turma?')) return;
    try {
        await apiRequest(`/secretaria/turmas/${id}`, { method: 'DELETE' });
        await carregarTurmas();
        renderizarEstatisticas();
        mostrarToast('Turma removida com sucesso', 'success');
    } catch (error) {
        mostrarToast('Erro ao remover turma', 'error');
    }
}

async function removerLab(id) {
    if (!confirm('Remover este laboratório?')) return;
    try {
        await apiRequest(`/secretaria/laboratorios/${id}`, { method: 'DELETE' });
        await carregarLaboratorios();
        renderizarEstatisticas();
        mostrarToast('Laboratório removido com sucesso', 'success');
    } catch (error) {
        mostrarToast('Erro ao remover laboratório', 'error');
    }
}

async function removerSala(id) {
    if (!confirm('Remover esta sala?')) return;
    try {
        await apiRequest(`/secretaria/salas/${id}`, { method: 'DELETE' });
        await carregarSalas();
        renderizarEstatisticas();
        mostrarToast('Sala removida com sucesso', 'success');
    } catch (error) {
        mostrarToast('Erro ao remover sala', 'error');
    }
}

// ==================== CADASTROS ====================
document.getElementById("formProfessor").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("profNome").value.trim();
    const email = document.getElementById("profEmail").value.trim();
    const senha = document.getElementById("profSenha").value;
    const disciplinas = document.getElementById("profDisciplinas").value.trim();
    
    if (!nome || !email || !senha) {
        mostrarToast('Preencha todos os campos', 'error');
        return;
    }
    // Validar domínio do email
const dominiosPermitidos = ['.ao', '.com', '.edu.ao'];

const dominioValido = dominiosPermitidos.some(dominio =>
    email.toLowerCase().endsWith(dominio)
);

if (!dominioValido) {
    return res.status(400).json({
        message: 'O email deve terminar com .ao, .com ou .edu.ao'
    });
}
    try {
        await apiRequest('/secretaria/professores', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha, disciplinas })
        });
        mostrarToast('Professor cadastrado com sucesso', 'success');
        fecharModal('modalProfessor');
        document.getElementById("formProfessor").reset();
        await carregarProfessores();
        renderizarEstatisticas();
    } catch (error) {
        mostrarToast('Erro ao cadastrar professor', 'error');
    }
});

document.getElementById("formTurma").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("turmaNome").value.trim();
    const curso = document.getElementById("turmaCurso").value.trim();
    const numAlunos = parseInt(document.getElementById("turmaAlunos").value);
    
    if (!nome || !curso || !numAlunos) {
        mostrarToast('Preencha todos os campos', 'error');
        return;
    }
    
    try {
        await apiRequest('/secretaria/turmas', {
            method: 'POST',
            body: JSON.stringify({ nome, curso, numAlunos })
        });
        mostrarToast('Turma cadastrada com sucesso', 'success');
        fecharModal('modalTurma');
        document.getElementById("formTurma").reset();
        await carregarTurmas();
        renderizarEstatisticas();
    } catch (error) {
        mostrarToast('Erro ao cadastrar turma', 'error');
    }
});

document.getElementById("formLab").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("labNome").value.trim();
    const capacidade = parseInt(document.getElementById("labCap").value);
    
    if (!nome || !capacidade) {
        mostrarToast('Preencha todos os campos', 'error');
        return;
    }
    
    try {
        await apiRequest('/secretaria/laboratorios', {
            method: 'POST',
            body: JSON.stringify({ nome, capacidade })
        });
        mostrarToast('Laboratório cadastrado com sucesso', 'success');
        fecharModal('modalLab');
        document.getElementById("formLab").reset();
        await carregarLaboratorios();
        renderizarEstatisticas();
    } catch (error) {
        mostrarToast('Erro ao cadastrar laboratório', 'error');
    }
});

document.getElementById("formSala").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("salaNome").value.trim();
    const capacidade = parseInt(document.getElementById("salaCapacidade").value);
    
    if (!nome || !capacidade) {
        mostrarToast('Preencha todos os campos', 'error');
        return;
    }
    
    try {
        await apiRequest('/secretaria/salas', {
            method: 'POST',
            body: JSON.stringify({ nome, capacidade })
        });
        mostrarToast('Sala cadastrada com sucesso', 'success');
        fecharModal('modalSala');
        document.getElementById("formSala").reset();
        await carregarSalas();
        renderizarEstatisticas();
    } catch (error) {
        mostrarToast('Erro ao cadastrar sala', 'error');
    }
});

// ==================== ALOCAÇÃO ====================
document.getElementById("btnGerar").onclick = async () => {
    try {
        await apiRequest('/alocacao/executar', { method: 'POST' });
        mostrarToast('Horário gerado com sucesso!', 'success');
        await Promise.all([carregarAlocacoes(), carregarConflitos()]);
        renderizarEstatisticas();
    } catch (error) {
        mostrarToast('Erro ao gerar horário', 'error');
    }
};

document.getElementById("btnPublicar").onclick = () => {
    if (conflitos && conflitos.length > 0) {
        mostrarToast(`Ainda existem ${conflitos.length} conflitos para resolver`, 'error');
    } else {
        mostrarToast('Planeamento publicado com sucesso!', 'success');
    }
};

// ==================== LOGOUT ====================
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem('labUser');
    localStorage.removeItem('token');
    sessionStorage.removeItem('labUser');
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
};

// ==================== UTILITÁRIOS ====================
function mostrarToast(msg, tipo) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = tipo === 'success' ? '#10b981' : '#dc2626';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '2rem';
    toast.style.zIndex = '2000';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function abrirModal(id) { 
    document.getElementById(id).style.display = "flex"; 
}

function fecharModal(id) { 
    document.getElementById(id).style.display = "none"; 
}

// ==================== TABS ====================
document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
        
        // Recarregar dados quando mudar de tab
        if (tab.dataset.tab === "tab-professores") carregarProfessores();
        if (tab.dataset.tab === "tab-turmas") carregarTurmas();
        if (tab.dataset.tab === "tab-laboratorios") carregarLaboratorios();
        if (tab.dataset.tab === "tab-salas") carregarSalas();
        if (tab.dataset.tab === "tab-conflitos") carregarConflitos();
        if (tab.dataset.tab === "tab-config-professores") carregarConfiguracoes(); // NOVA LINHA
    };
});

// Expor funções globalmente
window.removerProfessor = removerProfessor;
window.removerTurma = removerTurma;
window.removerLab = removerLab;
window.removerSala = removerSala;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;

// ==================== INICIAR ====================
carregarDados();