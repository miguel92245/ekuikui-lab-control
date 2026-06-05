const db = require('../config/database');

class ConfigDisciplina {
    static async save(professorId, disciplina, totalAulas, percLab, percConf) {
        const [result] = await db.execute(
            `INSERT INTO config_disciplinas 
            (professor_id, disciplina_nome, total_aulas, perc_lab, perc_conf) 
            VALUES (?, ?, ?, ?, ?)`,
            [professorId, disciplina, totalAulas, percLab, percConf]
        );
        return result.insertId;
    }

    static async findByProfessorId(professorId) {
        const [rows] = await db.execute(
            'SELECT * FROM config_disciplinas WHERE professor_id = ?',
            [professorId]
        );
        return rows;
    }
}

module.exports = ConfigDisciplina;