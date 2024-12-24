const mongoose = require('mongoose')

const semesterSchema = new mongoose.Schema({
    semester: {
        type: String,
        required: [true, "Please specify the semester"],
        trim: true
    },
    subject: {
        type: String,
        required: [true, "Please enter the subject name"],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, "Please enter the subject code"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide the subject description"]
    },
    chapters: [
        {
            name: {
                type: String,
                required: true
            },
            creditHrs: {
                type: Number,
                required: true
            },
            number: {
                type: Number,
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
            stds:{
             type:Number,
             defaul:400
            },
            provider: {
                type: String,
                required: true
            },
            topic: {
                type: String,
                required: true

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
                profileImg: {
                    type: String,
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                sentiment:{
                    type: String,
                    enum: ["Positive", "Negative", "Neutral"],
                    required:true
                },
                like: {
                    value: {
                        type: Number,
                        default: 0
                    },
                    users: [{
                        user: {
                            type: mongoose.Schema.ObjectId,
                            ref: "Users",
                            required: true
                        }
                    }]
                },
                unlike: {
                    value: {
                        type: Number,
                        default: 0
                    },
                    users: [{
                        user: {
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
                replies: [{
                    user: {
                        type: mongoose.Schema.ObjectId,
                        ref: "Users",
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    profileImg: {
                        type: String,
                        required: true
                    },
                    text: {
                        type: String,
                        required: true
                    },
                    sentiment:{
                        type: String,
                        enum: ["Positive", "Negative", "Neutral"],
                        required:true
                    },
                    like: {
                        value: {
                            type: Number,
                            default: 0
                        },
                        users: [{
                            user: {
                                type: mongoose.Schema.ObjectId,
                                ref: "Users",
                                required: true
                            }
                        }]
                    },
                    unlike: {
                        value: {
                            type: Number,
                            default: 0
                        },
                        users: [{
                            user: {
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
            questions: [{
                provider: {
                    name: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true,
                    }
                },
                subject:{
                    type: String,
                     required: true
                },
                qtns: {
                    type: String,
                    required: true
                },
                answer: {
                    public_id: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true
                    }
                },
                askedOn: {
                    type: Number,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }]
        }],
    syllabus: {
        fullMarks: {
            type: Number,
            default: 60
        },
        passMarks: {
            type: Number,
            default: 24
        },
        courseDescription: {
            type: String,
        },
        courseObjective: {
            type: String,
        },
        labWorks: {
            type: String,
        },
        referenceBooks: {
            type: String,
        }, textBook: {
            type: String,
        }
    },
    qtnsBank: [
        {
            year: {
                type: Number,
                required: [true, "Please Enter the year "],
                maxLength: [4, "Year cannot exceed 4 characters"],
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
            }
        }],
    book: {
        writer: {
            type: String,

        },
        file: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    },
    labReport: {
        provider: {
            type: String,
        },
        file: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    },
    viva: {
        provider: {
            type: String,
        },
        file: {
            public_id: {
                type: String,

            },
            url: {
                type: String,

            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model("Semester", semesterSchema);