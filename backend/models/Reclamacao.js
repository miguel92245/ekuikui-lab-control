const db = require('../config/database');

class Reclamacao {
    static async save(professorId, mensagem) {
        const [result] = await db.execute(
            `INSERT INTO reclamacoes (professor_id, mensagem) VALUES (?, ?)`,
            [professorId, mensagem]
        );
        return result.insertId;
    }

    static async findByProfessorId(professorId) {
        const [rows] = await db.execute(
            'SELECT * FROM reclamacoes WHERE professor_id = ? ORDER BY data_envio DESC',
            [professorId]
        );
        return rows;
    }
}

module.exports = Reclamacao;