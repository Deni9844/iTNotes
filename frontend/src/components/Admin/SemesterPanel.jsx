import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getAllSubjects } from '../../actions/semesterAction.js'
import { clearAdminError } from '../../actions/adminAction.js'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Loader from '../layout/Loader/Loader.js'
import './panel.css'
import ChapterSection from './ChapterSection.jsx'
import QuestionSection from './QuestionSection.jsx'
import QuestionBankSection from './QuestionBankSection.jsx'
import BookSection from './BookSection.jsx'
import LabSection from './LabSection.jsx'
import VivaSection from './VivaSection.jsx'
import { addNewSubject, deleteSubject, updateSubject } from '../../actions/adminAction.js'
import { BarChart } from '@mui/x-charts/BarChart';
import {
  BOOK_DELETED,
  BOOK_EDITED,
  CHAPTER_DELETED, CHAPTER_EDITED, DELETE_BOOK_RESET, DELETE_CHAPTER_RESET, DELETE_LAB_RESET, DELETE_QUESTION_BANK_RESET, DELETE_QUESTION_RESET, DELETE_SUBJECT_RESET, DELETE_VIVA_RESET, EDIT_BOOK_RESET, EDIT_CHAPTER_RESET, EDIT_LAB_RESET, EDIT_QUESTION_BANK_RESET, EDIT_QUESTION_RESET, EDIT_SUBJECT_RESET,
  EDIT_VIVA_RESET,
  LAB_DELETED,
  LAB_EDITED,
  NEW_BOOK_RESET,
  NEW_CHAPTER_RESET, NEW_LAB_RESET, NEW_QUESTION_BANK_RESET, NEW_QUESTION_RESET, NEW_SUBJECT_RESET, NEW_VIVA_RESET, QUESTION_BANK_DELETED, QUESTION_BANK_EDITED, QUESTION_DELETED, QUESTION_EDITED, SUBJECT_DELETED, SUBJECT_EDITED,
  VIVA_DELETED,
  VIVA_EDITED
} from '../../constants/adminConstants.js'


