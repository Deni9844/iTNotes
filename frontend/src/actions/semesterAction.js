import axios from 'axios'
import {
  ALL_SUBJECT_REQUEST,
  ALL_SUBJECT_SUCCESS,
  ALL_SUBJECT_FAIL,
  SUBJECT_REQUEST,
  SUBJECT_SUCCESS,
  SUBJECT_FAIL,
  CHAPTER_REQUEST,
  CHAPTER_SUCCESS,
  CHAPTER_FAIL,
  QUESTIONS_REQUEST,
  QUESTIONS_SUCCESS,
  QUESTIONS_FAIL,
  CLEAR_ERRORS,
  ALL_SEMESTER_REQUEST,
  ALL_SEMESTER_SUCCESS,
  ALL_SEMESTER_FAIL
} from '../constants/semesterConstants'

// Get all Subjects of specific semester
export const getAllSemesters = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SEMESTER_REQUEST });

    const { data } = await axios.get(`/api/v1/semesters`);

    dispatch({
      type: ALL_SEMESTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_SEMESTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get all Subjects of specific semester
export const getAllSubjects = (level,page) => async (dispatch) => {
  try {
    dispatch({ type: ALL_SUBJECT_REQUEST });

    const { data } = await axios.get(`/api/v1/semester/${level}?page=${page}`);

    dispatch({
      type: ALL_SUBJECT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_SUBJECT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get details of specific subject
export const getSubjectDetails = (level, subject) => async (dispatch) => {
  try {
    dispatch({ type: SUBJECT_REQUEST });

    const { data } = await axios.get(`/api/v1/semester/${level}/${subject}`);

    dispatch({
      type: SUBJECT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SUBJECT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get details of specific chapter
export const getChapterDetails = (level, subject, chapter) => async (dispatch) => {
  try {
    dispatch({ type: CHAPTER_REQUEST });

    const { data } = await axios.get(`/api/v1/semester/${level}/${subject}/${chapter}`);

    dispatch({
      type: CHAPTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHAPTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Search a question
export const getQuestion = (providedData,text) => async (dispatch) => {
  try {
    dispatch({ type: QUESTIONS_REQUEST });

     // Convert FormData object to URLSearchParams
     const searchParams = new URLSearchParams(providedData);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`/api/v1/questions?${searchParams}&keyword=${text}`,config);

    dispatch({
      type: QUESTIONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: QUESTIONS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};