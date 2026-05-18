const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const SECRET = process.env.JWT_SECRET;  // 👈 corrigido
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET);
        req.user = decoded;  // 👈 útil para termos os dados do utilizador nas rotas
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};

module.exports = auth;