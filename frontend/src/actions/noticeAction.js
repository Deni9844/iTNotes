import {
    ALL_NOTICES_REQUEST,
    ALL_NOTICES_SUCCESS,
    ALL_NOTICES_FAIL,
    NOTICE_REQUEST,
    NOTICE_SUCCESS,
    NOTICE_FAIL,
} from '../constants/noticeConstant'

import {
    NEW_COMMENT_REQUEST,
    NEW_COMMENT_SUCCESS,
    NEW_COMMENT_FAIL,
} from '../constants/userConstants'
import axios from 'axios'


//Get all notices
export const getAllNotices = (page,resultPerPage=12) => async (dispatch) => {
    try {
        dispatch({ type: ALL_NOTICES_REQUEST })

        const { data } = await axios.get(`/api/v1/notices?page=${page}&result=${resultPerPage}`);

        dispatch({
            type: ALL_NOTICES_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_NOTICES_FAIL,
            payload: error.response.data.message
        })
    }

}

//Get specific notice details
export const getNotice = (id) => async (dispatch) => {
    try {
        dispatch({ type: NOTICE_REQUEST })

        const { data } = await axios.get(`/api/v1/notice/${id}`);

        dispatch({
            type: NOTICE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NOTICE_FAIL,
            payload: error.response.data.message
        })
    }

}

//Like or unlike a notice
export const placeNoticeLikeUnlike = (id, dataValues) => async (dispatch) => {
    try {

        const config = { headers: { "Content-Type": "application/json" } };

        await axios.post(`/api/v1/notice/${id}`, dataValues, { config });

    } catch (error) {
        dispatch({
            payload: error.response.data.message
        })
    }

}

//Add a new comment
export const addNoticeComment = (userData) => async (dispatch) => {
    try {
        dispatch({
            type: NEW_COMMENT_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(`/api/v1/notice/comment`, userData, config);

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
export const addNoticeReply = (userData, cmtId) => async (dispatch) => {
    try {
        dispatch({
            type: NEW_COMMENT_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(`/api/v1/notice/comment/reply/${cmtId}`, userData, config);

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
export const noticeCmtlikeUnlike = (data, cmtId, rid) => async () => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        rid != null ? await axios.put(`/api/v1/notice/reply/likeUnlike/${cmtId}/${rid}`, data, config) :
            await axios.put(`/api/v1/notice/comment/likeUnlike/${cmtId}`, data, config);

    } catch (error) {
        console.log(error.response.data.message)
    }
}
