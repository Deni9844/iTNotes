import { configureStore } from '@reduxjs/toolkit'

import { allSemReducer, allSubReducer, chapterReducer, questionsReducer, subjectReducer } from "./reducers/semesterReducer";
import { activePurchaseReducer, newCommentReducer, passwordReducer, purchaseReducer, userReducer } from './reducers/userReducer';
import { noticeReducer, noticesReducer } from './reducers/noticeReducer';
import { articleReducer, articlesReducer } from './reducers/articleReducer';
import { allAssetsReducer, allQueriesReducer, allUsersReducer, newReducer, profileReducer } from './reducers/adminReducer';


const store = configureStore({
  reducer: {
    semesters: allSemReducer,
    semester: allSubReducer,
    subject: subjectReducer,
    chapter: chapterReducer,
    forgotPassword:passwordReducer,
    user: userReducer,
    purchase: purchaseReducer,
    activePurchase: activePurchaseReducer,
    profile: profileReducer,
    new: newReducer,
    newComment: newCommentReducer,
    questions: questionsReducer,
    notices: noticesReducer,
    notice: noticeReducer,
    articles: articlesReducer,
    article: articleReducer,
    allUsers: allUsersReducer,
    allQueries: allQueriesReducer,
    allAssets: allAssetsReducer
  },
})

export default store;