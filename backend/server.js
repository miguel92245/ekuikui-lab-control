const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ==================== ROTAS ====================

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Rotas de autenticação (login)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rotas do professor (com controller e middleware)
const professorRoutes = require('./routes/professorRoutes');
app.use('/api/professor', professorRoutes);

// Rotas da secretaria (CRUD professores, turmas, laboratórios, salas)
const secretariaRoutes = require('./routes/secretariaRoutes');
app.use('/api/secretaria', secretariaRoutes);

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});