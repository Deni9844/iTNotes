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
    DELETE_USER_RESET,
    USER_DELETED,
    EDIT_USER_ROLE_REQUEST,
    EDIT_USER_ROLE_SUCCESS,
    EDIT_USER_ROLE_FAIL,
    EDIT_USER_ROLE_RESET,
    USER_ROLE_EDITED,
    NEW_SUBJECT_REQUEST,
    NEW_SUBJECT_SUCCESS,
    NEW_SUBJECT_FAIL,
    NEW_SUBJECT_RESET,

    EDIT_SUBJECT_REQUEST,
    EDIT_SUBJECT_SUCCESS,
    EDIT_SUBJECT_FAIL,
    EDIT_SUBJECT_RESET,
    DELETE_SUBJECT_REQUEST,
    DELETE_SUBJECT_SUCCESS,
    DELETE_SUBJECT_FAIL,
    DELETE_SUBJECT_RESET,
    CLEAR_ERROR,
    NEW_CHAPTER_REQUEST,
    NEW_CHAPTER_SUCCESS,
    NEW_CHAPTER_FAIL,
    NEW_CHAPTER_RESET,
    DELETE_CHAPTER_REQUEST,
    EDIT_CHAPTER_REQUEST,
    DELETE_CHAPTER_SUCCESS,
    EDIT_CHAPTER_SUCCESS,
    DELETE_CHAPTER_FAIL,
    EDIT_CHAPTER_FAIL,
    DELETE_CHAPTER_RESET,
    EDIT_CHAPTER_RESET,

    NEW_QUESTION_REQUEST,
    NEW_QUESTION_SUCCESS,
    NEW_QUESTION_FAIL,
    NEW_QUESTION_RESET,
    DELETE_QUESTION_REQUEST,
    EDIT_QUESTION_REQUEST,
    DELETE_QUESTION_SUCCESS,
    EDIT_QUESTION_SUCCESS,
    DELETE_QUESTION_FAIL,
    EDIT_QUESTION_FAIL,
    DELETE_QUESTION_RESET,
    EDIT_QUESTION_RESET,
    NEW_QUESTION_BANK_REQUEST,
    NEW_QUESTION_BANK_SUCCESS,
    NEW_QUESTION_BANK_FAIL,
    NEW_QUESTION_BANK_RESET,
    EDIT_QUESTION_BANK_SUCCESS,
    DELETE_QUESTION_BANK_SUCCESS,
    EDIT_QUESTION_BANK_RESET,
    DELETE_QUESTION_BANK_RESET,
    DELETE_QUESTION_BANK_REQUEST,
    EDIT_QUESTION_BANK_REQUEST,
    DELETE_QUESTION_BANK_FAIL,
    EDIT_QUESTION_BANK_FAIL,
    NEW_BOOK_REQUEST,
    NEW_BOOK_SUCCESS,
    NEW_BOOK_FAIL,
    NEW_BOOK_RESET,
    DELETE_BOOK_REQUEST,
    EDIT_BOOK_REQUEST,
    DELETE_BOOK_SUCCESS,
    EDIT_BOOK_SUCCESS,
    DELETE_BOOK_FAIL,
    EDIT_BOOK_FAIL,
    DELETE_BOOK_RESET,
    EDIT_BOOK_RESET,
    NEW_LAB_REQUEST,
    NEW_LAB_SUCCESS,
    NEW_LAB_FAIL,
    NEW_LAB_RESET,
    DELETE_LAB_REQUEST,
    EDIT_LAB_REQUEST,
    DELETE_LAB_SUCCESS,
    EDIT_LAB_SUCCESS,
    DELETE_LAB_FAIL,
    EDIT_LAB_FAIL,
    DELETE_LAB_RESET,
    EDIT_LAB_RESET,
    NEW_VIVA_REQUEST,
    NEW_VIVA_SUCCESS,
    NEW_VIVA_FAIL,
    NEW_VIVA_RESET,
    DELETE_VIVA_REQUEST,
    EDIT_VIVA_REQUEST,
    DELETE_VIVA_SUCCESS,
    EDIT_VIVA_SUCCESS,
    DELETE_VIVA_FAIL,
    EDIT_VIVA_FAIL,
    DELETE_VIVA_RESET,
    EDIT_VIVA_RESET,
    NEW_NOTICE_REQUEST,
    NEW_NOTICE_SUCCESS,
    NEW_NOTICE_FAIL,
    NEW_NOTICE_RESET,
    DELETE_NOTICE_REQUEST,
    EDIT_NOTICE_REQUEST,
    DELETE_NOTICE_SUCCESS,
    EDIT_NOTICE_SUCCESS,
    DELETE_NOTICE_FAIL,
    EDIT_NOTICE_FAIL,
    DELETE_NOTICE_RESET,
    EDIT_NOTICE_RESET,
    NEW_ARTICLE_REQUEST,
    NEW_ARTICLE_SUCCESS,
    NEW_ARTICLE_FAIL,
    NEW_ARTICLE_RESET,
    DELETE_ARTICLE_REQUEST,
    EDIT_ARTICLE_REQUEST,
    DELETE_ARTICLE_SUCCESS,
    EDIT_ARTICLE_SUCCESS,
    DELETE_ARTICLE_FAIL,
    EDIT_ARTICLE_FAIL,
    DELETE_ARTICLE_RESET,
    EDIT_ARTICLE_RESET,
    NEW_QUERY_REQUEST,
    NEW_QUERY_SUCCESS,
    NEW_QUERY_FAIL,
    NEW_QUERY_RESET,
    DELETE_QUERY_REQUEST,
    REPLY_QUERY_REQUEST,
    DELETE_QUERY_SUCCESS,
    REPLY_QUERY_SUCCESS,
    DELETE_QUERY_FAIL,
    REPLY_QUERY_FAIL,
    DELETE_QUERY_RESET,
    REPLY_QUERY_RESET,
    QUERY_REPLIED,
    QUERY_DELETED,
    NEW_ASSEST_REQUEST,
    NEW_ASSEST_SUCCESS,
    NEW_ASSEST_FAIL,
    NEW_ASSEST_RESET,
    DELETE_ASSEST_REQUEST,
    REPLY_ASSEST_REQUEST,
    DELETE_ASSEST_SUCCESS,
    REPLY_ASSEST_SUCCESS,
    DELETE_ASSEST_FAIL,
    REPLY_ASSEST_FAIL,
    DELETE_ASSEST_RESET,
    REPLY_ASSEST_RESET,
    ASSEST_DELETED,
    ASSEST_REPLIED
}
    from '../constants/adminConstants'

