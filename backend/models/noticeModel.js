const mongoose = require('mongoose')

const allowedCategories = ['Result', 'Exam Schedule', 'Notice']

const noticeSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide the article title"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Please provide the category"],
        enum: {
            values: allowedCategories,
            message: '{VALUE} is not a valid category '
        }
    },
    provider: {
        type: String,
        required: true
    },
    file: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Notices', noticeSchema);