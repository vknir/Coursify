const jwt= require('jsonwebtoken')

const  {JWT_ADMIN_SECRET}= require('../config')
const {adminModel} = require('../db.js')
const { default: mongoose } = require('mongoose')

async function adminAuth(req, res, next){
    const token=req.Authorization

    try{
       const decoded= jwt.verify(token, JWT_ADMIN_SECRET)
       
       const decodedAdminId= new mongoose.Types.ObjectId( decoded._id)
       const result = await adminModel.findById(decodedAdminId)

       // mongoose function returns an array 
       
       if(result.length > 0){

            req.AdminId= decodedAdminId
            req.AdminUsername= result[0].username
        
            next();
        }
        else
            {
                res.json({
                    message:"Token invalid"
                })
            }
       
       
    
    }catch(e)
    {
        console.log(e)
        res.json({
            message:"Token Invalid"
        })
    }
}

module.exports={adminAuth}