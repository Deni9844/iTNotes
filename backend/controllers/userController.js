const User = require('../models/userModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const sendEmail = require('../utils/sendEmail');
const sendToken = require('../utils/jwtToken')
const crypto = require('crypto')
const cloudinary = require('cloudinary');
const getDataUri = require('../utils/dataUri');

//Register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    const file = req.files['file'][0]
    const fileUri = getDataUri(file)


    if (password !== confirmPassword)
        return next(new ErrorHandler("Password doesnot match", 400))

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        folder: "User/avatars",
        public_id: email.split('@')[0]
    })

    const user = await User.create({
        username,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    sendToken(user, 200, res);
})

//Login
exports.userLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password, used, avatar, username } = req.body
    let user
    if (used === 'other' ) {
        user = await User.findOne({ email: email })
        if (!user) {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "User/avatars",
                width: 150,
                crop: "scale"
            })

           user =  await User.create({
                username,
                email,
                used,
                avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            })
        }
    }else {
        if (!email || !password) {
            return next(new ErrorHandler("Please enter Email & password", 400))  //400-bad request
        }


        user = await User.findOne({ $or: [{ email: email }, { username: email }] }).select("+password") // include the password explicitly in the 'user' object 

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401));  //401-unauthorized
        }

        const isPasswordMatched = await user.comparePassword(password)

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }
    }

    sendToken(user, 201, res);
})

//Log out
exports.userLogOut = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logout successfully"
    })
})

//Forgot password 
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return next(new ErrorHandler("User not found", 404));

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your reset password token is :- \n\n ${resetPasswordUrl}. \n\n
    if you havenot requested this email then ,please ignore it`

    try {
        sendEmail({
            email: user.email,
            subject: 'ItNotes Password Recovery',
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500));
    }
})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)  // get token from the parameter 'token" enclosed in URL
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired ", 400));  //400 -->bad request
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesnot match ", 400));
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
})

//Update account details
exports.updateAccount = catchAsyncErrors(async (req, res, next) => {

    const { username, email, semester, college, phoneNum, status, facebook, instagram,
        youtube, twitter, currentPass, newPass, confirmNewPass } = req.body

    const user = await User.findById({ _id: req.user.id }).select("+password");

    //Update the password
    if (currentPass || newPass || confirmNewPass) {
        if (!currentPass || !newPass || !confirmNewPass) {
            return next(new ErrorHandler("Fill out all the password field"));
        }
        const isPasswordMatched = await user.comparePassword(currentPass)

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Current password is wrong", 401));
        }

        if (newPass != confirmNewPass)
            return next(new ErrorHandler("Password doesnot match", 401));

        user.password = newPass;

        await user.save({ validateBeforeSave: false });
    }


    const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, {
        email,
        username, semester, college, phoneNum, status, facebook, instagram,
        youtube, twitter
    }, { new: true, runValidators: true })

    res.status(200).json({
        success: true,
        message: "Details Updated successfully",
        updatedUser
    })
})

//Get my Details
exports.getMyDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
})


//Get all users -- (Admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5;
    const { page } = req.query

    let users = await User.find();
    const admins = await User.find({role:'admin'})
    const totalActivers= users.length;
    const totalAdmins = admins.length

       if ( Number(page) > 0 && totalActivers > resultPerPage) {
           let filteredActivers = [];
           let count = 0;
           for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
               if (i >= totalActivers) break;
               filteredActivers.push(users[i]);
               count++;
           }
           users = filteredActivers
       }

    res.status(200).json({
        success: true,
        users,
        totalActivers,
        resultPerPage,
        totalAdmins
    })
})


//Edit the user role -- (Admin)
exports.editRole = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const role = req.body.role;
    const user = await User.findByIdAndUpdate(id, {
        role
    }, {
        new: true,
        runValidators: true,
        useFindAndModifiy: false
    })

    res.status(200).json({
        success: true,
        user
    })

})

//Delete the user -- (Admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
        return next(new ErrorHandler("User not found", 404));

    await User.deleteOne({ _id: id })
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })

})