import { createReducer } from '@reduxjs/toolkit'
import { CANCEL_PURCHASE_FAIL, CANCEL_PURCHASE_REQUEST, CANCEL_PURCHASE_RESET, CANCEL_PURCHASE_SUCCESS, DELETE_PURCHASE_FAIL, DELETE_PURCHASE_REQUEST, DELETE_PURCHASE_RESET, DELETE_PURCHASE_SUCCESS } from '../constants/userConstants'

const requestHandler = () => {
    return {
        loading: true
    }
}

const updateSuccessHanlder = (state, action) => {
    switch (action.type) {
        case EDIT_USER_ROLE_SUCCESS:
            return {
                loading: false,
                isUpdated: action.payload.success
            }
        case EDIT_SUBJECT_SUCCESS:
            return {
                loading: false,
                isSubUpdated: action.payload.success
            }
        case EDIT_CHAPTER_SUCCESS:
            return {
                loading: false,
                isChUpdated: action.payload.success
            }
        case EDIT_QUESTION_SUCCESS:
            return {
                loading: false,
                isQtnUpdated: action.payload.success
            }
        case EDIT_QUESTION_BANK_SUCCESS:
            return {
                loading: false,
                isQtnBankUpdated: action.payload.success
            }
        case EDIT_BOOK_SUCCESS:
            return {
                loading: false,
                isBookUpdated: action.payload.success
            }
        case EDIT_LAB_SUCCESS:
            return {
                loading: false,
                isLabUpdated: action.payload.success
            }
        case EDIT_VIVA_SUCCESS:
            return {
                loading: false,
                isVivaUpdated: action.payload.success
            }
        case EDIT_NOTICE_SUCCESS:
            return {
                loading: false,
                isNoticeUpdated: action.payload.success
            }
        case EDIT_ARTICLE_SUCCESS:
            return {
                loading: false,
                isArticleUpdated: action.payload.success
            }
        case REPLY_QUERY_SUCCESS:
            return {
                loading: false,
                isQueryReplied: action.payload.success
            }
        case REPLY_ASSEST_SUCCESS:
            return {
                loading: false,
                isAssestReplied: action.payload.success
            }
        default:
            return state
    }
}

