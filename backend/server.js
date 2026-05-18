const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Rotas de autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rotas do professor
const professorRoutes = require('./routes/professorRoutes');
app.use('/api/professor', professorRoutes);

// ==================== ROTAS DA SECRETARIA ====================

// Rota de teste
app.get('/api/secretaria/teste', (req, res) => {
    res.json({ message: 'Rota da secretaria funcionando!' });
});

// Importar o model Professor
const Professor = require('./models/Professor');

// GET /api/secretaria/professores - Listar todos os professores
app.get('/api/secretaria/professores', async (req, res) => {
    try {
        const professores = await Professor.findAll();
        res.json({ success: true, professores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar professores' });
    }
});

// GET /api/secretaria/professores/:id - Buscar professor por ID
app.get('/api/secretaria/professores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        res.json({ success: true, professor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar professor' });
    }
});

// POST /api/secretaria/professores - Criar professor
app.post('/api/secretaria/professores', async (req, res) => {
    try {
        const { nome, email, senha, disciplinas } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const disciplinasArray = disciplinas ? disciplinas.split(',').map(d => d.trim()) : [];

        await Professor.create(nome, email, senhaHash, disciplinasArray);

        res.status(201).json({ success: true, message: 'Professor criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar professor' });
    }
});

// PUT /api/secretaria/professores/:id - Atualizar professor
app.put('/api/secretaria/professores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, disciplinas } = req.body;

        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }

        const disciplinasArray = disciplinas ? disciplinas.split(',').map(d => d.trim()) : [];
        await Professor.update(id, nome, email, disciplinasArray);

        res.json({ success: true, message: 'Professor atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar professor' });
    }
});

// DELETE /api/secretaria/professores/:id - Remover professor
app.delete('/api/secretaria/professores/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }

        await Professor.delete(id);

        res.json({ success: true, message: 'Professor removido com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover professor' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});