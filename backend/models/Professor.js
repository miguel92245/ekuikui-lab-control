const db = require('../config/database');

class Professor {
    // Buscar todos os professores
    static async findAll() {
        const [rows] = await db.execute(`
            SELECT 
                u.id, 
                u.nome, 
                u.email, 
                u.tipo,
                GROUP_CONCAT(dp.disciplina_nome SEPARATOR ', ') as disciplinas
            FROM users u
            LEFT JOIN disciplinas_professor dp ON dp.professor_id = u.id
            WHERE u.tipo = 'professor'
            GROUP BY u.id
            ORDER BY u.nome
        `);
        return rows;
    }

    // Buscar professor por ID
    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT 
                u.id, 
                u.nome, 
                u.email, 
                u.tipo,
                GROUP_CONCAT(dp.disciplina_nome SEPARATOR ', ') as disciplinas
            FROM users u
            LEFT JOIN disciplinas_professor dp ON dp.professor_id = u.id
            WHERE u.id = ? AND u.tipo = 'professor'
            GROUP BY u.id
        `, [id]);
        return rows[0];
    }

    // Criar professor
    static async create(nome, email, senhaHash, disciplinas) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Inserir na tabela users
            const [userResult] = await connection.execute(
                'INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                [nome, email, senhaHash, 'professor']
            );
            const professorId = userResult.insertId;
            
            // Inserir disciplinas
            if (disciplinas && disciplinas.length > 0) {
                for (let disciplina of disciplinas) {
                    await connection.execute(
                        'INSERT INTO disciplinas_professor (professor_id, disciplina_nome) VALUES (?, ?)',
                        [professorId, disciplina.trim()]
                    );
                }
            }
            
            await connection.commit();
            return professorId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Atualizar professor
    static async update(id, nome, email, disciplinas) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Atualizar dados do user
            await connection.execute(
                'UPDATE users SET nome = ?, email = ? WHERE id = ?',
                [nome, email, id]
            );
            
            // Remover disciplinas antigas
            await connection.execute('DELETE FROM disciplinas_professor WHERE professor_id = ?', [id]);
            
            // Inserir novas disciplinas
            if (disciplinas && disciplinas.length > 0) {
                for (let disciplina of disciplinas) {
                    await connection.execute(
                        'INSERT INTO disciplinas_professor (professor_id, disciplina_nome) VALUES (?, ?)',
                        [id, disciplina.trim()]
                    );
                }
            }
            
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Remover professor
    static async delete(id) {
        await db.execute('DELETE FROM users WHERE id = ? AND tipo = "professor"', [id]);
        return true;
    }
}

module.exports = Professor;