const SemesterPanel = ({ isHover, setIsHover, setActiveOption, width, setLevel, level, setPopupToggle }) => {
  const [toggle, setToggle] = useState(false)
  const [permission, setPermission] = useState(false)
  const [deleteSubPopup, setDeleteSubPopup] = useState(false)
  const [editSubPopup, setEditSubPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [subjectObj, setSubjectObj] = useState({})
  const [subjectCode, setSubjectCode] = useState('')
  const [num, setNum] = useState(0)
  const [positive, setPositive] = useState([])
  const [negative, setNegative] = useState([])
  const [neutral, setNeutral] = useState([])
  const [chaptersName, setChaptersName] = useState([])
  const [choosedSub, setChoosedSub] = useState("")
  const [subCode, setSubCode] = useState(null)


  const [newSubjectObj, setNewSubjectObj] = useState({
    code: '',
    description: '',
    subject: '',
  });

  const [editedSubjectObj, setEditedSubjectObj] = useState({})
  const [newSubjectPopup, setNewSubjectPopup] = useState()

  //for chapter
  const [chapterObj, setChapterObj] = useState({})
  const [newChapterObj, setNewChapterObj] = useState({})
  const [editedChapterObj, setEditedChapterObj] = useState({})

  //for Question
  const [qtnChName, setQtnChName] = useState()
  const [qtnSubCode, setQtnSubCode] = useState(null)
  const [questionObj, setQuestionObj] = useState({})
  const [newQuestionObj, setNewQuestionObj] = useState({})
  const [editedQuestionObj, setEditedQuestionObj] = useState({})

  //for Question Bank
  const [qtnBankSubCode, setQtnBankSubCode] = useState(null)
  const [questionBankObj, setQuestionBankObj] = useState({})
  const [newQuestionBankObj, setNewQuestionBankObj] = useState({})
  const [editedQuestionBankObj, setEditedQuestionBankObj] = useState({})

  //for Book
  const [bookSubCode, setBookSubCode] = useState(null)
  const [bookSubCodePrev, setBookSubCodePrev] = useState(null)
  const [bookObj, setBookObj] = useState({})
  const [newBookObj, setNewBookObj] = useState({})
  const [editedBookObj, setEditedBookObj] = useState({})

  //for Lab report
  const [labSubCode, setLabSubCode] = useState(null)
  const [labSubCodePrev, setLabSubCodePrev] = useState(null)
  const [labObj, setLabObj] = useState({})
  const [newLabObj, setNewLabObj] = useState({})
  const [editedLabObj, setEditedLabObj] = useState({})

  //for viva 
  const [vivaSubCode, setVivaSubCode] = useState(null)
  const [vivaSubCodePrev, setVivaSubCodePrev] = useState(null)
  const [vivaObj, setVivaObj] = useState({})
  const [newVivaObj, setNewVivaObj] = useState({})
  const [editedVivaObj, setEditedVivaObj] = useState({})

  const dispatch = useDispatch()

  const alert = useAlert()

  const { subjects, loading, error, totalSub, resultPerPage } = useSelector(state => state.semester)
  const { isSubAdded, loading: newLoader, isChAdded, error: newCreatedErr, isQtnAdded, isQtnBankAdded,
    isBookAdded, isLabAdded, isVivaAdded
  } = useSelector(state => state.new)
  const { loading: updateDeleteLoader, isSubDeleted, isSubUpdated, isChUpdated, isChDeleted, isQtnUpdated, isQtnDeleted,
    error: deleteUpdateErr, isQtnBankUpdated, isQtnBankDeleted, isBookUpdated, isBookDeleted, isLabUpdated, isLabDeleted,
    isVivaUpdated, isVivaDeleted } = useSelector((state) => state.profile)

  const handleAction = (subObj) => {
    setPopupToggle(true);
    if (subObj) {
      setSubjectObj(subObj)
      setEditedSubjectObj({
        sub: subObj.subject, des: subObj.description, code: subObj.code, syllabus: {
          fullMarks: subObj.syllabus.fullMarks,
          passMarks: subObj.syllabus.passMarks,
          courseObj: subObj.syllabus.courseObjective,
          courseDes: subObj.syllabus.courseDescription,
          refBooks: subObj.syllabus.referenceBooks,
          txtBooks: subObj.syllabus.textBook,
          labWorks: subObj.syllabus.labWorks
        }
      })
    }
  }

  const handlePopupAction = (perm) => {
    setPermission(perm);
    setPopupToggle(false)
    setDeleteSubPopup(false)
    setEditSubPopup(false)
    setNewSubjectPopup(false)
  }

  const handleFormSubmission = () => {
    if (!newSubjectObj.subject || !newSubjectObj.code || !newSubjectObj.description || !newSubjectObj.passMarks
      || !newSubjectObj.fullMarks || !newSubjectObj.courseDes || !newSubjectObj.courseObj || !newSubjectObj.labWorks
      || !newSubjectObj.txtBooks || !newSubjectObj.refBooks
    ) {

      return;
    }
    handlePopupAction(false)
    dispatch(addNewSubject({ ...newSubjectObj, sem: level }))
  }

  useEffect(() => {
    if (subjects.length )
      setSubCode(subjects[0].code)
  }, [subjects]);

  useEffect(() => {
    dispatch(getAllSubjects(level, currentPage));
    setNum((currentPage - 1 || 0) * 5);
  }, [currentPage, level]);

  useEffect(() => {
    if (choosedSub) {
      const chArr = [];
      const newPositive = [];
      const newNeutral = [];
      const newNegative = [];

      choosedSub.chapters.forEach((ch) => {
        let pos = 0, neg = 0, neu = 0;
        chArr.push(ch.name)
        if (ch.comments) {
          ch.comments.forEach((c) => {
            if (c.sentiment === "Positive") {
              pos++;
            } else if (c.sentiment === "Negative") {
              neg++;
            } else {
              neu++;
            }
          });
          newPositive.push(pos);
          newNeutral.push(neu);
          newNegative.push(neg);
        }

      });


      setChaptersName(chArr)
      setPositive(newPositive);
      setNeutral(newNeutral);
      setNegative(newNegative);

    }

  }, [choosedSub]);



  useEffect(() => {
    if (permission) {
      setPermission(false)
      dispatch(deleteSubject(level, subjectObj.subject));
    }

    if (!subjects.length) {
      setCurrentPage(currentPage => currentPage > 1 ? currentPage - 1 : currentPage)
    }


  }, [permission, dispatch, level, subjectObj.subject, subjects])

  useEffect(() => {
    const sub = subjects.find(sub => sub.code === subCode)
    setChoosedSub(sub)
  }, [subCode, subjects])


  useEffect(() => {
    if (error || newCreatedErr || deleteUpdateErr) {
      alert.error(error || deleteUpdateErr || newCreatedErr)
      error ? dispatch(clearErrors()) : dispatch(clearAdminError())
    }

    //For subjects
    if (isSubAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Subject added successfully");
      dispatch({ type: NEW_SUBJECT_RESET });
      setNewSubjectObj({})
    }

    if (isSubDeleted) {
      dispatch({ type: SUBJECT_DELETED, payload: subjectObj })
      alert.success("Subject deleted successfully");
      dispatch({ type: DELETE_SUBJECT_RESET });
    }

    if (isSubUpdated) {
      dispatch({ type: SUBJECT_EDITED, payload: { subjectObj, editedSubjectObj } })
      alert.success("Subject updated successfully");
      dispatch({ type: EDIT_SUBJECT_RESET })
      setEditedSubjectObj({})
    }

    //For chapters 
    if (isChAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Chapter added successfully");
      dispatch({ type: NEW_CHAPTER_RESET });
      setNewChapterObj({})
    }

    if (isChDeleted) {
      dispatch({ type: CHAPTER_DELETED, payload: { code: subjectCode, number: chapterObj.number } })
      alert.success("Chapter deleted successfully");
      dispatch({ type: DELETE_CHAPTER_RESET });
    }

    if (isChUpdated) {
      dispatch({ type: CHAPTER_EDITED, payload: { code: subjectCode, number: chapterObj.number, chapter: editedChapterObj } })
      alert.success("Chapter updated successfully");
      dispatch({ type: EDIT_CHAPTER_RESET });
      setEditedChapterObj({})
    }

    //For question
    if (isQtnAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Question added successfully");
      dispatch({ type: NEW_QUESTION_RESET });
      setNewQuestionObj({})
    }

    if (isQtnDeleted) {
      dispatch({ type: QUESTION_DELETED, payload: { code: qtnSubCode, chName: qtnChName, qtns_id: questionObj.id || questionObj._id } })
      alert.success("question deleted successfully");
      dispatch({ type: DELETE_QUESTION_RESET });
    }

    if (isQtnUpdated) {
      dispatch({ type: QUESTION_EDITED, payload: { code: qtnSubCode, chName: qtnChName, qtns_id: questionObj.id || questionObj._id, question: editedQuestionObj } })
      alert.success("Question updated successfully");
      dispatch({ type: EDIT_QUESTION_RESET });
      setEditedQuestionObj({})
    }

    //For question bank
    if (isQtnBankAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Question bank added successfully");
      dispatch({ type: NEW_QUESTION_BANK_RESET });
      setNewQuestionBankObj({})
    }

    if (isQtnBankDeleted) {
      dispatch({ type: QUESTION_BANK_DELETED, payload: { code: qtnBankSubCode, id: questionBankObj._id } })
      alert.success("Question Bank  deleted successfully");
      dispatch({ type: DELETE_QUESTION_BANK_RESET });
    }

    if (isQtnBankUpdated) {
      dispatch({ type: QUESTION_BANK_EDITED, payload: { code: qtnBankSubCode, id: questionBankObj._id, qtnBank: editedQuestionBankObj } })
      alert.success("Question Bank updated successfully");
      dispatch({ type: EDIT_QUESTION_BANK_RESET });
      setEditedQuestionBankObj({})
    }

    //For book
    if (isBookAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Book added successfully");
      dispatch({ type: NEW_BOOK_RESET });
      setNewBookObj({})
    }

    if (isBookDeleted) {
      dispatch({ type: BOOK_DELETED, payload: { code: bookSubCode } })
      alert.success("Book deleted successfully");
      dispatch({ type: DELETE_BOOK_RESET });
    }

    if (isBookUpdated) {
      dispatch({ type: BOOK_EDITED, payload: { code: bookSubCode, bk: editedBookObj, prevCode: bookSubCodePrev } })
      alert.success("Book updated successfully");
      dispatch({ type: EDIT_BOOK_RESET });
      setEditedBookObj({})
    }

    //For lab reports
    if (isLabAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Lab report added successfully");
      dispatch({ type: NEW_LAB_RESET });
      setNewLabObj({})
    }

    if (isLabDeleted) {
      dispatch({ type: LAB_DELETED, payload: { code: labSubCode } })
      alert.success("Lab report deleted successfully");
      dispatch({ type: DELETE_LAB_RESET });
    }

    if (isLabUpdated) {
      dispatch({ type: LAB_EDITED, payload: { code: labSubCode, lab: editedLabObj, prevCode: labSubCodePrev } })
      alert.success("Lab report updated successfully");
      dispatch({ type: EDIT_LAB_RESET });
      setEditedLabObj({})
    }

    //For viva
    if (isVivaAdded) {
      dispatch(getAllSubjects(level, currentPage))
      alert.success("Viva added successfully");
      dispatch({ type: NEW_VIVA_RESET });
      setNewVivaObj({})
    }

    if (isVivaDeleted) {
      dispatch({ type: VIVA_DELETED, payload: { code: vivaSubCode } })
      alert.success("Viva deleted successfully");
      dispatch({ type: DELETE_VIVA_RESET });
    }

    if (isVivaUpdated) {
      dispatch({ type: VIVA_EDITED, payload: { code: vivaSubCode, viva: editedVivaObj, prevCode: vivaSubCodePrev } })
      alert.success("Viva updated successfully");
      dispatch({ type: EDIT_VIVA_RESET });
      setEditedVivaObj({})
    }
  }, [
    error, newCreatedErr, deleteUpdateErr, isSubAdded, isSubDeleted, isSubUpdated,
    isChAdded, isChDeleted, isChUpdated, isQtnAdded, isQtnDeleted, isQtnUpdated,
    isQtnBankAdded, isQtnBankUpdated, isQtnBankDeleted, isBookAdded, isBookDeleted,
    isBookUpdated, isLabAdded, isLabDeleted, isLabUpdated,
    currentPage, level, subjectObj, editedSubjectObj, newSubjectObj,
    subjectCode, chapterObj, editedChapterObj, qtnChName, qtnSubCode, questionObj,
    editedQuestionObj, qtnBankSubCode, questionBankObj, editedQuestionBankObj,
    bookSubCode, editedBookObj, bookSubCodePrev, labObj, editedLabObj, labSubCode, labSubCodePrev,
    isVivaAdded, isVivaUpdated, isVivaDeleted, editedVivaObj, vivaSubCode, vivaSubCodePrev,
    dispatch, alert
  ]);



  return (
    <>
      {
        loading || newLoader || updateDeleteLoader ? <Loader /> : (
          <Fragment>
            <div className="dashboard-panel-top-outer">

              <div className="bar-chart" style={{ display: 'flex', margin: '50px 0 30px', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <h2 style={{ font: '400 22px interSemibold', color: '#5967E4', marginBottom: '16px' }}>Comments</h2>
                  <select style={{ right: '240px' }} onChange={(e) => setSubCode(e.target.value)} value={subCode}>
                    <option value=''>Select Sub code</option>
                    {
                      subjects && subjects.map((sub, i) => (
                        <option key={i} value={sub.code}>{sub.code}</option>
                      ))
                    }
                  </select>
                </div>
                {
                  choosedSub && <BarChart style={{ height: '28vmax', width: '100%' }}
                    xAxis={[{ scaleType: 'band', data: chaptersName }]}
                    series={[
                      { label: 'Positive', data: positive },
                      { label: 'Neutral', data: neutral },
                      { label: 'Negative', data: negative }
                    ]}
                    width={500}
                    height={300}
                  /> 
                }

              </div>
              <div className={`sem-item ${isHover ? 'active' : 'inactive'}`} style={{ left: width < 570 ? '30px' : '10px' }} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} >
                <ul>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('first') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>First Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('second') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Second Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('third') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Third Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('fourth') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Fourth Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('fifth') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Fifth Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('sixth') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Sixth Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('seventh') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Seventh Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('eight') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Eight Semester</li>
                </ul>
              </div>
            </div>

            <div className='panel-bottom-outer fourCol' >
              <div className="panel-bottom">
                <div className='head'>
                  <p className='first'>Subjects</p>
                  <div>
                    <p style={{ display: totalSub > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                      style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>
                    <p className='secondary' onClick={() => { handleAction(); setNewSubjectPopup(true) }}>Add New<svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor"
                      d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" /></svg></p>
                  </div>
                </div>

                <div className="table fourCol">
                  <div className='row'>
                    <p>S.N</p>
                    <p>Code</p>
                    <p>Subject</p>
                    <p>Action</p>
                  </div>
                  {
                    subjects && subjects.map((item, i) => (
                      (i < 5 || toggle) && <div className='row' key={i}>
                        <p>{num + i + 1}</p>
                        <p>{item.code}</p>
                        <p>{item.subject}</p>
                        <div>
                          <p onClick={() => { handleAction(item); setEditSubPopup(true) }}>Edit</p>
                          <p onClick={() => { handleAction(item); setDeleteSubPopup(true) }}>Delete</p>
                        </div>
                      </div>
                    ))
                  }

                  {!toggle && totalSub > resultPerPage && <div className="paginationBox">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={totalSub}
                      onChange={(e) => { setCurrentPage(e) }}
                      nextPageText="Next"
                      prevPageText="Prev"
                      firstPageText="1st"
                      lastPageText="Last"
                      itemClass="page-item"
                      linkClass="page-link"
                      activeClass="pageItemActive"
                      activeLinkClass="pageLinkActive"
                    />
                  </div>
                  }

                </div>
              </div>
            </div>

            {
              deleteSubPopup &&
              <div className='popup-box-outer'>
                <div className="popup-box">
                  <p>Are you sure want to delete subject <span>{subjectObj.subject}</span>?</p>
                  <div style={{ padding: '15px 0 0' }} className="popup-btns">
                    <button onClick={() => handlePopupAction(true)}>Delete</button>
                    <button onClick={() => handlePopupAction(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            }

            {
              editSubPopup &&
              <div className='popup-box-outer'>
                <div style={{ top: '46%', left: '55%', minWidth: '700px' }} className="popup-box">
                  <p className='heading'>Edit Subject</p>
                  <div className="container">
                    <div className="input-field">
                      <label >Subject:</label>
                      <input type="text" onChange={(e) => setEditedSubjectObj(prevState => ({
                        ...prevState,
                        sub: e.target.value
                      }))} value={editedSubjectObj.sub} />

                      <label>Detail:</label>
                      <textarea
                        rows={4}
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          des: e.target.value
                        }))}
                        value={editedSubjectObj.des}
                      />

                      <label>Code:</label>
                      <input type="text" onChange={(e) => setEditedSubjectObj(prevState => ({
                        ...prevState,
                        code: e.target.value
                      }))} value={editedSubjectObj.code} />

                      <label>Pass Marks:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, passMarks: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.passMarks}
                      />


                      <label>full Marks:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, fullMarks: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.fullMarks}
                      />
                    </div>
                    <div className='input-field'>

                      <label>course Des:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, courseDes: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.courseDes}
                      />


                      <label>course Obj:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, courseObj: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.courseObj}
                      />

                      <label>lab works:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, labWorks: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.labWorks}
                      />

                      <label>ref Books:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, refBooks: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.refBooks}
                      />

                      <label>txt books:</label>
                      <input
                        type="text"
                        onChange={(e) => setEditedSubjectObj(prevState => ({
                          ...prevState,
                          syllabus: { ...prevState.syllabus, txtBooks: e.target.value }
                        }))}
                        required value={editedSubjectObj.syllabus?.txtBooks}
                      />

                    </div>
                  </div>
                  <div className="popup-btns edit">
                    <button style={{
                      backgroundColor: "#1CC17C", pointerEvents: (editedSubjectObj.sub === subjectObj.subject) && (editedSubjectObj.code === subjectObj.code)
                        && (editedSubjectObj.des === subjectObj.description) && (editedSubjectObj.syllabus.passMarks ===
                          subjectObj.syllabus.passMarks) && (editedSubjectObj.syllabus.fullMarks === subjectObj.syllabus.fullMarks) &&
                        (editedSubjectObj.syllabus.courseObj === subjectObj.syllabus.courseObjective) && (editedSubjectObj.syllabus.courseDes === subjectObj.syllabus.courseDescription) &&
                        (editedSubjectObj.syllabus.labWorks === subjectObj.syllabus.labWorks) && (editedSubjectObj.syllabus.refBooks === subjectObj.syllabus.referenceBooks) &&
                        (editedSubjectObj.syllabus.txtBooks === subjectObj.syllabus.textBook) ? 'none' : ''
                    }}
                      onClick={() => { handlePopupAction(false); dispatch(updateSubject(level, subjectObj.subject, editedSubjectObj)) }}>Edit</button>
                    <button onClick={() => handlePopupAction(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            }

            {
              newSubjectPopup &&
              <div className='popup-box-outer'>
                <div style={{ top: '46%', left: '55%', minWidth: '700px' }} className="popup-box">
                  <p className='heading'>Add New Subject</p>
                  <form>
                    <div className="container">
                      <div className="input-field">
                        <label>Subject:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            subject: e.target.value
                          }))}
                          required
                          value={newSubjectObj.subject}
                        />

                        <label>Detail:</label>
                        <textarea
                          rows={4}
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            description: e.target.value
                          }))}
                          required value={newSubjectObj.description}
                        />

                        <label>Code:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            code: e.target.value
                          }))}
                          required value={newSubjectObj.code}
                        />

                        <label>Pass Marks:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            passMarks: e.target.value
                          }))}
                          required value={newSubjectObj.passMarks}
                        />


                        <label>full Marks:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            fullMarks: e.target.value
                          }))}
                          required value={newSubjectObj.fullMarks}
                        />
                      </div>
                      <div style={{ width: '50%' }} className='input-field'>
                        <label>course Des:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            courseDes: e.target.value
                          }))}
                          required value={newSubjectObj.courseDes}
                        />


                        <label>course Obj:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            courseObj: e.target.value
                          }))}
                          required value={newSubjectObj.courseObj}
                        />

                        <label>lab works:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            labWorks: e.target.value
                          }))}
                          required value={newSubjectObj.labWorks}
                        />

                        <label>ref Books:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            refBooks: e.target.value
                          }))}
                          required value={newSubjectObj.refBooks}
                        />

                        <label>txt books:</label>
                        <input
                          type="text"
                          onChange={(e) => setNewSubjectObj(prevState => ({
                            ...prevState,
                            txtBooks: e.target.value
                          }))}
                          required value={newSubjectObj.txtBooks}
                        />
                      </div>
                    </div>
                    <div className="popup-btns edit">
                      <button style={{
                        backgroundColor: "#1CC17C"
                      }}
                        onClick={() => handleFormSubmission()}>Add</button>
                      <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            }

            {/*Chapters section */}
            <ChapterSection subjects={subjects} setPopupToggle={setPopupToggle} newChapterObj={newChapterObj} setNewChapterObj={setNewChapterObj}
              editedChapterObj={editedChapterObj}
              setEditedChapterObj={setEditedChapterObj} subjectCode={subjectCode} setSubjectCode={setSubjectCode}
              chapterObj={chapterObj} setChapterObj={setChapterObj} level={level} />

            {/*Questions section */}
            <QuestionSection subjects={subjects} setPopupToggle={setPopupToggle} newQuestionObj={newQuestionObj} setNewQuestionObj={setNewQuestionObj}
              editedQuestionObj={editedQuestionObj}
              setEditedQuestionObj={setEditedQuestionObj} qtnSubCode={qtnSubCode} setQtnSubCode={setQtnSubCode}
              questionObj={questionObj} setQuestionObj={setQuestionObj} qtnChName={qtnChName} setQtnChName={setQtnChName}
              level={level} />

            {/*Question Bank section */}
            <QuestionBankSection subjects={subjects} setPopupToggle={setPopupToggle} newQuestionBankObj={newQuestionBankObj} setNewQuestionBankObj={setNewQuestionBankObj}
              editedQuestionBankObj={editedQuestionBankObj}
              setEditedQuestionBankObj={setEditedQuestionBankObj} qtnBankSubCode={qtnBankSubCode} setQtnBankSubCode={setQtnBankSubCode}
              questionBankObj={questionBankObj} setQuestionBankObj={setQuestionBankObj}
              level={level} />

            {/*Book section */}
            <BookSection subjects={subjects} setPopupToggle={setPopupToggle} newBookObj={newBookObj} setNewBookObj={setNewBookObj}
              editedBookObj={editedBookObj} setEditedBookObj={setEditedBookObj} bookObj={bookObj} setBookObj={setBookObj}
              level={level} setBookSubCode={setBookSubCode} setBookSubCodePrev={setBookSubCodePrev} />

            {/*Lab report section */}
            <LabSection subjects={subjects} setPopupToggle={setPopupToggle} newLabObj={newLabObj} setNewLabObj={setNewLabObj}
              editedLabObj={editedLabObj} setEditedLabObj={setEditedLabObj} labObj={labObj} setLabObj={setLabObj}
              level={level} setLabSubCode={setLabSubCode} setLabSubCodePrev={setLabSubCodePrev} />

            {/*Viva section */}
            <VivaSection subjects={subjects} setPopupToggle={setPopupToggle} newVivaObj={newVivaObj} setNewVivaObj={setNewVivaObj}
              editedVivaObj={editedVivaObj} setEditedVivaObj={setEditedVivaObj} vivaObj={vivaObj} setVivaObj={setVivaObj}
              level={level} setVivaSubCode={setVivaSubCode} setVivaSubCodePrev={setVivaSubCodePrev} />

          </Fragment >
        )
      }
    </>
  )
}

export default SemesterPanel
