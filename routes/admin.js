const bodyParser = require('body-parser');
const  {Router} = require('express')
const adminRouter = Router();

const {JWT_ADMIN_SECRET}= require('../config')

adminRouter.use(bodyParser.urlencoded({extended:false}))

adminRouter.post('/signup', (req,res)=>{

})


adminRouter.post('/login', (req, res)=>{

})

// auth middleware


adminRouter.post('/courses', (req, res)=>{

})


adminRouter.put('/courses/:courseId', (req, res)=>{

})

adminRouter.get('/courses', (req, res)=>{

})

module.exports={adminRouter}