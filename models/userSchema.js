"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        trim : true
    },
    lastName : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        trim : true
    },
    contact : {
        type : Number,
        trim : true
    },
    country : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'country'
    },
    state : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'state'
    },
    city : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'city'
    },
    address : {
        type : String,
        trim : true
    },
    image : {
        type : String,
        trim : true
    },
    role : {
        type : String,
        trim : true
    },
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'department'
    },
    DOB : {
        type : Date,
        trim : true
    },
    DOJ : {
        type : Date,
        trim : true
    },
    degree : {
        type : String,
        trim : true
    },
    courseId : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'course'
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    userType : {
        type : String,
        trim : true
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    isActive : {
        type : Boolean,
        trim : true
    },
    password : {
        type : String,
        trim : true
    },
},{timestamps:true})
userSchema.index({ email: 1 });

userSchema.pre('save',function(next){
    const user = this
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err) return next(err)
            user.password = hash
            next()  
        })
    }) 
})


module.exports = mongoose.model('users',userSchema)

