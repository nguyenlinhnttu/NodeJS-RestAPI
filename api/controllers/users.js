const mongoose = require('mongoose')
const User = require('../model/users');
const bcrypt = require('bcrypt')
const define = require('../define/constants')
const jwt = require('jsonwebtoken')
//https://github.com/kelektiv/node.bcrypt.js
//https://github.com/auth0/node-jsonwebtoken
exports.register_account = (req,res,next)=>{
    User.findOne({email:req.body.email}).exec().then(user => {
       if (user){
        console.log(user)
        return res.status(define.REQUEST_FAILURE).json({
            error : 'Email is exits in system!'
        });
       } else{
        const saltRounds = 10;
        bcrypt.hash(req.body.password,saltRounds,function(error,hash){
            if (error){
                return res.status(define.SYSTEM_ERROR_CODE).json({
                    error : error
                });
            } else{
                const user = new User({
                    _id  : new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
                user.save()
                .then(result =>{
                    console.log(result)
                    return res.status(define.REQUEST_CREATED_CODE).json({
                        message : 'User created.'
                    });
                })
                .catch(error =>{
                    console.log(error)
                    return res.status(define.SYSTEM_ERROR_CODE).json({
                                    error : error
                                });
                });
            }
        });
       }
    });
}

exports.login_account = (req,res,next)=>{
    User.findOne({email:req.body.email}).exec()
    .then(user =>{
        console.log(user)
        if (user){
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if (result) {
                    const token = jwt.sign({
                        email :user.email,
                        _id :user._id
                    },
                    define.JWT_KEY,
                    {
                        expiresIn : '1h'
                    });
                    
                    return res.status(define.REQUEST_SUCCESS).json({
                        message : 'Login Success!',
                        token : token
                    });
                } else {
                    return res.status(define.REQUEST_FAILURE).json({
                        message : 'Your password not match!'
                   });
                }
            })
        } else{
            return res.status(define.REQUEST_FAILURE).json({
                message : 'Your account not exits in System!'
           });
        }
    })
    .catch(error=>{
        console.log(error)
        return res.status(define.SYSTEM_ERROR_CODE).json({
                 error : error
            });
    });
    
}

exports.delete_account = (req,res,next) =>{
    User.deleteMany({_id:req.params.userId})
    .exec()
    .then(result =>{
        console.log(result)
        if (result.n > 0) {
            return res.status(define.REQUEST_CREATED_CODE).json({
                message : 'User Deleted.'
            });
        } else{
            return res.status(define.REQUEST_FAILURE).json({
                message : 'User Not Exits.'
            });
        }
        
    })
    .catch(error =>{
        console.log(error)
        return res.status(define.SYSTEM_ERROR_CODE).json({
                                    error : error
                                });
    });
}