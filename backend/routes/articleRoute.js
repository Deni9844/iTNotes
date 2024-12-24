const express = require('express');
const { createArticle, getAllArticles, getArticle, updateArticle, deleteArticle, addComment, replyComment, articleLikeUnlike, addCommentLikeUnlike, addReplyLikeUnlike } = require('../controllers/articleController');
const { isAuthenticateUser, isAdmin } = require('../middleware/auth');
const router = express.Router();
const singleUpload = require('../middleware/multer');

router.route('/comment/article').post(isAuthenticateUser,addComment);
router.route('/comment/article/reply/:id').post(isAuthenticateUser,replyComment);
router.route('/comment/article/likeUnlike/:id').put(isAuthenticateUser,addCommentLikeUnlike);
router.route('/reply/article/likeUnlike/:id/:rid').put(isAuthenticateUser,addReplyLikeUnlike);

router.route('/article/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload,createArticle);
router.route('/articles').get(getAllArticles);
router.route('/article/:id').get(getArticle).post(isAuthenticateUser,articleLikeUnlike)
.put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateArticle)
.delete(isAuthenticateUser,isAdmin("admin"),deleteArticle)


module.exports = router