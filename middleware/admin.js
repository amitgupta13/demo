//middleware for checking wheather user is admin or not
module.exports = function(req, res, next){
    if(!req.user.isAdmin) return res.status(403).json({message:'Access Denied'});

    next();
}   