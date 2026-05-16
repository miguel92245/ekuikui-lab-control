

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rota de teste ()
app.get('/api/health', (req, res) => {
    
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});