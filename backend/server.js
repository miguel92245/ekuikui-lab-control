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

//Rotas da secretaria
const secretariaRoutes = require ('./routes/secretariaRoutes');
app.use('./api/secretadria', secretariaRoutes);

// ==================== ROTAS DA SECRETARIA ====================

// Rota de teste
app.get('/api/secretaria/teste', (req, res) => {
    res.json({ message: 'Rota da secretaria funcionando!' });
});

// Importar os models
const Professor = require('./models/Professor');
const Turma = require('./models/Turma');
const Laboratorio = require('./models/Laboratorio');
const Sala = require('./models/Sala');

// ==================== CRUD PROFESSORES ====================

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

// ==================== CRUD TURMAS ====================

// GET /api/secretaria/turmas - Listar todas as turmas
app.get('/api/secretaria/turmas', async (req, res) => {
    try {
        const turmas = await Turma.findAll();
        res.json({ success: true, turmas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar turmas' });
    }
});

// GET /api/secretaria/turmas/:id - Buscar turma por ID
app.get('/api/secretaria/turmas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const turma = await Turma.findById(id);
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }
        res.json({ success: true, turma });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar turma' });
    }
});

// POST /api/secretaria/turmas - Criar turma
app.post('/api/secretaria/turmas', async (req, res) => {
    try {
        const { nome, curso, numAlunos } = req.body;
        if (!nome || !curso || !numAlunos) {
            return res.status(400).json({ message: 'Nome, curso e número de alunos são obrigatórios' });
        }
        await Turma.create(nome, curso, numAlunos);
        res.status(201).json({ success: true, message: 'Turma criada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar turma' });
    }
});

// PUT /api/secretaria/turmas/:id - Atualizar turma
app.put('/api/secretaria/turmas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, curso, numAlunos } = req.body;
        const turma = await Turma.findById(id);
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }
        await Turma.update(id, nome, curso, numAlunos);
        res.json({ success: true, message: 'Turma atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar turma' });
    }
});

// DELETE /api/secretaria/turmas/:id - Remover turma
app.delete('/api/secretaria/turmas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const turma = await Turma.findById(id);
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }
        await Turma.delete(id);
        res.json({ success: true, message: 'Turma removida com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover turma' });
    }
});

// ==================== CRUD LABORATÓRIOS ====================

// GET /api/secretaria/laboratorios - Listar todos os laboratórios
app.get('/api/secretaria/laboratorios', async (req, res) => {
    try {
        const laboratorios = await Laboratorio.findAll();
        res.json({ success: true, laboratorios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar laboratórios' });
    }
});

// GET /api/secretaria/laboratorios/:id - Buscar laboratório por ID
app.get('/api/secretaria/laboratorios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lab = await Laboratorio.findById(id);
        if (!lab) {
            return res.status(404).json({ message: 'Laboratório não encontrado' });
        }
        res.json({ success: true, laboratorio: lab });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar laboratório' });
    }
});

// POST /api/secretaria/laboratorios - Criar laboratório
app.post('/api/secretaria/laboratorios', async (req, res) => {
    try {
        const { nome, capacidade } = req.body;
        if (!nome || !capacidade) {
            return res.status(400).json({ message: 'Nome e capacidade são obrigatórios' });
        }
        await Laboratorio.create(nome, capacidade);
        res.status(201).json({ success: true, message: 'Laboratório criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar laboratório' });
    }
});

// PUT /api/secretaria/laboratorios/:id - Atualizar laboratório
app.put('/api/secretaria/laboratorios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, capacidade } = req.body;
        const lab = await Laboratorio.findById(id);
        if (!lab) {
            return res.status(404).json({ message: 'Laboratório não encontrado' });
        }
        await Laboratorio.update(id, nome, capacidade);
        res.json({ success: true, message: 'Laboratório atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar laboratório' });
    }
});

// DELETE /api/secretaria/laboratorios/:id - Remover laboratório
app.delete('/api/secretaria/laboratorios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lab = await Laboratorio.findById(id);
        if (!lab) {
            return res.status(404).json({ message: 'Laboratório não encontrado' });
        }
        await Laboratorio.delete(id);
        res.json({ success: true, message: 'Laboratório removido com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover laboratório' });
    }
});

// ==================== CRUD SALAS ====================

// GET /api/secretaria/salas - Listar todas as salas
app.get('/api/secretaria/salas', async (req, res) => {
    try {
        const salas = await Sala.findAll();
        res.json({ success: true, salas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar salas' });
    }
});

// GET /api/secretaria/salas/:id - Buscar sala por ID
app.get('/api/secretaria/salas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sala = await Sala.findById(id);
        if (!sala) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }
        res.json({ success: true, sala });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar sala' });
    }
});

// POST /api/secretaria/salas - Criar sala
app.post('/api/secretaria/salas', async (req, res) => {
    try {
        const { nome, capacidade } = req.body;
        if (!nome || !capacidade) {
            return res.status(400).json({ message: 'Nome e capacidade são obrigatórios' });
        }
        await Sala.create(nome, capacidade);
        res.status(201).json({ success: true, message: 'Sala criada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar sala' });
    }
});

// PUT /api/secretaria/salas/:id - Atualizar sala
app.put('/api/secretaria/salas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, capacidade } = req.body;
        const sala = await Sala.findById(id);
        if (!sala) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }
        await Sala.update(id, nome, capacidade);
        res.json({ success: true, message: 'Sala atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar sala' });
    }
});

// DELETE /api/secretaria/salas/:id - Remover sala
app.delete('/api/secretaria/salas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sala = await Sala.findById(id);
        if (!sala) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }
        await Sala.delete(id);
        res.json({ success: true, message: 'Sala removida com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover sala' });
    }
});

// ==================== ROTAS DE ALOCAÇÃO ====================

// Importar controllers de alocação
const alocacaoController = require('./controllers/alocacaoController');

// POST /api/alocacao/executar - Executar o algoritmo de alocação
app.post('/api/alocacao/executar', alocacaoController.executarAlocacao);

// GET /api/alocacao - Ver todas as alocações
app.get('/api/alocacao', alocacaoController.getAlocacoes);

// GET /api/alocacao/conflitos - Ver todos os conflitos
app.get('/api/alocacao/conflitos', alocacaoController.getConflitos);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
});
