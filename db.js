const mongoose =require('mongoose')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },

    password:{
        type: String
    }
})

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },

    password:{
        type: String,
        require:true
    }
})

const courseSchema = new mongoose.Schema({
    adminId:Object,
    title:String,
    description:String,
    price:Number,
    imageURL:String,
    published:Boolean,
})

const purchaseSchema = new mongoose.Schema({
    userID:Object,
    courseID:Object
})


const userModel = mongoose.model('user',userSchema)
const adminModel = mongoose.model('admin', adminSchema)
const courseModel= mongoose.model('course', courseSchema)
const purcahseModel = mongoose.model('purchase',purchaseSchema)


module.exports={
    userModel,
    adminModel,
    courseModel,
    purcahseModel
}