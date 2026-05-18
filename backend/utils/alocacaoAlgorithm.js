const db = require('../config/database');

async function gerarAlocacao() {
    // 1. Buscar aulas práticas
    const [aulas] = await db.execute(`
        SELECT * FROM aulas WHERE tipo_aula = 'Prática' ORDER BY num_alunos DESC
    `);

    // 2. Buscar laboratórios
    const [laboratorios] = await db.execute(`
        SELECT * FROM laboratorios ORDER BY capacidade ASC
    `);

    if (aulas.length === 0) {
        return { message: 'Nenhuma aula prática encontrada', alocacoes: [], conflitos: [] };
    }

    const alocacoes = [];
    const conflitos = [];
    const ocupacao = {}; // controlar laboratórios ocupados

    for (let aula of aulas) {
        let alocado = false;

        for (let lab of laboratorios) {
            const chave = `${lab.id}_${aula.dia}_${aula.hora_inicio}`;
            
            // Verificar se o laboratório já está ocupado neste horário
            if (!ocupacao[chave] && lab.capacidade >= aula.num_alunos) {
                alocacoes.push({
                    professor_nome: aula.professor_nome,
                    disciplina: aula.disciplina,
                    turma_nome: aula.turma_nome,
                    num_alunos: aula.num_alunos,
                    dia: aula.dia,
                    hora_inicio: aula.hora_inicio,
                    hora_fim: aula.hora_fim,
                    lab_nome: lab.nome,
                    lab_capacidade: lab.capacidade
                });
                ocupacao[chave] = true;
                alocado = true;
                break;
            }
        }

        if (!alocado) {
            conflitos.push({
                professor_nome: aula.professor_nome,
                disciplina: aula.disciplina,
                turma_nome: aula.turma_nome,
                num_alunos: aula.num_alunos,
                dia: aula.dia,
                motivo: 'Nenhum laboratório disponível com capacidade suficiente'
            });
        }
    }

    return { alocacoes, conflitos };
}

module.exports = { gerarAlocacao };