const express = require('express');
const { createNotice, getAllNotices, getNotice, updateNotice, deleteNotice, noticeLikeUnlike, replyComment,addComment, addCommentLikeUnlike, addReplyLikeUnlike } = require('../controllers/noticeController');
const { isAdmin, isAuthenticateUser } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');

const router = express.Router();


router.route('/notice/comment').post(isAuthenticateUser,addComment);
router.route('/notice/comment/reply/:id').post(isAuthenticateUser,replyComment);
router.route('/notice/comment/likeUnlike/:id').put(isAuthenticateUser,addCommentLikeUnlike);
router.route('/notice/reply/likeUnlike/:id/:rid').put(isAuthenticateUser,addReplyLikeUnlike);

router.route('/notice/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload, createNotice);
router.route('/notices').get(getAllNotices);
router.route('/notice/:id').get(getNotice).post(isAuthenticateUser,noticeLikeUnlike)
.put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateNotice)
.delete(isAuthenticateUser,isAdmin("admin"),deleteNotice);




module.exports = router