const express = require('express');
const { createSem, getAllSubjects, getSubjectDetails, updateSubject, deleteSubject, addChapter, deleteChapter, updateChapter, addQuestion, getAnswer, updateQuestion, deleteQuestion, addQtnsBank, updateQtnBank, deleteQtnBank, addBook, updateBook, deleteBook, addLab, updateLab, deleteLab, addViva, updateViva, deleteViva, addComment, getAllSemesters, getAllQuestions, getChapterDetails, replyComment, addCommentLikeUnlike, addReplyLikeUnlike} = require('../controllers/semesterController');
const { isAuthenticateUser, isAdmin } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');

const router = express.Router();

router.route('/semester/new').post(isAuthenticateUser,isAdmin("admin"),createSem);

router.route('/semesters').get(getAllSemesters)

router.route('/semester/:level/:sub/qtnsBank/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload,addQtnsBank)
router.route('/semester/:level/:sub/qtnsBank/:yrs').
put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateQtnBank)
.delete(isAuthenticateUser,isAdmin("admin"),deleteQtnBank)

router.route('/semester/:level/book/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload,addBook)
router.route('/semester/:level/:sub/book').put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateBook)
.delete(isAuthenticateUser,isAdmin("admin"),deleteBook)

router.route('/semester/:level/lab/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload,addLab)
router.route('/semester/:level/:sub/lab').put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateLab).
delete(isAuthenticateUser,isAdmin("admin"),deleteLab)

router.route('/semester/:level/viva/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload,addViva)
router.route('/semester/:level/:sub/viva').put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateViva)
.delete(isAuthenticateUser,isAdmin("admin"),deleteViva)

router.route('/semester/:level').get(getAllSubjects)
router.route('/semester/:level/:sub').get(getSubjectDetails)
.put(isAuthenticateUser,isAdmin("admin"),updateSubject)
.delete(isAuthenticateUser,isAdmin("admin"),deleteSubject)

router.route('/semester/:level/:sub/ch/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload, addChapter);
router.route('/semester/:level/:sub/:ch').get(getChapterDetails)
.delete(isAuthenticateUser,isAdmin("admin"),deleteChapter)
.put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateChapter);

router.route('/questions').get(getAllQuestions)

router.route('/semester/:level/:sub/:ch/question/new').post(isAuthenticateUser,isAdmin("admin"),singleUpload,addQuestion)
router.route('/semester/:level/:sub/:ch/question/:id')
.get(getAnswer)
.put(isAuthenticateUser,isAdmin("admin"),singleUpload,updateQuestion)
.delete(isAuthenticateUser,isAdmin("admin"),deleteQuestion)

router.route('/comment/chapter').put(isAuthenticateUser,addComment)
router.route('/comment/likeUnlike/:id').put(isAuthenticateUser,addCommentLikeUnlike)
router.route('/comment/reply/:id').put(isAuthenticateUser,replyComment)
router.route('/comment/likeUnlike/:cid/:rid').put(isAuthenticateUser,addReplyLikeUnlike)

module.exports = router