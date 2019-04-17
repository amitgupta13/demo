const jwt = require('jsonwebtoken');

//middleware for verifying jwt token
module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({message:'Access Denied. No token provided'});

    try{
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        next();
    }catch(ex){
        res.status(401).json({message:'Invalid Token'});
    }
}