const deleteSuccessHanlder = (state, action) => {
    switch (action.type) {
        case DELETE_USER_SUCCESS:
            return {
                loading: false,
                isDeleted: action.payload.success
            }
        case DELETE_SUBJECT_SUCCESS:
            return {
                loading: false,
                isSubDeleted: action.payload.success
            }
        case DELETE_CHAPTER_SUCCESS:
            return {
                loading: false,
                isChDeleted: action.payload.success
            }
        case DELETE_QUESTION_SUCCESS:
            return {
                loading: false,
                isQtnDeleted: action.payload.success
            }
        case DELETE_QUESTION_BANK_SUCCESS:
            return {
                loading: false,
                isQtnBankDeleted: action.payload.success
            }
        case DELETE_BOOK_SUCCESS:
            return {
                loading: false,
                isBookDeleted: action.payload.success
            }
        case DELETE_LAB_SUCCESS:
            return {
                loading: false,
                isLabDeleted: action.payload.success
            }
        case DELETE_VIVA_SUCCESS:
            return {
                loading: false,
                isVivaDeleted: action.payload.success
            }
        case DELETE_NOTICE_SUCCESS:
            return {
                loading: false,
                isNoticeDeleted: action.payload.success
            }
        case DELETE_ARTICLE_SUCCESS:
            return {
                loading: false,
                isArticleDeleted: action.payload.success
            }
        case DELETE_QUERY_SUCCESS:
            return {
                loading: false,
                isQueryDeleted: action.payload.success
            }
        case DELETE_ASSEST_SUCCESS:
            return {
                loading: false,
                isAssestDeleted: action.payload.success
            }
        case DELETE_PURCHASE_SUCCESS:
            return {
                loading: false,
                isPurchasedItemDeleted: action.payload.success
            }
        default:
            return state
    }

}

const addSuccessHanlder = (state, action) => {
    switch (action.type) {
        case NEW_SUBJECT_SUCCESS:
            return {
                loading: false,
                isSubAdded: action.payload.success
            }
        case NEW_CHAPTER_SUCCESS:
            return {
                loading: false,
                isChAdded: action.payload.success
            }
        case NEW_QUESTION_SUCCESS:
            return {
                loading: false,
                isQtnAdded: action.payload.success
            }
        case NEW_QUESTION_BANK_SUCCESS:
            return {
                loading: false,
                isQtnBankAdded: action.payload.success
            }
        case NEW_BOOK_SUCCESS:
            return {
                loading: false,
                isBookAdded: action.payload.success
            }
        case NEW_LAB_SUCCESS:
            return {
                loading: false,
                isLabAdded: action.payload.success
            }
        case NEW_VIVA_SUCCESS:
            return {
                loading: false,
                isVivaAdded: action.payload.success
            }
        case NEW_NOTICE_SUCCESS:
            return {
                loading: false,
                isNoticeAdded: action.payload.success
            }
        case NEW_ARTICLE_SUCCESS:
            return {
                loading: false,
                isArticleAdded: action.payload.success
            }
        case NEW_QUERY_SUCCESS:
            return {
                loading: false,
                isQueryAdded: action.payload.success
            }
        case NEW_ASSEST_SUCCESS:
            return {
                loading: false,
                isAssestAdded: action.payload.success
            }
        default:
            return state
    }

}

const updateResetHanlder = (state, action) => {
    switch (action.type) {
        case EDIT_USER_ROLE_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case EDIT_SUBJECT_RESET:
            return {
                ...state,
                isSubUpdated: false
            }
        case EDIT_CHAPTER_RESET:
            return {
                ...state,
                isChUpdated: false
            }
        case EDIT_QUESTION_RESET:
            return {
                ...state,
                isQtnUpdated: false
            }
        case EDIT_QUESTION_BANK_RESET:
            return {
                ...state,
                isQtnBankUpdated: false
            }
        case EDIT_BOOK_RESET:
            return {
                ...state,
                isBookUpdated: false
            }
        case EDIT_LAB_RESET:
            return {
                ...state,
                isLabUpdated: false
            }
        case EDIT_VIVA_RESET:
            return {
                ...state,
                isVivaUpdated: false
            }
        case EDIT_NOTICE_RESET:
            return {
                ...state,
                isNoticeUpdated: false
            }
        case EDIT_ARTICLE_RESET:
            return {
                ...state,
                isArticleUpdated: false
            }
        case REPLY_QUERY_RESET:
            return {
                ...state,
                isQueryReplied: false
            }
        case REPLY_ASSEST_RESET:
            return {
                ...state,
                isAssestReplied: false
            }
        default:
            return state
    }
}

