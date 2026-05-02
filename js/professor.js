let professorAtual = null;
let alocacoes = [];
const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const horarios = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

function carregarDados() {
    const user = localStorage.getItem('labUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    professorAtual = JSON.parse(user);
    document.getElementById("profNome").innerText = professorAtual.nome;
    
    const data = localStorage.getItem("ekuikuiLabData");
    if (data) {
        const obj = JSON.parse(data);
        alocacoes = obj.alocacoes || [];
    }
    renderizarHorario();
}

function renderizarHorario() {
    const minhasAulas = alocacoes.filter(a => a.professor === professorAtual.nome);
    
    if (minhasAulas.length === 0) {
        document.getElementById("horarioDisplay").innerHTML = '<div style="text-align:center;padding:2rem;">Nenhum horário atribuído ainda.</div>';
        return;
    }
    
    let html = '<table class="horario-table"><thead><tr><th>Horário</th><th>Segunda</th><th>Terça</th><th>Quarta</th><th>Quinta</th><th>Sexta</th></tr></thead><tbody>';
    
    for (let hora of horarios) {
        html += `<tr><td style="background:#1a1a2e;color:#ffd700;font-weight:bold;">${hora}</td>`;
        for (let dia of dias) {
            const aulas = minhasAulas.filter(a => a.dia === dia && a.horaInicio === hora);
            if (aulas.length > 0) {
                html += '<td>';
                for (let a of aulas) {
                    html += `<div class="aula-card">
                        <strong>${a.disciplina}</strong><br>
                        <small>${a.horaInicio} - ${a.horaFim}</small><br>
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
    document.getElementById("horarioDisplay").innerHTML = html;
}

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem('labUser');
    window.location.href = 'index.html';
};

carregarDados();