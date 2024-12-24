const Payment = require('../models/paymentModel');
const PurchasedItem = require('../models/purchaseModel')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const { getEsewaPaymentHash, verifyEsewaPayment } = require('../utils/esewa');
const axios = require('axios');
const ApiFeatures = require('../utils/apiFeatures');

//Intialize the esewa payment
exports.initializeEsewa = catchAsyncErrors(async (req, res, next) => {
    try {
        const { plan, slot, id } = req.body;

        const amt = plan === "monthly" ? 200 : plan === "quarterly" ? 300 : 500

        const mnth = plan === "monthly" ? 1 : plan === "quarterly" ? 6 : 12

        const totalAmt = amt * Number(slot);

        const endDate = Date.now() + slot * (mnth * (365 / 12) * 24 * 60 * 60 * 1000)
        //const endDate = Date.now() + 3*60000
        const prevPurchasedItem = await PurchasedItem.findById(id)

        if (prevPurchasedItem) {
            await PurchasedItem.deleteOne({ _id: id })
        }

        const purchasedItemData = await PurchasedItem.create({
            user: req.user._id,
            totalPrice: Number(totalAmt),
            endDate,
            plan,
            slot
        });

        const paymentInitate = await getEsewaPaymentHash({
            amount: totalAmt,
            transaction_uuid: purchasedItemData._id,
        });

        res.status(200).json({
            success: true,
            payment: paymentInitate,
            purchasedItemData,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error,
        });
    }

})

exports.completePayment = catchAsyncErrors(async (req, res, next) => {
    const { data } = req.body;

    try {
        const paymentInfo = await verifyEsewaPayment(data);
        const purchasedItemData = await PurchasedItem.findById(
            paymentInfo.response.transaction_uuid
        );

        if (!purchasedItemData) {
            return next(new ErrorHandler("Purchase not found", 404));
        }

        // Create a new payment record
        const paymentData = await Payment.create({
            pidx: paymentInfo.decodedData.transaction_code,
            transactionId: paymentInfo.decodedData.transaction_code,
            productId: paymentInfo.response.transaction_uuid,
            amount: purchasedItemData.totalPrice,
            dataFromVerificationReq: paymentInfo,
            apiQueryFromUser: req.query,
            status: "success",
        });

        //updating purchased record
        await PurchasedItem.findByIdAndUpdate(
            paymentInfo.response.transaction_uuid,
            {
                $set: {
                    status: "completed",
                },
            }
        );
        // Send success response
        res.status(200).json({
            success: true,
            message: "Payment Successful",
            paymentData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred",
            error,
        });
    }
})


exports.cancelPurchase = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body
    const purchasedItem = await PurchasedItem.findById(id)

    if (!purchasedItem) {
        return next(new ErrorHandler("Purchased Item not found", 404))
    }

    //updating purchased record
    await PurchasedItem.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "cancelled",
            },
        }
    );

    // Send success response
    res.status(200).json({
        success: true,
        message: "Payment cancelled",
    });

})

exports.expirePurchase = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body
    const purchasedItem = await PurchasedItem.findById(id)

    if (!purchasedItem) {
        return next(new ErrorHandler("Purchased Item not found", 404))
    }

    //updating purchased record
    await PurchasedItem.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "expired",
            },
        }
    );

    // Send success response
    res.status(200).json({
        success: true,
        message: "subscription has expired",
    });

})

//get all purchase records
exports.getAllPurchases = catchAsyncErrors(async (req, res, next) => {

    console.log(`page = ${req.query.page}`)

    const apiFeatures = new ApiFeatures(PurchasedItem.find({ user: req.user._id }), req.query, "")
    .filter()
    .pagination(10);

    const purchases = await apiFeatures.query;

    const totalPurchases = (await PurchasedItem.find({ user: req.user._id })).length

    res.status(200).json({
        success: true,
        totalPurchases,
        purchases

    });

})


//get active purchase records
exports.getAllActivePurchases = catchAsyncErrors(async (req, res, next) => {
    const activePurchases = await PurchasedItem.find({ user: req.user._id, status: "completed" });

    if (activePurchases.length > 0) {
        res.status(200).json({
            success: true,
            activePurchases
        });
    } else {
        res.status(200).json({
            success: false,
            activePurchases
        });
    }



})


//delete the purchased item
exports.deletePurchase = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const purchasedItem = await PurchasedItem.findById(id)

    if (!purchasedItem) {
        return next(new ErrorHandler("Purchased Item not found", 404))
    }

    await purchasedItem.deleteOne({ _id: id })

    res.status(200).json({
        success: true,
        message: "Purchased Item deleted successfully",
    });

})