const deleteResetHanlder = (state, action) => {
    switch (action.type) {
        case DELETE_USER_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case DELETE_SUBJECT_RESET:
            return {
                ...state,
                isSubDeleted: false
            }
        case DELETE_CHAPTER_RESET:
            return {
                ...state,
                isChDeleted: false
            }
        case DELETE_QUESTION_RESET:
            return {
                ...state,
                isQtnDeleted: false
            }
        case DELETE_QUESTION_BANK_RESET:
            return {
                ...state,
                isQtnBankDeleted: false
            }
        case DELETE_BOOK_RESET:
            return {
                ...state,
                isBookDeleted: false
            }
        case DELETE_LAB_RESET:
            return {
                ...state,
                isLabDeleted: false
            }
        case DELETE_VIVA_RESET:
            return {
                ...state,
                isVivaDeleted: false
            }
        case DELETE_NOTICE_RESET:
            return {
                ...state,
                isNoticeDeleted: false
            }
        case DELETE_ARTICLE_RESET:
            return {
                ...state,
                isArticleDeleted: false
            }
        case DELETE_QUERY_RESET:
            return {
                ...state,
                isQueryDeleted: false
            }
        case DELETE_ASSEST_RESET:
            return {
                ...state,
                isAssestDeleted: false
            }
        case DELETE_PURCHASE_RESET:
            return {
                ...state,
                isPurchasedItemDeleted: false
            }
        default:
            return state
    }
}

const addResetHanlder = (state, action) => {
    switch (action.type) {
        case NEW_SUBJECT_RESET:
            return {
                ...state,
                isSubAdded: false
            }
        case NEW_CHAPTER_RESET:
            return {
                ...state,
                isChAdded: false
            }
        case NEW_QUESTION_RESET:
            return {
                ...state,
                isQtnAdded: false
            }
        case NEW_QUESTION_BANK_RESET:
            return {
                ...state,
                isQtnBankAdded: false
            }
        case NEW_BOOK_RESET:
            return {
                ...state,
                isBookAdded: false
            }
        case NEW_LAB_RESET:
            return {
                ...state,
                isLabAdded: false
            }
        case NEW_VIVA_RESET:
            return {
                ...state,
                isVivaAdded: false
            }
        case NEW_NOTICE_RESET:
            return {
                ...state,
                isNoticeAdded: false
            }
        case NEW_ARTICLE_RESET:
            return {
                ...state,
                isArticleAdded: false
            }
        case NEW_QUERY_RESET:
            return {
                ...state,
                isQueryAdded: false
            }
        case NEW_ASSEST_RESET:
            return {
                ...state,
                isAssestAdded: false
            }
        default:
            return state
    }

}

const errorHandler = (state, action) => {
    return {
        loading: false,
        error: action.payload,
    }

}

const clearErrorHanlder = (state) => {
    return {
        ...state,
        error: null
    }
}

export const allUsersReducer = createReducer({ users: [] }, (builder) => {
    builder
        .addCase(ALL_USERS_REQUEST, requestHandler)
        .addCase(ALL_USERS_SUCCESS, (state, action) => {
            return {
                loading: false,
                users: action.payload.users,
                totalActivers: action.payload.totalActivers,
                resultPerPage: action.payload.resultPerPage,
                totalAdmins: action.payload.totalAdmins
            }
        })
        .addCase(ALL_USERS_FAIL, errorHandler)
        .addCase(USER_DELETED, (state, action) => {
            return {
                ...state,
                totalActivers: state.totalActivers - 1,
                totalAdmins: action.payload.role === 'admin' ? state.totalAdmins - 1 : state.totalAdmins,
                users: state.users.filter(user => user._id !== action.payload._id)
            }

        })
        .addCase(USER_ROLE_EDITED, (state, action) => {
            return {
                ...state,
                totalAdmins: action.payload.role.role === 'admin' ? state.totalAdmins + 1 : state.totalAdmins - 1,
                users: state.users.map(user =>
                    user._id === action.payload.user._id ? { ...user, role: action.payload.role.role } : user
                )
            }

        })
        .addCase(CLEAR_ERROR, clearErrorHanlder)
})

