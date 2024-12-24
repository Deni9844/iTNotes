import {
    ALL_ARTICLES_REQUEST,
    ALL_ARTICLES_SUCCESS,
    ALL_ARTICLES_FAIL,
    ARTICLE_REQUEST,
    ARTICLE_SUCCESS, ARTICLE_FAIL,
    CLEAR_ERRORS
}
    from '../constants/articleConstants'

import {
    NEW_COMMENT_REQUEST,
    NEW_COMMENT_SUCCESS,
    NEW_COMMENT_FAIL,
} from '../constants/userConstants'

import axios from 'axios'

//Get all articles
export const getAllArticles = (page, resultPerPage) => async (dispatch) => {
    try {
        dispatch({ type: ALL_ARTICLES_REQUEST })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                page,
                resultPerPage
            }
        };

        const { data } = await axios.get(`/api/v1/articles`, config);

        dispatch({
            type: ALL_ARTICLES_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_ARTICLES_FAIL,
            payload: error.response.data.message
        })
    }

}

//Get specific article details
export const getArticle = (id) => async (dispatch) => {
    try {
        dispatch({ type: ARTICLE_REQUEST })

        const { data } = await axios.get(`/api/v1/article/${id}`);

        dispatch({
            type: ARTICLE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ARTICLE_FAIL,
            payload: error.response.data.message
        })
    }

}

//Like or unlike a article
export const placeArticleLikeUnlike = (id, dataValues) => async (dispatch) => {
    try {

        const config = { headers: { "Content-Type": "application/json" } };

        await axios.post(`/api/v1/article/${id}`, dataValues, config);

    } catch (error) {
        dispatch({
            payload: error.response.data.message
        })
    }

}

//Add a new comment
export const addArticleComment = (userData) => async (dispatch) => {
    try {
        dispatch({
            type: NEW_COMMENT_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(`/api/v1/comment/article`, userData, config);

        dispatch({
            type: NEW_COMMENT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_COMMENT_FAIL,
            payload: error.response.data.message
        })
    }
}

//Add a reply to comment
export const addArticleReply = (userData, cmtId) => async (dispatch) => {
    try {
        dispatch({
            type: NEW_COMMENT_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(`/api/v1/comment/article/reply/${cmtId}`, userData, config);

        dispatch({
            type: NEW_COMMENT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_COMMENT_FAIL,
            payload: error.response.data.message
        })
    }
}

//Add Like or unlike 
export const articleCmtlikeUnlike = (data, cmtId, rid) => async () => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        rid != null ? await axios.put(`/api/v1/reply/article/likeUnlike/${cmtId}/${rid}`, data, config) :
            await axios.put(`/api/v1/comment/article/likeUnlike/${cmtId}`, data, config);

    } catch (error) {
        console.log(error.response.data.message)
    }
}


export const clearError = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}