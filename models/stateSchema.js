const mongoose = require('mongoose')

const stateSchema = new mongoose.Schema({
    stateName : {
        type : String,
        trim : true
    },
    countryId :{
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
module.exports = mongoose.model('state',stateSchema)

