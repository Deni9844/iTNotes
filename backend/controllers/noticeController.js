const Notice = require('../models/noticeModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cloudinary = require('cloudinary')
const ErrorHandler = require('../utils/ErrorHandler');
const { setLikeUnlike } = require('./validator')
const getDataUri = require('../utils/dataUri')

//Create notice
exports.createNotice = catchAsyncErrors(async (req, res, next) => {
    const { title, category, provider } = req.body;

    const file = req.files['file'][0];
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Notices`,
    });

    const uploadedFile = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }

    await Notice.create({ title, category, file: uploadedFile, provider });

    res.status(200).json({
        success: true,
        message: " Notice created successfully"
    })
})

//Get all notices
exports.getAllNotices = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = Number(req.query.result);
    const { page } = req.query
    let notices = await Notice.find();

    const totalNotices = notices.length;

    if (Number(page) > 0 && totalNotices > resultPerPage) {
        let filteredNotices = [];
        let count = 0;
        for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
            if (i >= totalNotices) break;
            filteredNotices.push(notices[i]);
            count++;
        }
        notices = filteredNotices
    }

    res.status(200).json({
        success: true,
        notices,
        totalNotices,
        resultPerPage
    })
})

//Get a specific notice
exports.getNotice = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice)
        return next(new ErrorHandler("Notice not found", 404))

    res.status(200).json({
        success: true,
        notice,
    })
})

//Update a notice
exports.updateNotice = catchAsyncErrors(async (req, res, next) => {
    const { title, category, provider } = req.body;
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice)
        return next(new ErrorHandler("Note not found", 404))

    let myCloud = {}
    let isFileInfo = false

    const fileCheck = req.files['file'] ? req.files['file'][0] : null;

    if (fileCheck) {
        const publicId = notice.file.public_id;
        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Notices`,
        });

        isFileInfo = true
    }

    const updatedFile = isFileInfo ?
        {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        } : notice.file


    await Notice.findOneAndUpdate({ _id: id }, { title, category, provider, file: updatedFile }, {
        new: true,
    });

    res.status(200).json({
        success: true,
        message: "Notice updated successfully"
    })
})

//Delete a notice
exports.deleteNotice = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice)
        return next(new ErrorHandler("Note not found", 404))

    const publicId = notice.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    await Notice.deleteOne({ _id: id });

    res.status(200).json({
        success: true,
        message: "Notice deleted successfully"
    })
})

//Placing comment into an notice
exports.addComment = catchAsyncErrors(async (req, res, next) => {
    const { text, noticeId } = req.body;

    const comment = {
        user: req.user.id,
        name: req.user.username,
        profileImg: req.user.avatar.url,
        text,
    }

    const notice = await Notice.findOne({ _id: noticeId });

    if (!notice)
        return next(new ErrorHandler("Notice is not found", 404));

    notice.comments.push(comment)

    await notice.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Comment added successfully"
    })

})

//Adding reply to the comment
exports.replyComment = catchAsyncErrors(async (req, res, next) => {
    const { text, noticeId } = req.body;
    const { id: cmtId } = req.params

    const comment = {
        user: req.user.id,
        name: req.user.username,
        profileImg: req.user.avatar.url,
        text,
    }

    const notice = await Notice.findOne({ _id: noticeId });

    if (!notice)
        return next(new ErrorHandler("notice is not found", 404));


    const isComment = notice.comments.find((c) => c._id.toString() === cmtId.toString());

    isComment.replies.push(comment)

    await notice.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Replied successfully"
    })
})

//Placing like or unlike to notice
exports.noticeLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const { like, unlike } = req.body;

    const notice = await Notice.findOne({ _id: id });

    if (!notice)
        return next(new ErrorHandler("notice is not found", 404));

    if (like) {
        const isLiked = notice.like.users.some((u) => u.id.toString() === req.user.id.toString())
        if (isLiked)
            return next(new ErrorHandler("You have already submitted vote", 404));

        notice.like.users.push({ id: req.user.id })
        notice.like.total += 1;
        const filteredUnlikeUsers = notice.unlike.users.filter((u) => u.id.toString() !== req.user.id.toString())
        if (notice.unlike.users.length - filteredUnlikeUsers.length > 0) {
            notice.unlike.total -= 1;
            notice.unlike.users = filteredUnlikeUsers
        }
    } else if (unlike) {
        const isUnliked = notice.unlike.users.some((u) => u.id.toString() === req.user.id.toString())
        if (isUnliked)
            return next(new ErrorHandler("You have already submitted vote", 404));
        notice.unlike.users.push({ id: req.user.id })
        notice.unlike.total += 1;
        const filteredLikeUsers = notice.like.users.filter((u) => u.id.toString() !== req.user.id.toString())
        if (notice.like.users.length - filteredLikeUsers.length > 0) {
            notice.like.total -= 1;
            notice.like.users = filteredLikeUsers
        }
    }

    await notice.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Like unlike to notice added successfully"
    })
})

//Adding like and unlike to comment
exports.addCommentLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { like, unlike, noticeId } = req.body;

    const { id: cmtId } = req.params

    const notice = await Notice.findOne({ _id: noticeId });

    if (!notice)
        return next(new ErrorHandler("notice is not found", 404));

    const isComment = notice.comments.some((c) => c._id.toString() === cmtId.toString());

    if (isComment) {
        notice.comments.forEach((c) => {
            if (c._id.toString() === cmtId.toString()) {
                setLikeUnlike(c, req.user.id, like, unlike)
            }
        })
    }

    await notice.save({ validateBeforeSave: false });


    res.status(200).json({
        success: true,
        message: "like unlike to notice comment added successfully"
    })
})

//Adding like and unlike to reply
exports.addReplyLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { like, unlike, noticeId } = req.body;
    const { id: cmtId, rid: replyId } = req.params

    const notice = await Notice.findOne({ _id: noticeId });

    if (!notice)
        return next(new ErrorHandler("notice is not found", 404));

    const comment = notice.comments.find((c) => c._id.toString() === cmtId.toString());

    const isReply = comment.replies.some((c) => c._id.toString() === replyId.toString());

    if (isReply) {
        comment.replies.forEach((c) => {
            if (c._id.toString() === replyId.toString()) {
                setLikeUnlike(c, req.user.id, like, unlike)
            }
        })
    }

    await notice.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "like unlike to notice reply added successfully"
    })
})