const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Rota de login (mantém a original)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rota do professor - simplificada
app.get('/api/professor/disciplinas', (req, res) => {
    res.json({ disciplinas: ["Programação Web", "Base de Dados"] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});