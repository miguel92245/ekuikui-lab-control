const db = require('../config/database');

class Aula {
    // Buscar todas as aulas práticas
    static async findAulasPraticas() {
        const [rows] = await db.execute(
            "SELECT * FROM aulas WHERE tipo_aula = 'Prática'"
        );
        return rows;
    }

    // Inserir aulas de exemplo (para teste)
    static async insertExemplo() {
        await db.execute(`
            INSERT INTO aulas (professor_nome, disciplina, turma_nome, num_alunos, dia, hora_inicio, hora_fim, tipo_aula) VALUES 
            ('Michael Ferreira', 'Programação Web', 'INF2', 35, 'Segunda', '10:00', '12:00', 'Prática'),
            ('Michael Ferreira', 'Base de Dados', 'INF2', 35, 'Quarta', '08:00', '10:00', 'Prática'),
            ('Julsuel Santos', 'Anatomia', 'ENF1', 28, 'Terça', '14:00', '16:00', 'Prática')
        `);
        return true;
    }
}

module.exports = Aula;