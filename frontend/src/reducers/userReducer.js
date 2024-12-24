import { createReducer } from "@reduxjs/toolkit"
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
  CLEAR_MESSAGE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  NEW_COMMENT_SUCCESS,
  NEW_COMMENT_FAIL,
  NEW_COMMENT_RESET,
  NEW_COMMENT_REQUEST,
  UPDATE_DETAILS_SUCCESS,
  UPDATE_DETAILS_FAIL,
  UPDATE_DETAILS_REQUEST,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  PURCHASE_REQUEST,
  PURCHASE_SUCCESS,
  PURCHASE_FAIL,
  ACTIVE_PURCHASE_REQUEST,
  ACTIVE_PURCHASE_SUCCESS,
  ACTIVE_PURCHASE_FAIL,
  CLEAR_ACTIVE_PURCHASE,
} from '../constants/userConstants'

const handleUserSuccess = (state, action) => {
  return {
    ...state,
    loading: false,
    isAuthenticated: true,
    user: action.payload,
    error: null
  };
};

const handleUserFail = (state, action) => {
  return {
    ...state,
    loading: false,
    user: null,
    isAuthenticated: false,
    error: action.payload,
  }
}

const handleCommentRequest = (state) => {
  state.loading = true;
}

const handleCommentSuccess = () => {
  return {
    loading: false,
    success: true
  }
}

const handleCommentFail = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.payload
  }
}

const handleCommentReset = (state) => {
  return {
    ...state,
    success: false
  }
}

export const userReducer = createReducer({ user: {} }, (builder) => {
  builder
    .addCase(LOAD_USER_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(LOGIN_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(REGISTER_USER_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(LOGIN_SUCCESS, handleUserSuccess)
    .addCase(REGISTER_USER_SUCCESS, handleUserSuccess)
    .addCase(LOAD_USER_SUCCESS, handleUserSuccess)
    .addCase(LOGIN_FAIL, handleUserFail)
    .addCase(REGISTER_USER_FAIL, handleUserFail)
    .addCase(LOAD_USER_FAIL, handleUserFail)
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null;
    })
    .addCase(CLEAR_MESSAGE, (state) => {
      state.message = null;
    })
    .addCase(LOGOUT_SUCCESS, () => {
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        message: "Logout successfully"
      }
    })
    .addCase(LOGOUT_FAIL, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    })
    .addCase(UPDATE_DETAILS_REQUEST, (state) => {
      state.loading = true
    })
    .addCase(UPDATE_DETAILS_SUCCESS, (state, action) => {
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.updatedUser,
        error: null,
        message: action.payload.message
      }
    })
    .addCase(UPDATE_DETAILS_FAIL, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    })



});

export const newCommentReducer = createReducer({ comment: {} }, (builder) => {
  builder
    .addCase(NEW_COMMENT_REQUEST, handleCommentRequest)
    .addCase(NEW_COMMENT_SUCCESS, handleCommentSuccess)
    .addCase(NEW_COMMENT_FAIL, handleCommentFail)
    .addCase(NEW_COMMENT_RESET, handleCommentReset)
    .addCase(CLEAR_ERRORS, (state) => {
      return {
        ...state,
        error: null
      }
    })
})


export const passwordReducer = createReducer({}, (builder) => {
  builder
    .addCase(FORGOT_PASSWORD_REQUEST, (state, action) => {
      return {
        loading: true
      }
    })
    .addCase(RESET_PASSWORD_REQUEST, (state, action) => {
      return {
        loading: true
      }
    })
    .addCase(FORGOT_PASSWORD_SUCCESS, (state, action) => {
      return {
        loading: false,
        message: action.payload.message
      }
    })
    .addCase(RESET_PASSWORD_SUCCESS, (state, action) => {
      return {
        loading: false,
        success: action.payload.success
      }
    })
    .addCase(FORGOT_PASSWORD_FAIL, (state, action) => {
      return {
        loading: false,
        error: action.payload
      }
    })
    .addCase(RESET_PASSWORD_FAIL, (state, action) => {
      return {
        loading: false,
        error: action.payload
      }
    })
    .addCase(CLEAR_MESSAGE, (state) => {
      return {
        ...state,
        error: null
      }
    })
})

export const purchaseReducer = createReducer({purchases: []}, (builder) => {
  builder
    .addCase(PURCHASE_REQUEST, (state, action) => {
      return {
        loading: true
      }
    })
    .addCase(PURCHASE_SUCCESS, (state, action) => {
      return {
        loading: false,
        purchases: action.payload.purchases,
        totalPurchases: action.payload.totalPurchases
      }
    })
    .addCase(PURCHASE_FAIL, (state, action) => {
      return {
        loading: false,
        error: action.payload
      }
    })
    .addCase(CLEAR_MESSAGE, (state) => {
      return {
        ...state,
        error: null
      }
    })
})

export const activePurchaseReducer = createReducer({activePurchases: []}, (builder) => {
  builder
    .addCase(ACTIVE_PURCHASE_REQUEST, (state, action) => {
      return {
        loading: true
      }
    })
    .addCase(ACTIVE_PURCHASE_SUCCESS, (state, action) => {
      return {
        loading: false,
        activePurchases: action.payload.activePurchases,
        active: action.payload.success
      }
    })
    .addCase(CLEAR_ACTIVE_PURCHASE,(state, action) => {
      return{
        loading: false,
        activePurchases: [],
        active: false
      }
    })
    .addCase(ACTIVE_PURCHASE_FAIL, (state, action) => {
      return {
        loading: false,
        error: action.payload
      }
    })
    .addCase(CLEAR_MESSAGE, (state) => {
      return {
        ...state,
        error: null
      }
    })
})
