const express = require('express');
const { saveAsset, getAllAssets, deleteAsset, replyAsset } = require('../controllers/assetController');
const { isAuthenticateUser, isAdmin } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');
const router = express.Router();

router.route('/asset/new').post(isAuthenticateUser,singleUpload,saveAsset);
router.route('/assets').get(isAuthenticateUser,isAdmin("admin"),getAllAssets);
router.route('/asset/:id').delete(isAuthenticateUser,isAdmin("admin"),deleteAsset);
router.route('/asset/reply/:id').post(isAuthenticateUser,isAdmin("admin"),replyAsset);

module.exports = router