export const allQueriesReducer = createReducer({ queries: [] }, (builder) => {
    builder
        .addCase(ALL_QUERIES_REQUEST, requestHandler)
        .addCase(ALL_QUERIES_SUCCESS, (state, action) => {
            return {
                loading: false,
                queries: action.payload.queries,
                totalQueries: action.payload.totalQueries
            }
        })
        .addCase(QUERY_REPLIED, (state, action) => {
            const { id } = action.payload
            return {
                ...state,
                queries: state.queries.map((q) => q._id === id ?
                    {
                        ...q,
                        status: "replied"
                    } : q
                ),
            }
        })
        .addCase(QUERY_DELETED, (state, action) => {
            const { id } = action.payload
            return {
                ...state,
                totalQueries: state.totalQueries - 1,
                queries: state.queries.filter((q) => q._id !== id),
            }
        })
        .addCase(ALL_QUERIES_FAIL, errorHandler)
        .addCase(CLEAR_ERROR, clearErrorHanlder)
})

export const allAssetsReducer = createReducer({ assets: [] }, (builder) => {
    builder
        .addCase(ALL_ASSETS_REQUEST, requestHandler)
        .addCase(ALL_ASSETS_SUCCESS, (state, action) => {
            return {
                loading: false,
                assets: action.payload.assets,
                totalAssets: action.payload.totalAssets
            }
        })
        .addCase(ASSEST_REPLIED, (state, action) => {
            const { id } = action.payload
            return {
                ...state,
                assets: state.assets.map((q) => q._id === id ?
                    {
                        ...q,
                        status: "replied"
                    } : q
                ),
            }
        })
        .addCase(ASSEST_DELETED, (state, action) => {
            const { id } = action.payload
            return {
                ...state,
                totalAssets: state.totalAssets - 1,
                assets: state.assets.filter((q) => q._id !== id),
            }
        })
        .addCase(ALL_ASSETS_FAIL, errorHandler)
        .addCase(CLEAR_ERROR, clearErrorHanlder)
})


