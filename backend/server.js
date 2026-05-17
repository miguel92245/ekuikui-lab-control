const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professorRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/professor', professorRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend com MySQL está funcionando!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});