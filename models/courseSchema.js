const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName : {
        type : String,
        trim : true
    },
    startDate : {
        type : Date,
        trim : true
    },
    endDate : {
        type : Date,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    isActive : {
        type : Boolean,
        trim : true
    }
   
},{timestamps:true})
module.exports = mongoose.model('course',courseSchema)

