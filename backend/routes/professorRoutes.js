const express = require('express');
const router = express.Router();
const { getDisciplinas } = require('../controllers/professorController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Apenas professores autenticados podem aceder
router.get('/disciplinas', authMiddleware, getDisciplinas);

module.exports = router;