import { createReducer } from "@reduxjs/toolkit"
import {
  ALL_SUBJECT_REQUEST,
  ALL_SUBJECT_FAIL,
  ALL_SUBJECT_SUCCESS,
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
import {
  SUBJECT_DELETED,
  SUBJECT_EDITED,
  CHAPTER_DELETED,
  CHAPTER_EDITED,
  QUESTION_EDITED,
  QUESTION_DELETED,
  QUESTION_BANK_DELETED,
  QUESTION_BANK_EDITED,
  BOOK_DELETED,
  BOOK_EDITED,
  LAB_DELETED,
  LAB_EDITED,
  VIVA_DELETED,
  VIVA_EDITED,
} from "../constants/adminConstants";

export const allSemReducer = createReducer({semesters:[]},(builder) => {
  builder
  .addCase(ALL_SEMESTER_REQUEST,(state)=>{
    return{
      loading:true
    }
  })
  .addCase(ALL_SEMESTER_SUCCESS,(state,action)=>{
    return{
      loading:false,
      semesters:action.payload.semesters
    }
  })
  .addCase(ALL_SEMESTER_FAIL,(state,action)=>{
    return{
      loading:false,
      error:action.payload
    }
  })
  .addCase(CLEAR_ERRORS, (state) => {
    return{
      ...state,
      error:null
    }
  })

})

export const allSubReducer = createReducer({ subjects: [] }, (builder) => {
  builder
    .addCase(ALL_SUBJECT_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(ALL_SUBJECT_SUCCESS, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.subjects = action.payload.subjects;
      state.totalSub = action.payload.totalSub;
      state.resultPerPage = action.payload.resultPerPage;
    })
    .addCase(ALL_SUBJECT_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(SUBJECT_DELETED, (state, action) => {
      return {
        ...state,
        totalSub: state.totalSub - 1,
        subjects: state.subjects.filter(subject => subject._id !== action.payload._id)
      }
    })
    .addCase(SUBJECT_EDITED, (state, action) => {
      const { editedSubjectObj } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(subject =>
          subject._id === action.payload.subjectObj._id ? {
            ...subject, subject: editedSubjectObj.sub,
            description: editedSubjectObj.des, code: editedSubjectObj.code,
            syllabus: {
              passMarks: editedSubjectObj.syllabus.passMarks,
              fullMarks: editedSubjectObj.syllabus.fullMarks,
              courseObjective: editedSubjectObj.syllabus.courseObj,
              courseDescription: editedSubjectObj.syllabus.courseDes,
              labWorks: editedSubjectObj.syllabus.labWorks,
              referenceBooks: editedSubjectObj.syllabus.refBooks,
              textBook: editedSubjectObj.syllabus.txtBooks
            }
          } : subject
        )
      }
    })
    .addCase(CHAPTER_DELETED, (state, action) => {
      const { code, number } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          chapters: sub.chapters.filter(ch => ch.number !== number)
        } : sub)
      }
    })
    .addCase(CHAPTER_EDITED, (state, action) => {
      const { code, number, chapter } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          chapters: sub.chapters.map(ch => ch.number === number ? chapter : ch)
        } : sub)
      }
    })
    .addCase(QUESTION_DELETED, (state, action) => {
      const { code, chName, qtns_id } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          chapters: sub.chapters.map(ch => ch.name === chName ? {
            ...ch,
            questions: ch.questions.filter(q => (q._id || q.id) !== qtns_id)
          } : ch)
        } : sub)
      }
    })
    .addCase(QUESTION_EDITED, (state, action) => {
      const { code, chName, qtns_id, question } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          chapters: sub.chapters.map(ch => ch.name === chName ? {
            ...ch,
            questions: ch.questions.map(q => (q._id || q.id) === qtns_id ? question : q)
          } : ch)
        } : sub)
      }
    })
    .addCase(QUESTION_BANK_DELETED, (state, action) => {
      const { code, id } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          qtnsBank: sub.qtnsBank.filter(qtn => qtn._id !== id)
        } : sub)
      }
    })
    .addCase(QUESTION_BANK_EDITED, (state, action) => {
      const { code, id, qtnBank } = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          qtnsBank: sub.qtnsBank.map(qtn => qtn._id === id ? qtnBank : qtn)
        } : sub)
      }
    })
    .addCase(BOOK_DELETED, (state, action) => {
      const { code} = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          book: {}
        } : sub)
      }
    })
    .addCase(BOOK_EDITED, (state, action) => {
      const { code, bk, prevCode } = action.payload;
      return {
        ...state,
        subjects: state.subjects.map(sub => {
          if (sub.code.toString() === code.toString()) {
            return {
              ...sub,
              book: bk
            };
          }
          if (sub.code.toString() === prevCode.toString()) {
            return {
              ...sub,
              book: {}
            };
          }
          return sub;
        })
      };
    })
    .addCase(LAB_DELETED, (state, action) => {
      const { code} = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          labReport: {}
        } : sub)
      }
    })
    .addCase(LAB_EDITED, (state, action) => {
      const { code, lab, prevCode } = action.payload;
      return {
        ...state,
        subjects: state.subjects.map(sub => {
          if (sub.code.toString() === code.toString()) {
            return {
              ...sub,
              labReport: lab
            };
          }
          if (sub.code.toString() === prevCode.toString()) {
            return {
              ...sub,
              labReport: {}
            };
          }
          return sub;
        })
      };
    })
    .addCase(VIVA_DELETED, (state, action) => {
      const { code} = action.payload
      return {
        ...state,
        subjects: state.subjects.map(sub => sub.code === code ? {
          ...sub,
          viva: {}
        } : sub)
      }
    })
    .addCase(VIVA_EDITED, (state, action) => {
      const { code, viva, prevCode } = action.payload;
      return {
        ...state,
        subjects: state.subjects.map(sub => {
          if (sub.code.toString() === code.toString()) {
            return {
              ...sub,
              viva
            };
          }
          if (sub.code.toString() === prevCode.toString()) {
            return {
              ...sub,
              viva: {}
            };
          }
          return sub;
        })
      };
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null
    })
});

export const subjectReducer = createReducer({ details: {} }, (builder) => {
  builder
    .addCase(SUBJECT_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(SUBJECT_SUCCESS, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.details = action.payload.result;
    })
    .addCase(SUBJECT_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null
    })
});


export const chapterReducer = createReducer({ details: {} }, (builder) => {
  builder
    .addCase(CHAPTER_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(CHAPTER_SUCCESS, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.details = action.payload.res_chapter;
    })
    .addCase(CHAPTER_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null
    })
});


export const questionsReducer = createReducer({ questions: [] }, (builder) => {
  builder
    .addCase(QUESTIONS_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(QUESTIONS_SUCCESS, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.questions = action.payload.filteredQuestions;
      state.resultPerPage = action.payload.resultPerPage;
      state.filteredCount = action.payload.filteredCount;
    })
    .addCase(QUESTIONS_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(CLEAR_ERRORS, (state) => {
      state.error = null
    })
});