const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ message: 'API EKuikui Lab Control está funcionando!', status: 'OK' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});