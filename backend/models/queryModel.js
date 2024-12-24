const mongoose = require('mongoose')


const querySchema = mongoose.Schema({
    email:{
       type:String,
       required:true
    },
    question:{
        type:String,
        trim:true
    },
    semester:{
        type:String,
        required:[true,"Please specify your semester"],
    },
    subject:{
        type:String,
        required:[true,"Please specify the subject"],
    },
    img:[
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

module.exports = mongoose.model('Queries',querySchema);