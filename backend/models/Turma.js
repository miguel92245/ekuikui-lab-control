const db = require('../config/database');

class Turma {
    // Buscar todas as turmas
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM turmas ORDER BY nome');
        return rows;
    }

    // Buscar turma por ID
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM turmas WHERE id = ?', [id]);
        return rows[0];
    }

    // Criar turma
    static async create(nome, curso, numAlunos) {
        const [result] = await db.execute(
            'INSERT INTO turmas (nome, curso, num_alunos) VALUES (?, ?, ?)',
            [nome, curso, numAlunos]
        );
        return result.insertId;
    }

    // Atualizar turma
    static async update(id, nome, curso, numAlunos) {
        await db.execute(
            'UPDATE turmas SET nome = ?, curso = ?, num_alunos = ? WHERE id = ?',
            [nome, curso, numAlunos, id]
        );
        return true;
    }

    // Remover turma
    static async delete(id) {
        await db.execute('DELETE FROM turmas WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Turma;