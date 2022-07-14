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
    userTokenExpires:Date,
    wrongPassword :{
        Attempt:Number,
        Forbidden:Boolean,
        ForbiddenTime:Date
    }


})


export default mongoose.model('User',userSchema);