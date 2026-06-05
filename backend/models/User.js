// commit: "Adiciona modelo User para autenticação"

const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Buscar utilizador por email
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    // Comparar senha fornecida com a hash guardada
    static async comparePassword(senha, hash) {
        return bcrypt.compare(senha, hash);
    }
}

module.exports = User;