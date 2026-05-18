const db = require('../config/database');

class Sala {
    // Buscar todas as salas
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM salas ORDER BY nome');
        return rows;
    }

    // Buscar sala por ID
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM salas WHERE id = ?', [id]);
        return rows[0];
    }

    // Criar sala
    static async create(nome, capacidade) {
        const [result] = await db.execute(
            'INSERT INTO salas (nome, capacidade) VALUES (?, ?)',
            [nome, capacidade]
        );
        return result.insertId;
    }

    // Atualizar sala
    static async update(id, nome, capacidade) {
        await db.execute(
            'UPDATE salas SET nome = ?, capacidade = ? WHERE id = ?',
            [nome, capacidade, id]
        );
        return true;
    }

    // Remover sala
    static async delete(id) {
        await db.execute('DELETE FROM salas WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Sala;  