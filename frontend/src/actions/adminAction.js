import axios from 'axios'
import {
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    ALL_QUERIES_REQUEST,
    ALL_QUERIES_SUCCESS,
    ALL_QUERIES_FAIL,
    ALL_ASSETS_REQUEST,
    ALL_ASSETS_SUCCESS,
    ALL_ASSETS_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    EDIT_USER_ROLE_REQUEST,
    EDIT_USER_ROLE_SUCCESS,
    EDIT_USER_ROLE_FAIL,
    NEW_SUBJECT_REQUEST,
    NEW_SUBJECT_SUCCESS,
    NEW_SUBJECT_FAIL,
    DELETE_SUBJECT_REQUEST,
    DELETE_SUBJECT_SUCCESS,
    DELETE_SUBJECT_FAIL,
    EDIT_SUBJECT_REQUEST,
    EDIT_SUBJECT_SUCCESS,
    EDIT_SUBJECT_FAIL,
    CLEAR_ERROR,
    NEW_CHAPTER_REQUEST,
    NEW_CHAPTER_SUCCESS,
    NEW_CHAPTER_FAIL,
    DELETE_CHAPTER_REQUEST,
    DELETE_CHAPTER_SUCCESS,
    DELETE_CHAPTER_FAIL,
    EDIT_CHAPTER_SUCCESS,
    EDIT_CHAPTER_REQUEST,
    EDIT_CHAPTER_FAIL,
    NEW_QUESTION_REQUEST,
    NEW_QUESTION_SUCCESS,
    NEW_QUESTION_FAIL,
    DELETE_QUESTION_REQUEST,
    DELETE_QUESTION_SUCCESS,
    DELETE_QUESTION_FAIL,
    EDIT_QUESTION_REQUEST,
    EDIT_QUESTION_SUCCESS,
    EDIT_QUESTION_FAIL,
    NEW_QUESTION_BANK_REQUEST,
    NEW_QUESTION_BANK_SUCCESS,
    NEW_QUESTION_BANK_FAIL,
    DELETE_QUESTION_BANK_REQUEST,
    DELETE_QUESTION_BANK_SUCCESS,
    DELETE_QUESTION_BANK_FAIL,
    EDIT_QUESTION_BANK_REQUEST,
    EDIT_QUESTION_BANK_SUCCESS,
    EDIT_QUESTION_BANK_FAIL,
    NEW_BOOK_REQUEST,
    NEW_BOOK_SUCCESS,
    NEW_BOOK_FAIL,
    DELETE_BOOK_REQUEST,
    DELETE_BOOK_SUCCESS,
    DELETE_BOOK_FAIL,
    EDIT_BOOK_REQUEST,
    EDIT_BOOK_SUCCESS,
    EDIT_BOOK_FAIL,
    NEW_LAB_REQUEST,
    NEW_LAB_SUCCESS,
    NEW_LAB_FAIL,
    DELETE_LAB_REQUEST,
    DELETE_LAB_SUCCESS,
    DELETE_LAB_FAIL,
    EDIT_LAB_REQUEST,
    EDIT_LAB_SUCCESS,
    EDIT_LAB_FAIL,
    NEW_VIVA_REQUEST,
    NEW_VIVA_SUCCESS,
    NEW_VIVA_FAIL,
    DELETE_VIVA_REQUEST,
    DELETE_VIVA_SUCCESS,
    DELETE_VIVA_FAIL,
    EDIT_VIVA_REQUEST,
    EDIT_VIVA_SUCCESS,
    EDIT_VIVA_FAIL,
    NEW_NOTICE_REQUEST,
    NEW_NOTICE_SUCCESS,
    NEW_NOTICE_FAIL,
    DELETE_NOTICE_REQUEST,
    DELETE_NOTICE_SUCCESS,
    DELETE_NOTICE_FAIL,
    EDIT_NOTICE_REQUEST,
    EDIT_NOTICE_SUCCESS,
    EDIT_NOTICE_FAIL,
    NEW_ARTICLE_REQUEST,
    NEW_ARTICLE_SUCCESS,
    NEW_ARTICLE_FAIL,
    DELETE_ARTICLE_REQUEST,
    DELETE_ARTICLE_SUCCESS,
    DELETE_ARTICLE_FAIL,
    EDIT_ARTICLE_REQUEST,
    EDIT_ARTICLE_SUCCESS,
    EDIT_ARTICLE_FAIL,
    NEW_QUERY_REQUEST,
    NEW_QUERY_SUCCESS,
    NEW_QUERY_FAIL,
    REPLY_QUERY_REQUEST,
    REPLY_QUERY_SUCCESS,
    REPLY_QUERY_FAIL,
    DELETE_QUERY_REQUEST,
    DELETE_QUERY_SUCCESS,
    DELETE_QUERY_FAIL,
    NEW_ASSEST_REQUEST,
    NEW_ASSEST_SUCCESS,
    NEW_ASSEST_FAIL,
    REPLY_ASSEST_REQUEST,
    REPLY_ASSEST_SUCCESS,
    REPLY_ASSEST_FAIL,
    DELETE_ASSEST_REQUEST,
    DELETE_ASSEST_SUCCESS,
    DELETE_ASSEST_FAIL
} from '../constants/adminConstants'

