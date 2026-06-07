const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // COMPARAÇÃO 
        if (user.senha !== senha) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
 // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, tipo: user.tipo, nome: user.nome },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
// Devolver resposta
        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};