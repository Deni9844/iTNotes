const Article = require('../models/articleModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const { setLikeUnlike } = require('./validator');
const getDataUri = require('../utils/dataUri')
const cloudinary = require('cloudinary')

//Create the article -- (Admin)
exports.createArticle = catchAsyncErrors(async (req, res, next) => {
    const { title, author } = req.body;

    const cover = req.files['cover'][0];
    const coverUri = getDataUri(cover)

    //uploading image 
    const myCloud1 = await cloudinary.v2.uploader.upload(coverUri.content, {
        folder: `Articles`,
    });

    const uploadedCover = {
        public_id: myCloud1.public_id,
        url: myCloud1.secure_url
    }


    const file = req.files['file'][0];
    const fileUri = getDataUri(file)


    //uploading pdf
    const myCloud2 = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Articles`,
    });


    const uploadedFile = {
        public_id: myCloud2.public_id,
        url: myCloud2.secure_url
    }

    await Article.create({ title, author, cover: uploadedCover, file: uploadedFile });
    res.status(200).json({
        success: true,
        message: "Article created successfully"
    })
})

//Get all the articles
exports.getAllArticles = catchAsyncErrors(async (req, res, next) => {
    const { page } = req.query
    const resultPerPage = Number(req.query.resultPerPage);

    let articles = await Article.find();
    const totalArticles = articles.length

    if (Number(page) > 0 && totalArticles > resultPerPage) {
        let filteredArticles = [];
        let count = 0;
        for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
            if (i >= totalArticles) break;
            filteredArticles.push(articles[i]);
            count++;
        }
        articles = filteredArticles
    }

    res.status(200).json({
        success: true,
        articles,
        totalArticles,
        resultPerPage
    })

})

//Get specific article
exports.getArticle = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article)
        return next(new ErrorHandler("Article not found", 404));

    res.status(200).json({
        success: true,
        article,
    })
})

//Update an article -- (Admin)
exports.updateArticle = catchAsyncErrors(async (req, res, next) => {
    const fileCheck = req.files['file'] ? req.files['file'][0] : null;
    const coverCheck = req.files['cover'] ? req.files['cover'][0] : null;

    const { id } = req.params;
    const { title, author } = req.body;

    const article = await Article.findById(id);

    if (!article)
        return next(new ErrorHandler("Article not found", 404));

    //Is edited cover submitted
    let coverMyCloud = {}
    let coverIsFileInfo = false

    if (coverCheck) {
        const publicId = article.cover.public_id;
        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const cover = req.files['cover'][0];
        const coverUri = getDataUri(cover)

        coverMyCloud = await cloudinary.v2.uploader.upload(coverUri.content, {
            folder: `Articles`,
        });

        coverIsFileInfo = true
    }

    const updatedCover = coverIsFileInfo ?
        {
            public_id: coverMyCloud.public_id,
            url: coverMyCloud.secure_url
        } : article.cover

    //Is edited file submitted
    let myCloud = {}
    let isFileInfo = false

    if (fileCheck) {
        const publicId = article.file.public_id;
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
            folder: `Articles`,
        });

        isFileInfo = true
    }

    const updatedFile = isFileInfo ?
        {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        } : article.file

    await Article.findOneAndUpdate({ _id: id }, { title, author, cover: updatedCover, file: updatedFile });

    res.status(200).json({
        success: true,
        message: "Article updated successfully"
    })
})

//Delete an article -- (Admin)
exports.deleteArticle = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article)
        return next(new ErrorHandler("Article not found", 404));

    //deleting the file
    const publicId = article.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

      //deleting the cover
    const coverPublicId = article.cover.public_id;

    cloudinary.uploader.destroy(coverPublicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    await Article.deleteOne({ _id: id });

    res.status(200).json({
        success: true,
        message: "Article deleted successfully"
    })
})


//Placing comment into an article
exports.addComment = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    const { text, articleId } = req.body;

    const comment = {
        user: req.user.id,
        name: req.user.username,
        profileImg: req.user.avatar.url,
        text,
    }

    const article = await Article.findOne({ _id: articleId });

    if (!article)
        return next(new ErrorHandler("Article is not found", 404));

    article.comments.push(comment)

    await article.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Comment added successfully"
    })
})

//Adding reply to the comment
exports.replyComment = catchAsyncErrors(async (req, res, next) => {
    const { text, articleId } = req.body;
    const { id: cmtId } = req.params

    const comment = {
        user: req.user.id,
        name: req.user.username,
        profileImg: req.user.avatar.url,
        text,
    }

    const article = await Article.findOne({ _id: articleId });

    if (!article)
        return next(new ErrorHandler("Article is not found", 404));


    const isComment = article.comments.find((c) => c._id.toString() === cmtId.toString());

    isComment.replies.push(comment)

    await article.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Replied successfully"
    })
})

//Placing like or unlike to article
exports.articleLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const { like, unlike } = req.body;

    const article = await Article.findOne({ _id: id });

    if (!article)
        return next(new ErrorHandler("article is not found", 404));

    if (like) {
        const isLiked = article.like.users.some((u) => u.id.toString() === req.user.id.toString())
        if (isLiked)
            return next(new ErrorHandler("You have already submitted vote", 404));

        article.like.users.push({ id: req.user.id })
        article.like.total += 1;
        const filteredUnlikeUsers = article.unlike.users.filter((u) => u.id.toString() !== req.user.id.toString())
        if (article.unlike.users.length - filteredUnlikeUsers.length > 0) {
            article.unlike.total -= 1;
            article.unlike.users = filteredUnlikeUsers
        }
    } else if (unlike) {
        const isUnliked = article.unlike.users.some((u) => u.id.toString() === req.user.id.toString())
        if (isUnliked)
            return next(new ErrorHandler("You have already submitted vote", 404));
        article.unlike.users.push({ id: req.user.id })
        article.unlike.total += 1;
        const filteredLikeUsers = article.like.users.filter((u) => u.id.toString() !== req.user.id.toString())
        if (article.like.users.length - filteredLikeUsers.length > 0) {
            article.like.total -= 1;
            article.like.users = filteredLikeUsers
        }
    }

    await article.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Like unlike to article added successfully"
    })
})

//Adding like and unlike to comment
exports.addCommentLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { like, unlike, articleId } = req.body;

    const { id: cmtId } = req.params

    const article = await Article.findOne({ _id: articleId });

    if (!article)
        return next(new ErrorHandler("article is not found", 404));

    const isComment = article.comments.some((c) => c._id.toString() === cmtId.toString());

    if (isComment) {
        article.comments.forEach((c) => {
            if (c._id.toString() === cmtId.toString()) {
                setLikeUnlike(c, req.user.id, like, unlike)
            }
        })
    }

    await article.save({ validateBeforeSave: false });


    res.status(200).json({
        success: true,
        message: "like unlike to article comment added successfully"
    })
})

//Adding like and unlike to reply
exports.addReplyLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { like, unlike, articleId } = req.body;
    const { id: cmtId, rid: replyId } = req.params

    const article = await Article.findOne({ _id: articleId });

    if (!article)
        return next(new ErrorHandler("article is not found", 404));

    const comment = article.comments.find((c) => c._id.toString() === cmtId.toString());

    const isReply = comment.replies.some((c) => c._id.toString() === replyId.toString());

    if (isReply) {
        comment.replies.forEach((c) => {
            if (c._id.toString() === replyId.toString()) {
                setLikeUnlike(c, req.user.id, like, unlike)
            }
        })
    }

    await article.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "like unlike to article reply added successfully"
    })
})