export const profileReducer = createReducer({}, (builder) => {
    builder
        .addCase(DELETE_USER_REQUEST, requestHandler)
        .addCase(DELETE_SUBJECT_REQUEST, requestHandler)
        .addCase(DELETE_CHAPTER_REQUEST, requestHandler)
        .addCase(DELETE_QUESTION_REQUEST, requestHandler)
        .addCase(DELETE_QUESTION_BANK_REQUEST, requestHandler)
        .addCase(DELETE_BOOK_REQUEST, requestHandler)
        .addCase(DELETE_LAB_REQUEST, requestHandler)
        .addCase(DELETE_VIVA_REQUEST, requestHandler)
        .addCase(DELETE_NOTICE_REQUEST, requestHandler)
        .addCase(DELETE_ARTICLE_REQUEST, requestHandler)
        .addCase(DELETE_QUERY_REQUEST, requestHandler)
        .addCase(DELETE_ASSEST_REQUEST, requestHandler)
        .addCase(CANCEL_PURCHASE_REQUEST, requestHandler)
        .addCase(DELETE_PURCHASE_REQUEST, requestHandler)

        .addCase(EDIT_USER_ROLE_REQUEST, requestHandler)
        .addCase(EDIT_SUBJECT_REQUEST, requestHandler)
        .addCase(EDIT_CHAPTER_REQUEST, requestHandler)
        .addCase(EDIT_QUESTION_REQUEST, requestHandler)
        .addCase(EDIT_QUESTION_BANK_REQUEST, requestHandler)
        .addCase(EDIT_BOOK_REQUEST, requestHandler)
        .addCase(EDIT_LAB_REQUEST, requestHandler)
        .addCase(EDIT_VIVA_REQUEST, requestHandler)
        .addCase(EDIT_NOTICE_REQUEST, requestHandler)
        .addCase(EDIT_ARTICLE_REQUEST, requestHandler)
        .addCase(REPLY_QUERY_REQUEST, requestHandler)
        .addCase(REPLY_ASSEST_REQUEST, requestHandler)

        .addCase(DELETE_USER_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_SUBJECT_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_CHAPTER_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_QUESTION_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_QUESTION_BANK_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_BOOK_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_LAB_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_VIVA_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_NOTICE_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_ARTICLE_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_QUERY_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_ASSEST_SUCCESS, deleteSuccessHanlder)
        .addCase(DELETE_PURCHASE_SUCCESS, deleteSuccessHanlder)
        .addCase(CANCEL_PURCHASE_SUCCESS, (state, action) => {
            return {
                loading: false,
                isPurchasedItemCancelled: action.payload.success
            }
        })

        .addCase(EDIT_USER_ROLE_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_SUBJECT_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_CHAPTER_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_QUESTION_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_QUESTION_BANK_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_BOOK_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_LAB_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_VIVA_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_NOTICE_SUCCESS, updateSuccessHanlder)
        .addCase(EDIT_ARTICLE_SUCCESS, updateSuccessHanlder)
        .addCase(REPLY_QUERY_SUCCESS, updateSuccessHanlder)
        .addCase(REPLY_ASSEST_SUCCESS, updateSuccessHanlder)

        .addCase(DELETE_USER_FAIL, errorHandler)
        .addCase(DELETE_SUBJECT_FAIL, errorHandler)
        .addCase(DELETE_CHAPTER_FAIL, errorHandler)
        .addCase(DELETE_QUESTION_FAIL, errorHandler)
        .addCase(DELETE_QUESTION_BANK_FAIL, errorHandler)
        .addCase(DELETE_BOOK_FAIL, errorHandler)
        .addCase(DELETE_LAB_FAIL, errorHandler)
        .addCase(DELETE_VIVA_FAIL, errorHandler)
        .addCase(DELETE_NOTICE_FAIL, errorHandler)
        .addCase(DELETE_ARTICLE_FAIL, errorHandler)
        .addCase(DELETE_QUERY_FAIL, errorHandler)
        .addCase(DELETE_ASSEST_FAIL, errorHandler)
        .addCase(DELETE_PURCHASE_FAIL, errorHandler)
        .addCase(CANCEL_PURCHASE_FAIL, errorHandler)

        .addCase(EDIT_USER_ROLE_FAIL, errorHandler)
        .addCase(EDIT_SUBJECT_FAIL, errorHandler)
        .addCase(EDIT_CHAPTER_FAIL, errorHandler)
        .addCase(EDIT_QUESTION_FAIL, errorHandler)
        .addCase(EDIT_QUESTION_BANK_FAIL, errorHandler)
        .addCase(EDIT_BOOK_FAIL, errorHandler)
        .addCase(EDIT_LAB_FAIL, errorHandler)
        .addCase(EDIT_VIVA_FAIL, errorHandler)
        .addCase(EDIT_NOTICE_FAIL, errorHandler)
        .addCase(EDIT_ARTICLE_FAIL, errorHandler)
        .addCase(REPLY_QUERY_FAIL, errorHandler)
        .addCase(REPLY_ASSEST_FAIL, errorHandler)

        .addCase(DELETE_USER_RESET, deleteResetHanlder)
        .addCase(DELETE_SUBJECT_RESET, deleteResetHanlder)
        .addCase(DELETE_CHAPTER_RESET, deleteResetHanlder)
        .addCase(DELETE_QUESTION_RESET, deleteResetHanlder)
        .addCase(DELETE_QUESTION_BANK_RESET, deleteResetHanlder)
        .addCase(DELETE_BOOK_RESET, deleteResetHanlder)
        .addCase(DELETE_LAB_RESET, deleteResetHanlder)
        .addCase(DELETE_VIVA_RESET, deleteResetHanlder)
        .addCase(DELETE_NOTICE_RESET, deleteResetHanlder)
        .addCase(DELETE_ARTICLE_RESET, deleteResetHanlder)
        .addCase(DELETE_QUERY_RESET, deleteResetHanlder)
        .addCase(DELETE_ASSEST_RESET, deleteResetHanlder)
        .addCase(DELETE_PURCHASE_RESET, deleteResetHanlder)
        .addCase(CANCEL_PURCHASE_RESET, (state, action) => {
            return {
                ...state,
                isPurchasedItemCancelled: false
            }
        })

        .addCase(EDIT_USER_ROLE_RESET, updateResetHanlder)
        .addCase(EDIT_SUBJECT_RESET, updateResetHanlder)
        .addCase(EDIT_CHAPTER_RESET, updateResetHanlder)
        .addCase(EDIT_QUESTION_RESET, updateResetHanlder)
        .addCase(EDIT_QUESTION_BANK_RESET, updateResetHanlder)
        .addCase(EDIT_BOOK_RESET, updateResetHanlder)
        .addCase(EDIT_LAB_RESET, updateResetHanlder)
        .addCase(EDIT_VIVA_RESET, updateResetHanlder)
        .addCase(EDIT_NOTICE_RESET, updateResetHanlder)
        .addCase(EDIT_ARTICLE_RESET, updateResetHanlder)
        .addCase(REPLY_QUERY_RESET, updateResetHanlder)
        .addCase(REPLY_ASSEST_RESET, updateResetHanlder)

        .addCase(CLEAR_ERROR, clearErrorHanlder)
})

