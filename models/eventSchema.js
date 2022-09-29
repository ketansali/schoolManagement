const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    eventName : {
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
    time : {
        type : String,
        trim : true
    },
    images : [{
        type : String,
        trim : true
    }],
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
module.exports = mongoose.model('event',eventSchema)

