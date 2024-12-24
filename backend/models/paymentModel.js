const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            unique: true
        },
        pidx: {
            type: String,
            unique: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchasedItem",
            required: true,
        },
        amount: {
            type: Number,
            required: true
        },
        dataFromVerificationReq: { type: Object },
        apiQueryFromUser: { type: Object },
        status: {
            type: String,
            enum: ["success", "pending","failed"],
            default: "pending",
        },
        paymentDate: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Payment", paymentSchema);