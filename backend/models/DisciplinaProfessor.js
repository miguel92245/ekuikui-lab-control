const db = require('../config/database');

class DisciplinaProfessor {
    static async findByProfessorId(professorId) {
        const [rows] = await db.execute(
            'SELECT disciplina_nome FROM disciplinas_professor WHERE professor_id = ?',
            [professorId]
        );
        return rows.map(row => row.disciplina_nome);
    }
}

module.exports = DisciplinaProfessor;