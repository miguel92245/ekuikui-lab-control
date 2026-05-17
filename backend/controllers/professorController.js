const DisciplinaProfessor = require('../models/DisciplinaProfessor');
const ConfigDisciplina = require('../models/ConfigDisciplina');
const DiasAula = require('../models/DiasAula');
const Reclamacao = require('../models/Reclamacao');

// GET /api/professor/disciplinas
const getDisciplinas = async (req, res) => {
    try {
        const professorId = req.user.id;
        const disciplinas = await DisciplinaProfessor.findByProfessorId(professorId);
        
        res.json({
            success: true,
            disciplinas: disciplinas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar disciplinas' });
    }
};

// POST /api/professor/config-disciplina
const saveConfigDisciplina = async (req, res) => {
    try {
        const { disciplina, totalAulas, percLab, percConf } = req.body;
        const professorId = req.user.id;

        if (!disciplina || !totalAulas || !percLab || !percConf) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (percLab > 80) {
            return res.status(400).json({ message: 'Percentagem de laboratório não pode ultrapassar 80%' });
        }

        await ConfigDisciplina.save(professorId, disciplina, totalAulas, percLab, percConf);
        
        res.json({
            success: true,
            message: 'Configuração salva com sucesso'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar configuração' });
    }
};

// POST /api/professor/dias-aulas
const saveDiasAulas = async (req, res) => {
    try {
        const { data, horaInicio, horaFim } = req.body;
        const professorId = req.user.id;

        if (!data || !horaInicio || !horaFim) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        await DiasAula.save(professorId, data, horaInicio, horaFim);
        
        res.json({
            success: true,
            message: 'Dia de aula salvo com sucesso'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar dia de aula' });
    }
};

// POST /api/professor/reclamar
const saveReclamacao = async (req, res) => {
    try {
        const { mensagem } = req.body;
        const professorId = req.user.id;

        if (!mensagem) {
            return res.status(400).json({ message: 'Mensagem da reclamação é obrigatória' });
        }

        await Reclamacao.save(professorId, mensagem);
        
        res.json({
            success: true,
            message: 'Reclamação enviada com sucesso'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar reclamação' });
    }
};

// GET /api/professor/minhas-configuracoes
const getMinhasConfiguracoes = async (req, res) => {
    try {
        const professorId = req.user.id;
        const configuracoes = await ConfigDisciplina.findByProfessorId(professorId);
        
        res.json({
            success: true,
            configuracoes: configuracoes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar configurações' });
    }
};

// GET /api/professor/meus-dias
const getMeusDias = async (req, res) => {
    try {
        const professorId = req.user.id;
        const dias = await DiasAula.findByProfessorId(professorId);
        
        res.json({
            success: true,
            dias: dias
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dias de aula' });
    }
};

// GET /api/professor/minhas-reclamacoes
const getMinhasReclamacoes = async (req, res) => {
    try {
        const professorId = req.user.id;
        const reclamacoes = await Reclamacao.findByProfessorId(professorId);
        
        res.json({
            success: true,
            reclamacoes: reclamacoes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar reclamações' });
    }
};

module.exports = {
    getDisciplinas,
    saveConfigDisciplina,
    saveDiasAulas,
    saveReclamacao,
    getMinhasConfiguracoes,
    getMeusDias,
    getMinhasReclamacoes
};