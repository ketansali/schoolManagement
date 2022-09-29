const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
    departmentName : {
        type : String,
        trim : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    isActive : {
        type : Boolean,
        trim : true
    }
   
},{timestamps:true})
module.exports = mongoose.model('department',departmentSchema)

