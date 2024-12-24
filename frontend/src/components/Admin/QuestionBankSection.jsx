import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import './panel.css'
import { addNewQuestionBank, deleteQuestionBank, updateQuestionBank } from '../../actions/adminAction'

const QuestionBankSection = ({qtnBankOn,setQtnBankOn, subjects, setPopupToggle, newQuestionBankObj, setNewQuestionBankObj,
  editedQuestionBankObj, setEditedQuestionBankObj, qtnBankSubCode, setQtnBankSubCode, questionBankObj, setQuestionBankObj, level
}) => {
  const alert = useAlert()
  const dispatch = useDispatch()

  const [toggle, setToggle] = useState(false)
  const [newQtnBankPopup, setNewQtnBankPopup] = useState(false)
  const [editQtnBankPopup, setEditQtnBankPopup] = useState(false)
  const [deleteQtnBankPopup, setDeleteQtnBankPopup] = useState(false)
  const [permission, setPermission] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [choosedSub, setChoosedSub] = useState()
  const resultPerPage = 5

  const handleAction = (qtnBankObj) => {
    setPopupToggle(true);
    if (qtnBankObj) {
      setQuestionBankObj(qtnBankObj)
      setEditedQuestionBankObj({
        ...qtnBankObj,
        file: {
          name: qtnBankObj.file.public_id ? qtnBankObj.file.public_id.split('/')[4] + ".pdf" : qtnBankObj.file.name,
          content: ""
        }
      })
    }
  }

  const handlePopupAction = (perm) => {
    setPermission(perm);
    setPopupToggle(false)
    setNewQtnBankPopup(false)
    setEditQtnBankPopup(false)
    setDeleteQtnBankPopup(false)
  }

  const handleEditFormSubmission = (e) => {
    e.preventDefault()
    if (!editedQuestionBankObj.year || !editedQuestionBankObj.file
    ) {
      alert.info("All fields are required. Please ensure no fields are left blank.");
      return;
    }
    handlePopupAction(false)
    const formData = new FormData();
    formData.append('year', editedQuestionBankObj.year);
    formData.append('id', editedQuestionBankObj._id);
    formData.append('file', (editedQuestionBankObj.file.name === (questionBankObj.file.public_id ? (questionBankObj.file.public_id.split('/')[4] + ".pdf") : questionBankObj.file.name)) ? "" : editedQuestionBankObj.file.content);
    dispatch(updateQuestionBank(choosedSub.semester, choosedSub.subject,questionBankObj.year, formData))

  }

  const handleFormSubmission = (e) => {
    e.preventDefault()
    if (!newQuestionBankObj.year || !newQuestionBankObj.file
    ) {
      alert.info("All fields are required. Please ensure no fields are left blank.");
      return;
    }
    handlePopupAction(false)
    const formData = new FormData();
    formData.append('year', newQuestionBankObj.year);
    formData.append('file', newQuestionBankObj.file.content);
    dispatch(addNewQuestionBank(level,choosedSub.subject,formData))
  }

  const registerDataChange = (e) => {
    if (e.target.name === "file") {
      const readfile = e.target.files[0];

      newQtnBankPopup ? setNewQuestionBankObj({
        ...newQuestionBankObj, [e.target.name]: {
          name: readfile?.name,
          content: readfile
        }
      }) : setEditedQuestionBankObj({
        ...editedQuestionBankObj, [e.target.name]: {
          name: readfile?.name,
          content: readfile
        }
      })

    } else {
      newQtnBankPopup ?
        setNewQuestionBankObj({ ...newQuestionBankObj, [e.target.name]: e.target.value }) :
        setEditedQuestionBankObj({ ...editedQuestionBankObj, [e.target.name]: e.target.value })
    }
  };

  useEffect(() => {
    const sub = subjects.find(sub => sub.code === qtnBankSubCode)
    setChoosedSub(sub)

  }, [qtnBankSubCode,subjects])


  useEffect(() => {
    if (permission) {
      setPermission(false)
      dispatch(deleteQuestionBank(level, choosedSub.subject,questionBankObj.year))
    }

    if (currentPage > 1 && choosedSub && choosedSub.qtnsBank?.length && ((choosedSub.qtnsBank?.length - 1) < ((currentPage - 1) * 5))) {
      setCurrentPage(currentPage => currentPage - 1)
    }

  }, [permission, dispatch, questionBankObj, choosedSub, level, currentPage])


  return (
    <div>

      <>
        <div className='panel-bottom-outer first-more' >
          <div className="panel-bottom">
            <div className='head'>
              <p className='first'>Question Bank</p>
              <div>
                <select onChange={(e) => setQtnBankSubCode(e.target.value)} value={qtnBankSubCode}>
                  <option value=''>Select Sub code</option>
                  {
                    subjects && subjects.map((sub, i) => (
                      <option key={i} value={sub.code}>{sub.code}</option>
                    ))
                  }
                </select>

                <p style={{ display: choosedSub && choosedSub.qtnsBank?.length > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                  style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>

                <p className='secondary' style={{ visibility: choosedSub ? 'visible' : 'hidden' }} onClick={() => { handleAction(); setNewQtnBankPopup(true) }}>Add New<svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor"
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" /></svg></p>
              </div>
            </div>

            <div className="table first-more">
              <div className='row'>
                <p>Year</p>
                <p>Subject</p>
                <p>Action</p>
              </div>
              {
                choosedSub && choosedSub.qtnsBank?.map((item, i) => (
                  ((i >= (currentPage - 1) * 5 && i < (((currentPage - 1) * 5) + 5)) || toggle) && <div className='row' key={i}>
                    <p>{item.year}</p>
                    <p>{choosedSub.subject}</p>
                    <div>
                      <p onClick={() => { handleAction(item); setEditQtnBankPopup(true) }}>Edit</p>
                      <p onClick={() => { handleAction(item); setDeleteQtnBankPopup(true) }}>Delete</p>
                    </div>
                  </div>
                ))
              }

              {!toggle && choosedSub && choosedSub.qtnsBank?.length > resultPerPage && <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={choosedSub.qtnsBank?.length}
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

        {newQtnBankPopup &&
          <div className='popup-box-outer'>
            <div style={{ top: '46%' }} className="popup-box">
              <p className='heading'>Add New Question Bank</p>
              <form onSubmit={handleFormSubmission}>
                <div className='input-field'>
                  <label>Year:</label>
                  <input
                    type="Number"
                    name='year'
                    onChange={registerDataChange}
                    required
                    value={newQuestionBankObj.year}
                  />

                  <input
                    id='pdf'
                    type="file"
                    name="file"
                    accept="application/pdf"
                    multiple
                    onChange={registerDataChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="file">
                  <div onClick={() => document.getElementById("pdf").click()}>
                    <span>Click here to add pdf</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z"></path></svg>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023c.479 0 .774-.242.774-.651c0-.366-.254-.586-.704-.586m3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018c.817.006 1.349-.444 1.349-1.396c.006-.83-.479-1.268-1.255-1.268" /><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9.498 16.19c-.309.29-.765.42-1.296.42a2 2 0 0 1-.308-.018v1.426H7v-3.936A7.6 7.6 0 0 1 8.219 14c.557 0 .953.106 1.22.319c.254.202.426.533.426.923c-.001.392-.131.723-.367.948m3.807 1.355c-.42.349-1.059.515-1.84.515c-.468 0-.799-.03-1.024-.06v-3.917A8 8 0 0 1 11.66 14c.757 0 1.249.136 1.633.426c.415.308.675.799.675 1.504c0 .763-.279 1.29-.663 1.615M17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17zM14 9h-1V4l5 5z" /></svg>
                    <p>{newQuestionBankObj?.file?.name}</p>
                  </div>
                </div>

                <div className="popup-btns edit">
                  <button style={{
                    backgroundColor: "#1CC17C"
                  }}
                  >Add</button>
                  <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        }

        {editQtnBankPopup &&
          <div className='popup-box-outer'>
            <div style={{ top: '46%' }} className="popup-box">
              <p className='heading'>Edit Question Bank</p>
              <form onSubmit={handleEditFormSubmission}>
                <div className='input-field'>
                  <label>Year:</label>
                  <input
                    type="Number"
                    name='year'
                    onChange={registerDataChange}
                    required
                    value={editedQuestionBankObj.year}
                  />

                  <input
                    id='pdf'
                    type="file"
                    name="file"
                    accept="application/pdf"
                    multiple
                    onChange={registerDataChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="file">
                  <div onClick={() => document.getElementById("pdf").click()}>
                    <span>Click here to add pdf</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z"></path></svg>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023c.479 0 .774-.242.774-.651c0-.366-.254-.586-.704-.586m3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018c.817.006 1.349-.444 1.349-1.396c.006-.83-.479-1.268-1.255-1.268" /><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9.498 16.19c-.309.29-.765.42-1.296.42a2 2 0 0 1-.308-.018v1.426H7v-3.936A7.6 7.6 0 0 1 8.219 14c.557 0 .953.106 1.22.319c.254.202.426.533.426.923c-.001.392-.131.723-.367.948m3.807 1.355c-.42.349-1.059.515-1.84.515c-.468 0-.799-.03-1.024-.06v-3.917A8 8 0 0 1 11.66 14c.757 0 1.249.136 1.633.426c.415.308.675.799.675 1.504c0 .763-.279 1.29-.663 1.615M17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17zM14 9h-1V4l5 5z" /></svg>
                    <p>{editedQuestionBankObj.file.name}</p>
                  </div>
                </div>

                <div className="popup-btns edit">
                  <button style={{
                    backgroundColor: "#1CC17C",
                    pointerEvents:(editedQuestionBankObj.year.toString() === questionBankObj.year.toString())
                      && (editedQuestionBankObj.file.name === (questionBankObj.file.public_id ? (questionBankObj.file.public_id.split('/')[4] + ".pdf") : questionBankObj.file.name)) ? 'none' : ''
                  }}

                  >Edit</button>
                  <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        }

        {
          deleteQtnBankPopup &&
          <div className='popup-box-outer'>
            <div className="popup-box">
              <p>Are you sure want to delete question bank of year <span>{questionBankObj.year}</span>?</p>
              <div style={{ padding: '15px 0 0' }} className="popup-btns">
                <button onClick={() => handlePopupAction(true)}>Delete</button>
                <button onClick={() => handlePopupAction(false)}>Cancel</button>
              </div>
            </div>
          </div>
        }
      </>

    </div>
  )
}

export default QuestionBankSection
