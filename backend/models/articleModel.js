const mongoose = require('mongoose')

const articleShema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please provide the article title"],
    },
    author:{
        type:String,
        trim:true,
        required:[true,"Please provide the author name"]
    },
    cover:{
        public_id:{
            type:String,
        },
        url:{
            type:String
        }
    },
    file:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    comments: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "Users",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        profileImg:{
            type:String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        like:{
            value:{
                type:Number,
                default:0
            },
            users:[{
                user:{
                type: mongoose.Schema.ObjectId,
                ref: "Users",
                required: true 
                }
            }]
        },
        unlike:{
            value:{
                type:Number,
                default:0
            },
            users:[{
                user:{
                type: mongoose.Schema.ObjectId,
                ref: "Users",
                required: true 
                }
            }]
        },
        time: {
            type: Date,
            default: Date.now
        },
        replies:[{
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "Users",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            profileImg:{
                type:String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            like:{
                value:{
                    type:Number,
                    default:0
                },
                users:[{
                    user:{
                    type: mongoose.Schema.ObjectId,
                    ref: "Users",
                    required: true 
                    }
                }]
            },
            unlike:{
                value:{
                    type:Number,
                    default:0
                },
                users:[{
                    user:{
                    type: mongoose.Schema.ObjectId,
                    ref: "Users",
                    required: true 
                    }
                }]
            },
            time: {
                type: Date,
                default: Date.now
            },
        }]

    }],
    like: {
        users: [{id: {
                type: mongoose.Schema.ObjectId,
                ref: "Users",
                required: true,
            }
        },
        ],
        total: {
            type: Number,
            default:0
        },
    },
    unlike: {
        users: [{id:{
            type: mongoose.Schema.ObjectId,
            ref: "Users",
            required: true
        }}],
        total: {
            type: Number,
            default:0
        },
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Articles",articleShema);