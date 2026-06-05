const express = require('express');
const router = express.Router();
const reclamacaocontroller = require ('../controllers/reclamacaoController');

router.get('/reclamacao' , reclamacaocontroller.listarReclamacao);

module.exports = router; 
