import axios from 'axios'
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_MESSAGE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    NEW_COMMENT_SUCCESS,
    NEW_COMMENT_FAIL,
    NEW_COMMENT_REQUEST,
    UPDATE_DETAILS_REQUEST,
    UPDATE_DETAILS_SUCCESS,
    UPDATE_DETAILS_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    PURCHASE_REQUEST,
    PURCHASE_SUCCESS,
    PURCHASE_FAIL,
    CANCEL_PURCHASE_REQUEST,
    CANCEL_PURCHASE_SUCCESS,
    CANCEL_PURCHASE_FAIL,
    DELETE_PURCHASE_REQUEST,
    DELETE_PURCHASE_SUCCESS,
    DELETE_PURCHASE_FAIL,
    ACTIVE_PURCHASE_REQUEST,
    ACTIVE_PURCHASE_SUCCESS,
    ACTIVE_PURCHASE_FAIL
} from '../constants/userConstants'

 // Login
 export const login = (credentialData) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })

        const config  = { headers : {"Content-Type" : "application/json" } };

        const { data } = await axios.post(
            `/api/v1/login`,
            credentialData,
            config
        );

        dispatch({
            type : LOGIN_SUCCESS,
            payload : data.user
        })
        
    } catch (error) {
        dispatch({
            type : LOGIN_FAIL,
            payload : error.response.data.message
        }) 
    }
}

//Register

export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })

        const config  = { headers : {"Content-Type" : "multipart/form-data" } };

        const { data } = await axios.post(
            `/api/v1/register`,
            userData,
            config
        );

        dispatch({
            type : REGISTER_USER_SUCCESS,
            payload : data.user
        })
        
    } catch (error) {
        dispatch({
            type : REGISTER_USER_FAIL,
            payload : error.response.data.message
        }) 
    }
}

  //Load user 
  export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST})

        const { data } = await axios.get(`/api/v1/me`);

        dispatch({
            type : LOAD_USER_SUCCESS,
            payload : data.user
        })
        
    } catch (error) {
        dispatch({
            type : LOAD_USER_FAIL,
            payload : error.response.data.message
        }) 
    }
}

  //Log out
  export const logOut = () => async (dispatch) => {
    try {

        const { data } = await axios.get(`/api/v1/logout`);
        dispatch({
            type : LOGOUT_SUCCESS,
            payload : data.message
        })
        
    } catch (error) {
        dispatch({
            type : LOGOUT_FAIL,
            payload : error.response.data.message
        }) 
    }
}


  //Add a new comment
  export const addComment = (userData) => async (dispatch) => {
    try {
        dispatch({
            type : NEW_COMMENT_REQUEST,
        })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.put(`/api/v1/comment/chapter`,userData,config);
    
        dispatch({
            type : NEW_COMMENT_SUCCESS,
            payload : data.success
        })
        
    } catch (error) {
        dispatch({
            type : NEW_COMMENT_FAIL,
            payload : error.response.data.message
        }) 
    }
}

 //Add a reply to comment
 export const addReply = (userData,cmtId) => async (dispatch) => {
    try {
        dispatch({
            type : NEW_COMMENT_REQUEST,
        })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.put(`/api/v1/comment/reply/${cmtId}`,userData,config);
    
        dispatch({
            type : NEW_COMMENT_SUCCESS,
            payload : data.success
        })
        
    } catch (error) {
        dispatch({
            type : NEW_COMMENT_FAIL,
            payload : error.response.data.message
        }) 
    }
}
 //Add Like or unlike 
 export const likeUnlike = (data,cmtId,rid) => async () => {
    try {
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
     
           rid!=null? await axios.put(`/api/v1/comment/likeUnlike/${cmtId}/${rid}`,data,config):
                                        await axios.put(`/api/v1/comment/likeUnlike/${cmtId}`,data,config);
             
    } catch (error) {
        console.log(error.response.responseData.message)  
    }
}

 //Update user details
 export const updateDetails = (formData) => async (dispatch) => {
    try {
        dispatch({
            type : UPDATE_DETAILS_REQUEST,
        })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.post(`/api/v1/update/account`,formData,config);
    
        dispatch({
            type : UPDATE_DETAILS_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type : UPDATE_DETAILS_FAIL,
            payload : error.response.data.message
        }) 
    }
}

  //Forgot password
  export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch({
            type : FORGOT_PASSWORD_REQUEST,
        })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.post(`/api/v1/password/forgot`,formData,config);
    
        dispatch({
            type : FORGOT_PASSWORD_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type :  FORGOT_PASSWORD_FAIL,
            payload : error.response.data.message
        }) 
    }
}

 //Forgot password
 export const resetPassword = (token,formData) => async (dispatch) => {
    try {
        dispatch({
            type : RESET_PASSWORD_REQUEST
        })

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

        const { data } = await axios.put(`/api/v1/password/reset/${token}`,formData,config);
    
        dispatch({
            type : RESET_PASSWORD_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type : RESET_PASSWORD_FAIL,
            payload : error.response.data.message
        }) 
    }
}


  //Load user 
  export const getAllPurchases = (page) => async (dispatch) => {
    try {
        dispatch({ type: PURCHASE_REQUEST})

        const { data } = await axios.get(`/api/v1/purchases?page=${page}`);

        dispatch({
            type : PURCHASE_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type : PURCHASE_FAIL,
            payload : error.response.data.message
        }) 
    }
}

//cancel the purchased item
export const cancelPurchasedItem = (id) => async (dispatch) => {
    try {
        dispatch({ type: CANCEL_PURCHASE_REQUEST})

        const { data } = await axios.post(`/api/v1/cancel-payment`,{ id },{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        dispatch({
            type : CANCEL_PURCHASE_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type : CANCEL_PURCHASE_FAIL,
            payload : error.response.data.message
        }) 
    }
}

//delete the purchased item
export const deletePurchasedItem = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PURCHASE_REQUEST})

        const { data } = await axios.delete(`/api/v1/purchase/${id}`);

        dispatch({
            type : DELETE_PURCHASE_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type : DELETE_PURCHASE_FAIL,
            payload : error.response.data.message
        }) 
    }
}

//get All active purchased item
export const getAtivePurchasedItem = () => async (dispatch) => {
    try {
        dispatch({ type: ACTIVE_PURCHASE_REQUEST})

        const { data } = await axios.get(`/api/v1/purchases/active`);

        dispatch({
            type : ACTIVE_PURCHASE_SUCCESS,
            payload : data
        })
        
    } catch (error) {
        dispatch({
            type : ACTIVE_PURCHASE_FAIL,
            payload : error.response.data.message
        }) 
    }
}
 //clear message
 export const clearMessage = () => async (dispatch) => {
     dispatch({type:CLEAR_MESSAGE})
}