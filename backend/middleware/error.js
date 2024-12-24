module.exports = (err,req,res,next) => {
  err.statusCode = err.statusCode || 500; // err can be the instance of ErrorHandler class or also can be the error object when error arises due to different reasons
  err.message  =  err.message || "Internal Server error"

  if(err.name === "ValidationError"){
     err.statusCode = 400;
  }

  if(err.code === 11000  && err.keyPattern && err.keyValue ){
    const duplicatedField = Object.keys(err.keyPattern)[0];
    const duplicatedValue = err.keyValue[duplicatedField];
    err.statusCode = 400;
    err.message = `The ${duplicatedField} '${duplicatedValue}' already exists`;
  }
  res.status(err.statusCode).json({
    success:false,
    message: err.message,

  })
}