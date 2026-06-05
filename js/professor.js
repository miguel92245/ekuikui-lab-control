// professor.js - usando API

let professorAtual = null;
let disciplinas = [];

// ==================== CARREGAR DADOS ====================
async function carregarDados() {
    try {
        const userStr = localStorage.getItem('labUser') || sessionStorage.getItem('labUser');
        if (!userStr) {
            window.location.href = 'index.html';
            return;
        }
        
        professorAtual = JSON.parse(userStr);
        
        if (professorAtual.tipo !== 'professor') {
            window.location.href = 'index.html';
            return;
        }
        
        document.getElementById("profNome").innerText = professorAtual.nome;
        
        await carregarDisciplinas();
        await carregarHorario();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarToast('Erro ao carregar dados', 'error');
    }
}

// ==================== CARREGAR DISCIPLINAS DA API ====================
async function carregarDisciplinas() {
    try {
        const data = await apiRequest('/professor/disciplinas');
        disciplinas = data.disciplinas || [];
        console.log('Disciplinas carregadas:', disciplinas);
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
        disciplinas = [];
    }
}

// ==================== ABRIR MODAL UNIDADE CURRICULAR ====================
async function abrirUnidadeCurricular() {
    await carregarDisciplinas();
    
    const container = document.getElementById("listaDisciplinasModal");
    
    if (!disciplinas || disciplinas.length === 0) {
        container.innerHTML = "<p>Nenhuma disciplina atribuída pela secretaria.</p>";
    } else {
        let html = "";
        for (let disciplina of disciplinas) {
            html += `<div class="disciplina-item-modal">
                <div><strong>${disciplina}</strong></div>
                <button class="btn btn-primary" onclick="abrirConfigDisciplina('${disciplina}')">Configurar</button>
            </div>`;
        }
        container.innerHTML = html;
    }
    
    document.getElementById("modalUnidade").style.display = "flex";
}

// ==================== ABRIR CONFIGURAÇÃO ====================
function abrirConfigDisciplina(disciplinaNome) {
    document.getElementById("modalConfigTitulo").innerText = `Configurar ${disciplinaNome}`;
    document.getElementById("totalAulas").value = "";
    document.getElementById("percLab").value = "";
    document.getElementById("percConf").value = "";
    document.getElementById("modalConfigDisciplina").dataset.disciplina = disciplinaNome;
    document.getElementById("modalConfigDisciplina").style.display = "flex";
}

// ==================== SALVAR CONFIGURAÇÃO ====================
document.getElementById("salvarConfigBtn").onclick = async () => {
    const disciplina = document.getElementById("modalConfigDisciplina").dataset.disciplina;
    const totalAulas = document.getElementById("totalAulas").value;
    const percLab = document.getElementById("percLab").value;
    const percConf = document.getElementById("percConf").value;
    
    console.log("📤 Dados a enviar:", { disciplina, totalAulas, percLab, percConf });
    
    if (!disciplina) {
        mostrarToast("Disciplina não identificada", "error");
        return;
    }
    
    if (!totalAulas || totalAulas === "") {
        mostrarToast("Preencha o número total de aulas", "error");
        return;
    }
    
    if (!percLab || percLab === "") {
        mostrarToast("Preencha a percentagem de laboratório", "error");
        return;
    }
    
    const totalAulasNum = parseInt(totalAulas);
    const percLabNum = parseInt(percLab);
    const percConfNum = parseInt(percConf) || (100 - percLabNum);
    
    if (percLabNum > 80) {
        mostrarToast("Percentagem de laboratório não pode ultrapassar 80%", "error");
        return;
    }
    
    try {
        const response = await apiRequest('/professor/config-disciplina', {
            method: 'POST',
            body: JSON.stringify({ 
                disciplina, 
                totalAulas: totalAulasNum, 
                percLab: percLabNum, 
                percConf: percConfNum 
            })
        });
        
        console.log("✅ Resposta:", response);
        mostrarToast("Configuração salva com sucesso!", "success");
        fecharModal('modalConfigDisciplina');
    } catch (error) {
        console.error("❌ Erro detalhado:", error);
        mostrarToast("Erro ao salvar configuração: " + error.message, "error");
    }
};

// ==================== CARREGAR HORÁRIO ====================
async function carregarHorario() {
    try {
        const data = await apiRequest('/alocacao');
        const minhasAulas = data.alocacoes?.filter(a => a.professor_nome === professorAtual.nome) || [];
        const tbody = document.getElementById("horarioBody");
        
        if (minhasAulas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Nenhum horário publicado</td><tr>';
            return;
        }
        
        let html = "";
        for (let a of minhasAulas) {
            html += `<tr>
                <td>${a.dia}</td>
                <td>${a.disciplina}</td>
                <td>${a.turma_nome}</td>
                <td>${a.hora_inicio} - ${a.hora_fim}</td>
                <td>${a.lab_nome} (${a.lab_capacidade} lug.)</td>
            </tr>`;
        }
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar horário:', error);
    }
}

// ==================== DIAS DE AULAS ====================
document.getElementById("btnDiasAulas").onclick = () => {
    document.getElementById("modalDias").style.display = "flex";
};

document.getElementById("salvarDiasBtn").onclick = async () => {
    const data = document.getElementById("dataAula").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;
    
    if (!data || !horaInicio || !horaFim) {
        mostrarToast("Preencha todos os campos", "error");
        return;
    }
    
    try {
        await apiRequest('/professor/dias-aulas', {
            method: 'POST',
            body: JSON.stringify({ data, horaInicio, horaFim })
        });
        
        mostrarToast("Dia de aula salvo com sucesso!", "success");
        fecharModal('modalDias');
        document.getElementById("dataAula").value = "";
        document.getElementById("horaInicio").value = "";
        document.getElementById("horaFim").value = "";
    } catch (error) {
        mostrarToast("Erro ao salvar dia de aula", "error");
    }
};

// ==================== RECLAMAÇÃO ====================
document.getElementById("reclamarBtn").onclick = async () => {
    const mensagem = document.getElementById("reclamacaoMsg").value.trim();
    if (!mensagem) {
        mostrarToast("Escreva a reclamação", "error");
        return;
    }
    
    try {
        await apiRequest('/professor/reclamar', {
            method: 'POST',
            body: JSON.stringify({ mensagem })
        });
        
        mostrarToast("Reclamação enviada com sucesso!", "success");
        document.getElementById("reclamacaoMsg").value = "";
    } catch (error) {
        mostrarToast("Erro ao enviar reclamação", "error");
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

function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

// ==================== INICIAR ====================
document.getElementById("btnUnidadeCurricular").onclick = () => abrirUnidadeCurricular();
window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };

carregarDados();