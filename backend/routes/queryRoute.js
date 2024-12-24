const express = require('express');
const { saveQuery, deleteQuery, getAllQuery, replyQuery } = require('../controllers/queryController');
const { isAuthenticateUser, isAdmin } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');
const router = express.Router();

router.route('/query/new').post(isAuthenticateUser,singleUpload,saveQuery);
router.route('/queries').get(isAuthenticateUser,isAdmin("admin"),getAllQuery);
router.route('/query/reply/:id').post(isAuthenticateUser,isAdmin("admin"),singleUpload,replyQuery);
router.route('/query/:id').delete(isAuthenticateUser,isAdmin("admin"),deleteQuery);


module.exports = router