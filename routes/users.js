const bodyParser = require('body-parser');
const {Router} = require('express')
const userRouter = Router();

const {JWT_USER_SECRET}= require('../config')

userRouter.use(bodyParser.urlencoded({extended:false}))

userRouter.post('/signup', (req, res)=>{

})

userRouter.post('/login', (req, res)=>{

})

// auth middleware


userRouter.get('/courses', (req, res)=>{})

userRouter.post('/courses/:courseId', (req, res)=>{})

userRouter.get('/purchasedCourses', (req, res)=>{})

