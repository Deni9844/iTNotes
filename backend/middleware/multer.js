const multer = require('multer');

const storage = multer.memoryStorage();

const singleUpload = multer({
    storage,
}).fields([
    { name: 'file', maxCount: 10 },
    { name: 'cover', maxCount: 1 }, 
  ]);

module.exports = singleUpload

