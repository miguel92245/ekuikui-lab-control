const DisciplinaProfessor = require('../models/DisciplinaProfessor');

exports.getDisciplinas = async (req, res) => {
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