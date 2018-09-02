const jwt  = require('jsonwebtoken')
const define = require('../define/constants')
module.exports =(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        console.log(token)
        const decoded = jwt.verify(token,define.JWT_KEY);
        req.userData = decoded
        next();
    }catch(error){
        res.status (define.REQUEST_AUTH_FAILURE).json({
            message :'Auth failed!!'
        });
    };
    
};