const  express = require('express')
const mongoose= require('mongoose')
const  cors=require('cors')

const {MONGO_URL}= require('./config')

const app=express()
const  port = process.env.PORT || 3000

async function main(){
    await mongoose.connect(MONGO_URL)
    app.listen(port,()=>{
        console.log(`Server listening on port ${port}`)
    })
}

main()

