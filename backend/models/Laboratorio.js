const db = require('../config/database');

class Laboratorio {
    // Buscar todos os laboratórios
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM laboratorios ORDER BY capacidade');
        return rows;
    }

    // Buscar laboratório por ID
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM laboratorios WHERE id = ?', [id]);
        return rows[0];
    }

    // Criar laboratório
    static async create(nome, capacidade) {
        const [result] = await db.execute(
            'INSERT INTO laboratorios (nome, capacidade) VALUES (?, ?)',
            [nome, capacidade]
        );
        return result.insertId;
    }

    // Atualizar laboratório
    static async update(id, nome, capacidade) {
        await db.execute(
            'UPDATE laboratorios SET nome = ?, capacidade = ? WHERE id = ?',
            [nome, capacidade, id]
        );
        return true;
    }

    // Remover laboratório
    static async delete(id) {
        await db.execute('DELETE FROM laboratorios WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Laboratorio;