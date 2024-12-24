const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

exports.isAuthenticateUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies

    if (!token)
        return next(new ErrorHandler("Please login to access this resources", 400));

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
        return next(new ErrorHandler("Please login to access this resources", 400));

    req.user = await User.findById(decodedData.id) //we can access the id that we use while creating the token as decodedData.id

    next() // pass control to the next middleware or route handler
})

exports.isAdmin = (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`, 400));
        next()
    }
