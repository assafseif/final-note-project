//const mongoose = require('mongoose')
import mongoose from 'mongoose'
const Schema= mongoose.Schema;

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true

    },
    emailVerified:{
        type : Boolean,
        default : false
    }
    ,
    userToken:String,
    userTokenExpires:Date


})


export default mongoose.model('User',userSchema);