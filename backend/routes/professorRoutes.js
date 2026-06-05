const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    getDisciplinas,
    saveConfigDisciplina,
    saveDiasAulas,
    saveReclamacao,
    getMinhasConfiguracoes,
    getMeusDias,
    getMinhasReclamacoes
} = require('../controllers/professorController');

// Rotas GET
router.get('/disciplinas', authMiddleware, getDisciplinas);
router.get('/minhas-configuracoes', authMiddleware, getMinhasConfiguracoes);
router.get('/meus-dias', authMiddleware, getMeusDias);
router.get('/minhas-reclamacoes', authMiddleware, getMinhasReclamacoes);

// Rotas POST
router.post('/config-disciplina', authMiddleware, saveConfigDisciplina);
router.post('/dias-aulas', authMiddleware, saveDiasAulas);
router.post('/reclamar', authMiddleware, saveReclamacao);

module.exports = router;