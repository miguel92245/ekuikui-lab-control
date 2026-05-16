const jwt= require("jsonwebtoken");

const auth = (req,res,next)=>{
    const SECRET=process.env.SECRET;
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({messahe:"Token invalido"})
    }
    try {
        const decode = jwt.verify(token.replace("Bearer ",""), SECRET);
        next();
        
    } catch (e) {
        res.status(500).json({message:"Acesso negado"})
        
    }

};
module.exports= auth;