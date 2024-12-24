import { ARTICLE_DELETED, ARTICLE_EDITED } from '../constants/adminConstants'
import {
    ALL_ARTICLES_REQUEST,
    ALL_ARTICLES_SUCCESS,
    ALL_ARTICLES_FAIL,
    CLEAR_ERRORS,
    ARTICLE_REQUEST,
    ARTICLE_SUCCESS,
    ARTICLE_FAIL,
}
    from '../constants/articleConstants' 
    import {createReducer } from "@reduxjs/toolkit"

    export const articlesReducer = createReducer({ articles: [] }, (builder) => {
        builder
          .addCase(ALL_ARTICLES_REQUEST, (state) => {
            state.loading = true
          })
          .addCase(ALL_ARTICLES_SUCCESS, (state,action)=>{
            state.loading = false;
            state.articles = action.payload.articles;
            state.totalArticles = action.payload.totalArticles;
            state.resultPerPage = action.payload.resultPerPage
          })
          .addCase(ALL_ARTICLES_FAIL, (state,action)=>{
            state.loading = false;
            state.error = action.payload;         
          })
          .addCase(ARTICLE_DELETED, (state, action) => {
            const { id} = action.payload
            return {
              ...state,
              totalArticles:state.totalArticles-1,
              articles: state.articles.filter(article => article._id !== id)
            }
          })
          .addCase(ARTICLE_EDITED, (state, action) => {
            const { id, editedArticle,cover } = action.payload;
            console.log("ccc :",cover)
            return {
              ...state,
              articles: state.articles.map(article => article._id === id ? ({
                ...article,
                _id:editedArticle._id,
                title:editedArticle.title,
                cover:cover,
                author:editedArticle.author,
                file:editedArticle.file
              }):article)
            };
          })
          .addCase(CLEAR_ERRORS, (state)=>{
            state.error  = null
          })
      })

      export const articleReducer = createReducer({ article: {} }, (builder) => {
        builder
          .addCase(ARTICLE_REQUEST, (state) => {
            state.loading = true
          })
          .addCase(ARTICLE_SUCCESS, (state,action)=>{
            state.loading = false;
            state.article = action.payload.article;
          })
          .addCase(ARTICLE_FAIL, (state,action)=>{
            state.loading = false;
            state.error = action.payload;         
          })
          .addCase(CLEAR_ERRORS, (state)=>{
            state.error  = null
          })
      })