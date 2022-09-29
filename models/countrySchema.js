const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    countryName : {
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
module.exports = mongoose.model('country',countrySchema)

