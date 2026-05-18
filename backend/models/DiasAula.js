const db = require('../config/database');

class DiasAula {
    static async save(professorId, data, horaInicio, horaFim) {
        const [result] = await db.execute(
            `INSERT INTO dias_aulas 
            (professor_id, data_aula, hora_inicio, hora_fim) 
            VALUES (?, ?, ?, ?)`,
            [professorId, data, horaInicio, horaFim]
        );
        return result.insertId;
    }

    static async findByProfessorId(professorId) {
        const [rows] = await db.execute(
            'SELECT * FROM dias_aulas WHERE professor_id = ? ORDER BY data_aula',
            [professorId]
        );
        return rows;
    }
}

module.exports = DiasAula;