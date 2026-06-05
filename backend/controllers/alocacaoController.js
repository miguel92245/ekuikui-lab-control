const { gerarAlocacao } = require('../utils/alocacaoAlgorithm');
const db = require('../config/database');

const executarAlocacao = async (req, res) => {
    try {
        const { alocacoes, conflitos } = await gerarAlocacao();

        // Limpar alocações e conflitos antigos
        await db.execute('DELETE FROM alocacoes');
        await db.execute('DELETE FROM conflitos');

        // Inserir novas alocações
        for (let aloc of alocacoes) {
            await db.execute(`
                INSERT INTO alocacoes 
                (professor_nome, disciplina, turma_nome, num_alunos, dia, hora_inicio, hora_fim, lab_nome, lab_capacidade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                aloc.professor_nome, aloc.disciplina, aloc.turma_nome, aloc.num_alunos,
                aloc.dia, aloc.hora_inicio, aloc.hora_fim, aloc.lab_nome, aloc.lab_capacidade
            ]);
        }

        // Inserir conflitos
        for (let conf of conflitos) {
            await db.execute(`
                INSERT INTO conflitos 
                (professor_nome, disciplina, turma_nome, num_alunos, dia, motivo)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                conf.professor_nome, conf.disciplina, conf.turma_nome, conf.num_alunos,
                conf.dia, conf.motivo
            ]);
        }

        res.json({
            success: true,
            message: `Alocação concluída! ${alocacoes.length} aulas alocadas, ${conflitos.length} conflitos.`,
            alocacoes,
            conflitos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao executar alocação' });
    }
};

const getAlocacoes = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM alocacoes ORDER BY dia, hora_inicio');
        res.json({ success: true, alocacoes: rows });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar alocações' });
    }
};

const getConflitos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM conflitos ORDER BY id');
        res.json({ success: true, conflitos: rows });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar conflitos' });
    }
};

module.exports = { executarAlocacao, getAlocacoes, getConflitos };