const mongoose = require('mongoose')

const assetSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    semester:{
        type:String,
        required:[true,"Please specify the  semester"],
    },
    subject:{
        type:String,
        required:[true,"Please specify the subject"],
    },
    type:{
        type:String,
        required:true
    },
    file:[
        {
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    }],
    status:{
        type:String,
        default:"not replied"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = mongoose.model("assets",assetSchema)