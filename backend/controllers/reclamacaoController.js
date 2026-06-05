// Importa conexão com banco - ERRO 2 CORRIGIDO
const db = require('../config/database/ekuikui_lab_sql'); // Conexão MySQL

// Controller pra professor criar reclamação usando tabela que já existe
exports.criar = async (req, res) => { // Função que recebe POST do professor
    const { professor_id, mensagem } = req.body; // Pega só professor_id e mensagem do body

    try { // Tenta salvar no banco
        await db.query(
            'INSERT INTO reclamacao (professor_id, mensagem, data_envio) VALUES (?,?, NOW())', // ERRO 3: vírgula aqui
            [professor_id, mensagem] // Parâmetros na ordem certa
        ); // ERRO 4: fecha parêntese e ponto e vírgula
        res.status(201).json({ msg: 'Reclamação enviada com sucesso' }); // Retorna sucesso 201
    } catch(erro) { // Se der erro
        console.log(erro); // Mostra erro no terminal pra debug
        res.status(500).json({ erro: 'Erro ao salvar reclamação' }); // Retorna erro 500
    }
}; // Fecha função

// Controller pra secretaria listar reclamações
exports.listar = async (req, res) => { // Função que recebe GET da secretaria
    try { // Tenta buscar dados
        const [rows] = await db.query( // ERRO 1 CORRIGIDO: [rows] em vez de só =
            'SELECT id, professor_id as prof_id, mensagem, data_envio as criado_em FROM reclamacao ORDER BY data_envio DESC' // Select com alias
        ); // Fecha query
        res.json(rows); // Retorna array JSON
    } catch(erro) { // Se der erro
        res.status(500).json({ erro: 'Erro ao buscar reclamações' }); // Retorna erro 500
    }
};

module.exports = {criar, listar};
