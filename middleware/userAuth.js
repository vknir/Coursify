const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config');
const { default: mongoose } = require('mongoose');
const { userModel } = require('../db');

async function userAuth(req, res, next)
{
    const token = req.Authorization;

    try{
        const decoded = jwt.verify(token,JWT_USER_SECRET)

        const decodedUserId= new mongoose.Types.ObjectId(decoded._id)

        const result = await userModel.findById(decodedUserId)
        
        if( result.length > 0){
            req.UserId=decodedUserId
            req.Userusername= result[0].username
            next()
        }
        else{
            res.json({
                message: "Invalid Token"
            })
        }

    }catch(e){
        res.json({
            message:"Invalid token"
        })
    }
}


module.exports={userAuth}