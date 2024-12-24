import { NOTICE_DELETED, NOTICE_EDITED } from '../constants/adminConstants'
import {
ALL_NOTICES_REQUEST,
ALL_NOTICES_SUCCESS,
ALL_NOTICES_FAIL,
NOTICE_REQUEST,
NOTICE_SUCCESS,
NOTICE_FAIL,
CLEAR_ERRORS
} from '../constants/noticeConstant'
import {createReducer } from "@reduxjs/toolkit"

export const noticesReducer = createReducer({ notices: [] }, (builder) => {
    builder
      .addCase(ALL_NOTICES_REQUEST, (state) => {
        state.loading = true
      })
      .addCase(ALL_NOTICES_SUCCESS, (state,action)=>{
        state.loading = false;
        state.notices = action.payload.notices;
        state.totalNotices = action.payload.totalNotices;
        state.resultPerPage = action.payload.resultPerPage
      })
      .addCase(ALL_NOTICES_FAIL, (state,action)=>{
        state.loading = false;
        state.error = action.payload;
        
      })
      .addCase(CLEAR_ERRORS, (state)=>{
        state.error  = null
      })
      .addCase(NOTICE_DELETED, (state, action) => {
        const { id} = action.payload
        return {
          ...state,
          totalNotices:state.totalNotices-1,
          notices: state.notices.filter(notice => notice._id !== id)
        }
      })
      .addCase(NOTICE_EDITED, (state, action) => {
        const { id, editedNotice } = action.payload;
        return {
          ...state,
          notices: state.notices.map(notice => notice._id === id ? ({
            ...notice,
            _id:editedNotice._id,
            title:editedNotice.title,
            category:editedNotice.category,
            provider:editedNotice.provider,
            file:editedNotice.file
          }):notice)
        };
      })
  })

  
export const noticeReducer = createReducer({ notice: {} }, (builder) => {
  builder
    .addCase(NOTICE_REQUEST, (state) => {
      state.loading = true
    })
    .addCase(NOTICE_SUCCESS, (state,action)=>{
      state.loading = false;
      state.notice = action.payload.notice;
    })
    .addCase(NOTICE_FAIL, (state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state)=>{
      state.error  = null
    })
})
