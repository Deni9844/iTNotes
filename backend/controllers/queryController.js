const Query = require('../models/queryModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const sendEmail = require('../utils/sendEmail');
const getDataUri = require('../utils/dataUri')
const cloudinary = require('cloudinary')

//Save the query to the database
exports.saveQuery = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.user
    const { question, subject, semester } = req.body;

    const files = req.files['file'];
    let imgArr=[]

    if (files && files.length > 0) {
        //for..of.. supports async/await not forEach
        for(const item of files) {
            const file = item;
            const fileUri = getDataUri(file)

            //uploading pdf
            const myCloud2 = await cloudinary.v2.uploader.upload(fileUri.content, {
                folder: `Queries`,
            });

            imgArr.push({
                public_id: myCloud2.public_id,
                url: myCloud2.secure_url
            })
        }
    }
    await Query.create({ question, subject, semester, img:imgArr, email });

    res.status(200).json({
        success: true,
        message: "Query submitted successfully"
    })
})

//Get all query -- (Admin)
exports.getAllQuery = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = Number(req.query.result);
    const { page } = req.query
    
    let queries = await Query.find()
    const totalQueries = queries.length

    if (Number(page) > 0 && totalQueries > resultPerPage) {
        let filteredQueries = [];
        let count = 0;
        for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
            if (i >= totalQueries) break;
            filteredQueries.push(queries[i]);
            count++;
        }
        queries = filteredQueries
    }

   

    res.status(200).json({
        success: true,
        queries,
        totalQueries
    })
})

//delete the query
exports.deleteQuery = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const query = await Query.findById(id);

    if (!query)
        return next(new ErrorHandler("Query not found", 404))

    const imgArr = query.img

    if(imgArr && imgArr.length > 0){
        for(const img of imgArr ){

            const publicId = img.public_id;
        
           await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
                if (error) {
                    console.error('Error deleting file:', error);
                } else {
                    console.log('File deleted:', result);
                }
            });
        }
    }

    await Query.deleteOne({ _id: id });

    res.status(200).json({
        success: true,
        message: "Query deleted successfully"
    })
})

//Reply to the query 
exports.replyQuery = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const query = await Query.findOne({ _id: id });

    const file = req.files['file'][0]
    const fileUri = getDataUri(file)

    if (!query)
        return next(new ErrorHandler("Query doesnot exist", 404));
    try {
        await sendEmail({
            email: query.email,
            subject: "Question Response",
            message:`The answer to your question submitted to ItNotes is provided in the attachment below. 
            Please download it to view the answer`,
            file: {
                content: fileUri.content, // The Data URI content
                mimetype: file.mimetype // File MIME type
            },
            name:file.originalname
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 404));
    }

     query.status = "replied"
     await query.save()

    res.status(200).json({
        success: true,
        message: `Responded to email ${query.email} with answer successfully)`
    })
})