//Get all users
export const getAllUsers = (page) => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/users?page=${page}`);
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Get all queries
export const getAllQueries = (page,result) => async (dispatch) => {
    try {
        dispatch({ type: ALL_QUERIES_REQUEST })

        const { data } = await axios.get(`/api/v1/queries?page=${page}&result=${result}`);
        dispatch({
            type: ALL_QUERIES_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ALL_QUERIES_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Get all assets
export const getAllAssets= (page,result) => async (dispatch) => {
    try {
        dispatch({ type: ALL_ASSETS_REQUEST })

        const { data } = await axios.get(`/api/v1/assets?page=${page}&result=${result}`);
        dispatch({
            type: ALL_ASSETS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ALL_ASSETS_FAIL,
            payload: error.response.data.message,
        })
    }
}

//delete the user 
export const deleteUser= (userId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/v1/user/${userId}`);
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Edit the user role 
export const editUserRole= (userId,roleData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_USER_ROLE_REQUEST })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.put(`/api/v1/user/${userId}`,roleData,config);

        dispatch({
            type: EDIT_USER_ROLE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_USER_ROLE_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new subject
export const addNewSubject= (subjectData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_SUBJECT_REQUEST })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.post(`/api/v1/semester/new`,subjectData,config);

        dispatch({
            type: NEW_SUBJECT_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_SUBJECT_FAIL,
            payload: error.response.data.message,
        })
    }
}

