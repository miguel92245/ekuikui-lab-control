const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // TESTE: Se não houver token, continua mesmo assim
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = { id: 2, nome: "Teste", tipo: "professor" };
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        req.user = { id: 2, nome: "Teste", tipo: "professor" };
        next();
    }
};

module.exports = { authMiddleware };