export const newReducer = createReducer({}, (builder) => {
    builder
        .addCase(NEW_SUBJECT_REQUEST, requestHandler)
        .addCase(NEW_SUBJECT_SUCCESS, addSuccessHanlder)
        .addCase(NEW_SUBJECT_FAIL, errorHandler)
        .addCase(NEW_SUBJECT_RESET, addResetHanlder)

        .addCase(NEW_CHAPTER_REQUEST, requestHandler)
        .addCase(NEW_CHAPTER_SUCCESS, addSuccessHanlder)
        .addCase(NEW_CHAPTER_FAIL, errorHandler)
        .addCase(NEW_CHAPTER_RESET, addResetHanlder)

        .addCase(NEW_QUESTION_REQUEST, requestHandler)
        .addCase(NEW_QUESTION_SUCCESS, addSuccessHanlder)
        .addCase(NEW_QUESTION_FAIL, errorHandler)
        .addCase(NEW_QUESTION_RESET, addResetHanlder)

        .addCase(NEW_QUESTION_BANK_REQUEST, requestHandler)
        .addCase(NEW_QUESTION_BANK_SUCCESS, addSuccessHanlder)
        .addCase(NEW_QUESTION_BANK_FAIL, errorHandler)
        .addCase(NEW_QUESTION_BANK_RESET, addResetHanlder)

        .addCase(NEW_BOOK_REQUEST, requestHandler)
        .addCase(NEW_BOOK_SUCCESS, addSuccessHanlder)
        .addCase(NEW_BOOK_FAIL, errorHandler)
        .addCase(NEW_BOOK_RESET, addResetHanlder)

        .addCase(NEW_LAB_REQUEST, requestHandler)
        .addCase(NEW_LAB_SUCCESS, addSuccessHanlder)
        .addCase(NEW_LAB_FAIL, errorHandler)
        .addCase(NEW_LAB_RESET, addResetHanlder)

        .addCase(NEW_VIVA_REQUEST, requestHandler)
        .addCase(NEW_VIVA_SUCCESS, addSuccessHanlder)
        .addCase(NEW_VIVA_FAIL, errorHandler)
        .addCase(NEW_VIVA_RESET, addResetHanlder)

        .addCase(NEW_NOTICE_REQUEST, requestHandler)
        .addCase(NEW_NOTICE_SUCCESS, addSuccessHanlder)
        .addCase(NEW_NOTICE_FAIL, errorHandler)
        .addCase(NEW_NOTICE_RESET, addResetHanlder)

        .addCase(NEW_ARTICLE_REQUEST, requestHandler)
        .addCase(NEW_ARTICLE_SUCCESS, addSuccessHanlder)
        .addCase(NEW_ARTICLE_FAIL, errorHandler)
        .addCase(NEW_ARTICLE_RESET, addResetHanlder)

        .addCase(NEW_QUERY_REQUEST, requestHandler)
        .addCase(NEW_QUERY_SUCCESS, addSuccessHanlder)
        .addCase(NEW_QUERY_FAIL, errorHandler)
        .addCase(NEW_QUERY_RESET, addResetHanlder)

        .addCase(NEW_ASSEST_REQUEST, requestHandler)
        .addCase(NEW_ASSEST_SUCCESS, addSuccessHanlder)
        .addCase(NEW_ASSEST_FAIL, errorHandler)
        .addCase(NEW_ASSEST_RESET, addResetHanlder)

        .addCase(CLEAR_ERROR, clearErrorHanlder)
}) 