const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    cityName : {
        type : String,
        trim : true
    },
    stateId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'country'
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
module.exports = mongoose.model('city',citySchema)

