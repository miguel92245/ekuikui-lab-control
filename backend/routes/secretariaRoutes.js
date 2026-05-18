const express = require('express');
const router = express.Router();
const { authMiddleware, secretariaOnly } = require('../middleware/authMiddleware');

// Importar controllers 
const professorController = require('../controllers/secretariaProfessorController');

// ==================== ROTAS DE PROFESSORES ====================
router.get('/professores', authMiddleware, secretariaOnly, professorController.getAll);
router.get('/professores/:id', authMiddleware, secretariaOnly, professorController.getById);
router.post('/professores', authMiddleware, secretariaOnly, professorController.create);
router.put('/professores/:id', authMiddleware, secretariaOnly, professorController.update);
router.delete('/professores/:id', authMiddleware, secretariaOnly, professorController.remove);

// ==================== ROTA DE TESTE ====================
router.get('/teste', authMiddleware, secretariaOnly, (req, res) => {
    res.json({ message: 'Rota da secretaria funcionando!' });
});

module.exports = router;