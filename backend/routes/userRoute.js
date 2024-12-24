const express = require('express');
const { registerUser, userLogin, getAllUsers, userLogOut, forgotPassword, getMyDetails, resetPassword, updateAccount, editRole, deleteUser } = require('../controllers/userController');
const { isAuthenticateUser, isAdmin } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');

const router = express.Router();

router.route('/register').post(singleUpload, registerUser)

router.route('/login').post(userLogin)

router.route('/admin/users').get(isAuthenticateUser,isAdmin("admin"),getAllUsers)

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAuthenticateUser,getMyDetails)

router.route("/logout").get(isAuthenticateUser,userLogOut)

router.route("/update/account").post(isAuthenticateUser,updateAccount)

router.route("/user/:id").put(isAuthenticateUser,isAdmin("admin"),editRole)
.delete(isAuthenticateUser,isAdmin("admin"),deleteUser)

module.exports = router