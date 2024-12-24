const Asset = require('../models/assetModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const sendEmail = require('../utils/sendEmail');
const getDataUri = require('../utils/dataUri')
const cloudinary = require('cloudinary')

//Store provided asset in the database

exports.saveAsset = catchAsyncErrors( async (req,res, next) => {
     //later get email from user session as we will be logged in
    const {semester,subject,type} = req.body

    const {email} = req.user

    const files = req.files['file'];
    let fileArr=[]

    if (files.length > 0) {
        //for..of.. supports async/await not forEach
        for(const item of files) {
            const file = item;
            const fileUri = getDataUri(file)

            //uploading pdf
            const myCloud2 = await cloudinary.v2.uploader.upload(fileUri.content, {
                folder: `Assets`,
            });

            fileArr.push({
                public_id: myCloud2.public_id,
                url: myCloud2.secure_url
            })
        }
    }

    await Asset.create({email,semester,subject,type,file:fileArr});

    res.status(200).json({
        success: true,
        message: "Asset submitted successfully"
    })
})

//Get all assets -- (Admin)
exports.getAllAssets = catchAsyncErrors( async (req,res, next) => {
  
   const resultPerPage = Number(req.query.result);
   const { page } = req.query
   
   let assets = await Asset.find()
   const totalAssets = assets.length

   if (Number(page) > 0 && totalAssets > resultPerPage) {
       let filteredAssets = [];
       let count = 0;
       for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
           if (i >= totalAssets) break;
           filteredAssets.push(assets[i]);
           count++;
       }
       assets = filteredAssets
   }


   res.status(200).json({
       success: true,
       assets,
       totalAssets
   })
})

//Delete asset -- (Admin)
exports.deleteAsset = catchAsyncErrors( async (req,res, next) => {
    const {id} = req.params;
    const asset = await Asset.findById(id)

    if(!asset)
    return next(new ErrorHandler("Asset doesnot exist", 404));

    const fileArr = asset.file

    if(fileArr && fileArr.length > 0){
        for(const file of fileArr ){

            const publicId = file.public_id;
        
           await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
                if (error) {
                    console.error('Error deleting file:', error);
                } else {
                    console.log('File deleted:', result);
                }
            });
        }
    }

    await Asset.deleteOne({_id:id});
 
    res.status(200).json({
        success: true,
        message: "Asset deleted successfully"
    })
 })

 //Reply to the asset
exports.replyAsset = catchAsyncErrors(async (req, res, next) => {
    const message = req.body.message;
    const { id } = req.params
    const asset = await Asset.findById(id);

    if (!asset)
        return next(new ErrorHandler("Asset doesnot exist", 404));

    try {
        await sendEmail({
            email: asset.email,
            subject: "Asset Response",
            message
    })
    }catch(error){
        return next(new ErrorHandler(error.message, 404));
    }

    asset.status = "replied",
    await asset.save()

    res.status(200).json({
        success:true,
        message:`Responded to email ${asset.email}  successfully)`
    })
 })
