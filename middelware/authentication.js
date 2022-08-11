

const User  = require('../model/userSchema')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');


const Authentication = async (req,res,next) =>{
    try{
        const token = req.headers['auth-header']
    console.log(token)

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
    const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token" : token}).select("-password -cpassword")
    if(!rootUser){
        return res.status(403).json({status:false , message: 'token verification failed'})
    }
    req.userID = rootUser._id
    req.token = token
    req.rootUser = rootUser
 

    console.log('middelware working')

    next();
    }
    catch(err){
        res.status(403).json({status:false , message: 'token verification filed'})
    }
}

module.exports = Authentication;