const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config');
const { default: mongoose } = require('mongoose');
const { userModel } = require('../db');

async function userAuth(req, res, next)
{
    const token = req.headers.authorization;
   
    
    try{
        const decoded = jwt.verify(token,JWT_USER_SECRET)
       

        const decodedUserId= new mongoose.Types.ObjectId(decoded._id)

        const result = await userModel.findById(decodedUserId)
        
        if( result){
            req.userId=decodedUserId
            req.Userusername= result.username
            next()
        }
        else{
            res.json({
                message: "Invalid Token else"
            })
        }

    }catch(e){
        console.log(e)
        res.json({
            message:"Invalid token error"
        })
    }
}


module.exports={userAuth}