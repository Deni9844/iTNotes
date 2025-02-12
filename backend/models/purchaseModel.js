const mongoose = require("mongoose");
const validator = require('validator')

// Define the schema for the purchased item
const purchasedItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },
        name:{
            type: String,
            required: [true, "Please Enter Your Name"],
        }
        ,phoneNum:{
            type: Number,
            required: [true, "Please Enter Your Phone number"],
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        plan: {
            type: String,
            enum: ["monthly", "quarterly", "yearly"],
            required: true
        },
        slot: {
            type: Number,
            default: 1
        },
        startDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled", "expired"],
            default: "pending"
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("PurchasedItem", purchasedItemSchema);
