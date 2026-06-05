const Professor = require('../models/Professor');
const bcrypt = require('bcryptjs');

// Listar todos os professores
const getAll = async (req, res) => {
    try {
        const professores = await Professor.findAll();
        res.json({ success: true, professores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar professores' });
    }
};

// Buscar professor por ID
const getById = async (req, res) => {
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
};

// Criar professor
const create = async (req, res) => {
    try {
        const { nome, email, senha, disciplinas } = req.body;
        
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        }
        // Validar domínio do email
const dominiosPermitidos = ['.ao', '.com', '.edu.ao'];
const dominioValido = dominiosPermitidos.some(dominio =>
    email.toLowerCase().endsWith(dominio)
);
if (!dominioValido) {
    return res.status(400).json({
        message: 'O email deve terminar com .ao, .com ou .edu.ao'
    });
}
        const senhaHash = await bcrypt.hash(senha, 10);
        const disciplinasArray = disciplinas ? disciplinas.split(',').map(d => d.trim()) : [];
        
        await Professor.create(nome, email, senhaHash, disciplinasArray);
        
        res.status(201).json({ success: true, message: 'Professor criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar professor' });
    }
};

// Atualizar professor
const update = async (req, res) => {
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
};

// Remover professor
const remove = async (req, res) => {
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
};

module.exports = { getAll, getById, create, update, remove };