//delete the subject
export const deleteSubject= (level,subject) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_SUBJECT_REQUEST })

        const { data } = await axios.delete(`/api/v1/semester/${level}/${subject}`);
        dispatch({
            type: DELETE_SUBJECT_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_SUBJECT_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update the subject
export const updateSubject= (level,subject,subjectData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_SUBJECT_REQUEST })
        
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.put(`/api/v1/semester/${level}/${subject}`,subjectData,config);
        dispatch({
            type: EDIT_SUBJECT_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_SUBJECT_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new chapter
export const addNewChapter= (level,sub,chapterData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_CHAPTER_REQUEST })

        const { data } = await axios.post(`/api/v1/semester/${level}/${sub}/ch/new`,chapterData);

        dispatch({
            type: NEW_CHAPTER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_CHAPTER_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete the chapter
export const deleteChapter= (level,subject,chapter) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CHAPTER_REQUEST })

        const { data } = await axios.delete(`/api/v1/semester/${level}/${subject}/${chapter}`);
        dispatch({
            type: DELETE_CHAPTER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_CHAPTER_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a chapter
export const updateChapter= (level,subject,chapter,chapterData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_CHAPTER_REQUEST })

        const { data } = await axios.put(`/api/v1/semester/${level}/${subject}/${chapter}`,chapterData);
        dispatch({
            type: EDIT_CHAPTER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_CHAPTER_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new question alogn with answer
export const addNewQuestion= (level,sub,ch,qtnData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_QUESTION_REQUEST })

        const { data } = await axios.post(`/api/v1/semester/${level}/${sub}/${ch}/question/new`,qtnData);

        dispatch({
            type: NEW_QUESTION_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_QUESTION_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a question
export const deleteQuestion= (level,sub,ch,id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_QUESTION_REQUEST })

        const { data } = await axios.delete(`/api/v1/semester/${level}/${sub}/${ch}/question/${id}`);
        dispatch({
            type: DELETE_QUESTION_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_QUESTION_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a question
export const updateQuestion= (level,sub,ch,id,qtnData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_QUESTION_REQUEST})

        const { data } = await axios.put(`/api/v1/semester/${level}/${sub}/${ch}/question/${id}`,qtnData);
        dispatch({
            type: EDIT_QUESTION_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_QUESTION_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new question bank
export const addNewQuestionBank= (level,sub,qtnBankData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_QUESTION_BANK_REQUEST })

        const { data } = await axios.post(`/api/v1/semester/${level}/${sub}/qtnsBank/new`,qtnBankData);

        dispatch({
            type: NEW_QUESTION_BANK_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_QUESTION_BANK_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a question bank
export const deleteQuestionBank= (level,sub,yrs) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_QUESTION_BANK_REQUEST })

        const { data } = await axios.delete(`/api/v1/semester/${level}/${sub}/qtnsBank/${yrs}`);
        dispatch({
            type: DELETE_QUESTION_BANK_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_QUESTION_BANK_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a question
export const updateQuestionBank= (level,sub,yrs,qtnBankData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_QUESTION_BANK_REQUEST})

        const { data } = await axios.put(`/api/v1/semester/${level}/${sub}/qtnsBank/${yrs}`,qtnBankData);
        dispatch({
            type: EDIT_QUESTION_BANK_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_QUESTION_BANK_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new book
export const addNewBook= (level,bookData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_BOOK_REQUEST })

        const { data } = await axios.post(`/api/v1/semester/${level}/book/new`,bookData);

        dispatch({
            type: NEW_BOOK_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_BOOK_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a book
export const deleteBook= (level,sub) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_BOOK_REQUEST})

        const { data } = await axios.delete(`/api/v1/semester/${level}/${sub}/book`);
        dispatch({
            type: DELETE_BOOK_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_BOOK_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a book
export const updateBook= (level,sub,bookData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_BOOK_REQUEST})

        const { data } = await axios.put(`/api/v1/semester/${level}/${sub}/book`,bookData);
        dispatch({
            type: EDIT_BOOK_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_BOOK_FAIL,
            payload: error.response.data.message,
        })
    }
}



//Add a new lab
export const addNewLab= (level,labData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_LAB_REQUEST })

        const { data } = await axios.post(`/api/v1/semester/${level}/lab/new`,labData);

        dispatch({
            type: NEW_LAB_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_LAB_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a lab
export const deleteLab= (level,sub) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_LAB_REQUEST})

        const { data } = await axios.delete(`/api/v1/semester/${level}/${sub}/lab`);
        dispatch({
            type: DELETE_LAB_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_LAB_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a lab
export const updateLab= (level,sub,labData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_LAB_REQUEST})

        const { data } = await axios.put(`/api/v1/semester/${level}/${sub}/lab`,labData);
        dispatch({
            type: EDIT_LAB_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_LAB_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new viva
export const addNewViva= (level,vivaData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_VIVA_REQUEST})

        const { data } = await axios.post(`/api/v1/semester/${level}/viva/new`,vivaData);

        dispatch({
            type: NEW_VIVA_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_VIVA_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a lab
export const deleteViva= (level,sub) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_VIVA_REQUEST})

        const { data } = await axios.delete(`/api/v1/semester/${level}/${sub}/viva`);
        dispatch({
            type: DELETE_VIVA_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_VIVA_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a lab
export const updateViva= (level,sub,vivaData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_VIVA_REQUEST})

        const { data } = await axios.put(`/api/v1/semester/${level}/${sub}/viva`,vivaData);
        dispatch({
            type: EDIT_VIVA_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_VIVA_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new notice
export const addNewNotice= (noticeData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_NOTICE_REQUEST})

        const { data } = await axios.post(`/api/v1/notice/new`,noticeData);

        dispatch({
            type: NEW_NOTICE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_NOTICE_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a lab
export const deleteNotice= (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_NOTICE_REQUEST})

        const { data } = await axios.delete(`/api/v1/notice/${id}`);
        dispatch({
            type: DELETE_NOTICE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_NOTICE_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a lab
export const updateNotice = (id,noticeData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_NOTICE_REQUEST})

        const { data } = await axios.put(`/api/v1/notice/${id}`,noticeData);
        dispatch({
            type: EDIT_NOTICE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_NOTICE_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Add a new article
export const addNewArticle= (articleData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ARTICLE_REQUEST})
        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.post(`/api/v1/article/new`,articleData,config);

        dispatch({
            type: NEW_ARTICLE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_ARTICLE_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//delete a lab
export const deleteArticle= (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ARTICLE_REQUEST})
        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.delete(`/api/v1/article/${id}`,config);
        dispatch({
            type: DELETE_ARTICLE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_ARTICLE_FAIL,
            payload: error.response.data.message,
        })
    }
}

//update a lab
export const updateArticle = (id,articleData) => async (dispatch) => {
    try {
        dispatch({ type: EDIT_ARTICLE_REQUEST})
        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.put(`/api/v1/article/${id}`,articleData,config);
        dispatch({
            type: EDIT_ARTICLE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: EDIT_ARTICLE_FAIL,
            payload: error.response.data.message,
        })
    }
}

//Ask a question ---(User)
export const askQuestion= (queryData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_QUERY_REQUEST})
        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.post(`/api/v1/query/new`,queryData,config);

        dispatch({
            type: NEW_QUERY_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_QUERY_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//Reply to a question
export const replyQuestion= (replyData,id) => async (dispatch) => {
    try {
        dispatch({ type: REPLY_QUERY_REQUEST})
        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.post(`/api/v1/query/reply/${id}`,replyData,config);

        dispatch({
            type: REPLY_QUERY_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: REPLY_QUERY_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//Delete a query
export const deleteQuery= (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_QUERY_REQUEST})

        const { data } = await axios.delete(`/api/v1/query/${id}`);

        dispatch({
            type: DELETE_QUERY_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_QUERY_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//Contribute an assest ---(User)
export const contributeAssest= (assestData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ASSEST_REQUEST})
        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.post(`/api/v1/asset/new`,assestData,config);

        dispatch({
            type: NEW_ASSEST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: NEW_ASSEST_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//reply to assest contributor 
export const replyContributor= (id,assetData) => async (dispatch) => {
    try {
        dispatch({ type: REPLY_ASSEST_REQUEST})

        const { data } = await axios.post(`/api/v1/asset/reply/${id}`,assetData);

        dispatch({
            type: REPLY_ASSEST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: REPLY_ASSEST_FAIL,
            payload: error.response.data?.message,
        })
    }
}

//Delete asset
export const deleteAssets= (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ASSEST_REQUEST})

        const { data } = await axios.delete(`/api/v1/asset/${id}`);

        dispatch({
            type: DELETE_ASSEST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_ASSEST_FAIL,
            payload: error.response.data?.message,
        })
    }
}
//clear error
export const clearAdminError = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERROR })
}