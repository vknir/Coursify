const bodyParser = require('body-parser');
const {Router} = require('express')
const userRouter = Router();
const {z} = require('zod');
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')

const {JWT_USER_SECRET}= require('../config');
const {userModel} = require('../db')


userRouter.use(bodyParser.urlencoded({extended:false}))

userRouter.post('/signup', async (req, res)=>{
    const {username, password}= req.body

    //craeting credentials validator
    const signupValidator= z.object({
        username : z.string(),
        password : z.string().min(3)
    })

    try{

        signupValidator.parse({username,password})
        // creating user account

        await bcrypt.hash(password, 3, async function(err, hash){

        const result = await userModel.create({username, hash});
        if(result)
        {
            //fetching user acoount  for userId
            const findUser = await userModel.findOne({username})
            const token = jwt.sign({
                _id:findUser._id
            },JWT_USER_SECRET)

            // return token
            res.json({
                message:"User signed up!",
                token:token
            })
        }else{
            res.josn({
                message:"Unable to update DB"
            })
        }
        })

            


        

    }catch(e)
    {
        console.log(e)
        res.json({
            message:"Use correct format for credenial"
        })
    }

})

userRouter.post('/login', async (req, res)=>{
        const {username, password}= req.body

        
        const findUser = await userModel.findOne({username})
        

        
        if(findUser){    
            await bcrypt.compare(password, findUser.password, (err, result)=>{
                if(err)
                {
                    res.json({message:"Invalid Credentials"})
                }
                if(result)
                {
                    const token = jwt.sign({
                        _id:findUser._id
                    },JWT_USER_SECRET)
                }
            })
           
        } else{
            res.json({message:"Invalid credentials"})
        }
})

// auth middleware


userRouter.get('/courses', (req, res)=>{})

userRouter.post('/courses/:courseId', (req, res)=>{})

userRouter.get('/purchasedCourses', (req, res)=>{})

module.exports={userRouter}