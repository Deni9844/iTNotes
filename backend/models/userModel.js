const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [
            function () {
                // Only require password if 'used' field is not 'gmail'
                return this.used !== 'other';
            },
            "Please Enter Your Password"
        ],
        validate: [
            {
                validator: function (value) {
                    // Only apply minLength validation if 'used' field is not 'gmail'
                    return this.used === 'other' || (value && value.length >= 8);
                },
                message: "Password should have more than 8 characters"
            }
        ],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    used: String,
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    questions: {
        type: Number,
        default: 0
    },
    contributions: {
        type: Number,
        default: 0
    },
    semester: {
        type: String,
        default: "first"
    },
    college: {
        type: String
    },
    status: {
        type: String,
        default: "student"
    },
    phoneNum: {
        type: Number,
        validate: {
            validator: function (number) {
                return /^\d{10}$/.test(number.toString());
            },
            message: "Invalid phone number format"
        }
    },
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
})

//Hash the password before saving the document
userSchema.pre("save", async function (next) {
    if (this.used !== 'other') {
        if (!this.isModified("password"))
            next()
        this.password = await bcrypt.hash(this.password, 10)
    }

})

//Generating a jwt token using a id of a registered user
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

//Comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Genarating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //Expires in 15 minutes

    return resetToken;

}

module.exports = mongoose.model("Users", userSchema);