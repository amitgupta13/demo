
const winston = require('winston');

// middleware for server error
module.exports = function(err, req, res, next){
    winston.error(err.message, err);
    res.status(500).json({
        message:'Something Failed'
    });
}