import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/semesterAction.js'
import { clearAdminError } from '../../actions/adminAction.js'
import { addNewNotice, deleteNotice, updateNotice } from '../../actions/adminAction.js'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Loader from '../layout/Loader/Loader.js'
import './panel.css'
import { getAllNotices } from '../../actions/noticeAction.js'
import { DELETE_NOTICE_RESET, EDIT_NOTICE_RESET, NEW_NOTICE_RESET, NOTICE_DELETED, NOTICE_EDITED } from '../../constants/adminConstants.js'
const NoticesPanel = ({ isHover, setIsHover, setActiveOption, width, setPopupToggle, setLevel }) => {

  const [toggle, setToggle] = useState(false)
  const [newPopup, setNewPopup] = useState(false)
  const [editPopup, setEditPopup] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)
  const [permission, setPermission] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [noticeObj, setNoticeObj] = useState({})
  const [newNoticeObj, setNewNoticeObj] = useState({})
  const [editedNoticeObj, setEditedNoticeObj] = useState({})
  const [num, setNum] = useState(0)
  const categories = ['Result', 'Exam Schedule', 'Notice']

  const { notices, loading, totalNotices,error } = useSelector(state => state.notices)
  const { loading: updateDeleteLoader,isNoticeDeleted,isNoticeUpdated,
    error: deleteUpdateErr } = useSelector((state) => state.profile)
  const { loading: newLoader,isNoticeAdded, error: newCreatedErr } = useSelector(state => state.new)

  const resultPerPage = 5
  const dispatch = useDispatch()
  const alert = useAlert()

  const handleAction = (obj) => {
    setPopupToggle(true);
    if (obj) {
      setNoticeObj({
        _id:obj._id,
        provider: obj.provider,
        file: obj.file,
        title: obj.title,
        category: obj.category
      })
      setEditedNoticeObj({
        _id:obj._id,
        provider: obj.provider,
        title: obj.title,
        category: obj.category,
        file: {
          name: obj.file?.public_id ? obj.file.public_id.split('/')[1] + ".pdf" : obj.file.name,
          content: ""
        }
      })
    }
  }

  const handlePopupAction = (perm) => {
    setPermission(perm);
    setPopupToggle(false)
    setNewPopup(false)
    setEditPopup(false)
    setDeletePopup(false)
  }

  const handleEditFormSubmission = (e) => {
    e.preventDefault()
    if (!editedNoticeObj.provider || !editedNoticeObj.file || !editedNoticeObj.category ||
      !editedNoticeObj.title
    ) {
      alert.info("All fields are required. Please ensure no fields are left blank.");
      return;
    }
    handlePopupAction(false)
    const formData = new FormData();
    formData.append('provider', editedNoticeObj.provider);
    formData.append('title', editedNoticeObj.title);
    formData.append('category', editedNoticeObj.category);
    formData.append('file', (editedNoticeObj.file.name === (noticeObj.file?.public_id ? (noticeObj.file?.public_id.split('/')[1] + ".pdf") : noticeObj.file.name)) ? "" : editedNoticeObj.file.content);
    dispatch(updateNotice(noticeObj._id, formData))

  }

  const handleFormSubmission = (e) => {
    e.preventDefault()
   
    if (!newNoticeObj.provider || !newNoticeObj.file || !newNoticeObj.category || !newNoticeObj.title
    ) {
      alert.info("All fields are required. Please ensure no fields are left blank.");
      return;
    }
    handlePopupAction(false)
    const formData = new FormData();
    formData.append('provider', newNoticeObj.provider);
    formData.append('title', newNoticeObj.title);
    formData.append('category', newNoticeObj.category);
    formData.append('file', newNoticeObj.file.content);
    dispatch(addNewNotice(formData))
  }

  const registerDataChange = (e) => {
    if (e.target.name === "file") {
      const readfile = e.target.files[0];

      newPopup ? setNewNoticeObj({
        ...newNoticeObj, [e.target.name]: {
          name: readfile?.name,
          content: readfile
        }
      }) : setEditedNoticeObj({
        ...editedNoticeObj, [e.target.name]: {
          name: readfile?.name,
          content: readfile
        }
      })

    } else {
      newPopup ?
        setNewNoticeObj({ ...newNoticeObj, [e.target.name]: e.target.value }) :
        setEditedNoticeObj({ ...editedNoticeObj, [e.target.name]: e.target.value })
    }
  };

  useEffect(() => {
    dispatch(getAllNotices(currentPage, 5))
    setNum((currentPage - 1 || 0) * 5);
  }, [currentPage]);

  useEffect(() => {
    if (permission) {
        setPermission(false)
        dispatch(deleteNotice(noticeObj._id))
    } 

    if(!notices.length){
      setCurrentPage(currentPage=>currentPage-1)
    }

}, [permission, dispatch,notices])

useEffect(()=>{
  if (error || newCreatedErr || deleteUpdateErr) {
    alert.error(error || deleteUpdateErr || newCreatedErr)
    error ? dispatch(clearErrors()) : dispatch(clearAdminError())
  }

 if(isNoticeAdded){
  dispatch(getAllNotices(currentPage,5))
  alert.success("Notice added successfully")
  dispatch({type:NEW_NOTICE_RESET})
  setNewNoticeObj({})
 }

 if(isNoticeUpdated){
  dispatch({type:NOTICE_EDITED,payload:{id:noticeObj._id,editedNotice:editedNoticeObj}})
  alert.success("Notice edited successfully")
  dispatch({type:EDIT_NOTICE_RESET})
  setEditedNoticeObj({})
 }

 if(isNoticeDeleted){
  dispatch({type:NOTICE_DELETED,payload:{id:noticeObj._id}})
  alert.success("Notice deleted successfully")
  dispatch({type:DELETE_NOTICE_RESET})
 }
},[isNoticeAdded,isNoticeDeleted,isNoticeUpdated,dispatch,alert,
  noticeObj,currentPage,editedNoticeObj,error,newCreatedErr,deleteUpdateErr])

  return (
    <>
      {
        loading || newLoader || updateDeleteLoader ? <Loader /> : (
          <Fragment>
            <div className="dashboard-panel-top-outer">
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
                  <p className='first'>Notices</p>
                  <div>
                    <p style={{ display: totalNotices > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                      style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>
                    <p className='secondary' onClick={() => { handleAction(); setNewPopup(true) }}>Add New<svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor"
                      d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" /></svg></p>
                  </div>
                </div>

                <div className="table first-less">
                  <div className='row'>
                    <p>S.N</p>
                    <p>Notice</p>
                    <p>Action</p>
                  </div>
                  {
                    notices && notices.map((item, i) => (
                      (i < 5 || toggle) && <div className='row' key={i}>
                        <p>{num + i + 1}</p>
                        <p>{item.title}</p>
                        <div>
                          <p onClick={() => { handleAction(item); setEditPopup(true) }}>Edit</p>
                          <p onClick={() => { handleAction(item); setDeletePopup(true) }}>Delete</p>
                        </div>
                      </div>
                    ))
                  }

                  {!toggle && totalNotices > resultPerPage && <div className="paginationBox">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={totalNotices}
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

            {newPopup &&
              <div className='popup-box-outer'>
                <div style={{ top: '46%' }} className="popup-box">
                  <p className='heading'>Add New notice</p>
                  <form onSubmit={handleFormSubmission}>
                    <div className='input-field'>
                      <label>Title:</label>
                      <input
                        type="text"
                        name='title'
                        onChange={registerDataChange}
                        required
                        value={newNoticeObj.title}
                      />

                      <label>Category:</label>
                      <select name='category' onChange={registerDataChange} value={newNoticeObj.category}>
                        <option value=''>Select category</option>
                        {
                          categories && categories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))
                        }
                      </select>

                      <label>Provider:</label>
                      <input
                        type="text"
                        name='provider'
                        onChange={registerDataChange}
                        required
                        value={newNoticeObj.provider}
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
                        <p>{newNoticeObj?.file?.name}</p>
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

            {editPopup &&
              <div className='popup-box-outer'>
                <div style={{ top: '46%' }} className="popup-box">
                  <p className='heading'>Edit Notice</p>
                  <form onSubmit={handleEditFormSubmission}>
                    <div className='input-field'>
                      <label>Title:</label>
                      <input
                        type="text"
                        name='title'
                        onChange={registerDataChange}
                        required
                        value={editedNoticeObj.title}
                      />

                      <label>Category:</label>
                      <select name='category' onChange={registerDataChange} value={editedNoticeObj.category}>
                        <option value=''>Select category</option>
                        {
                          categories && categories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))
                        }
                      </select>

                      <label>Provider:</label>
                      <input
                        type="text"
                        name='provider'
                        onChange={registerDataChange}
                        required
                        value={editedNoticeObj.provider}
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
                        <p>{editedNoticeObj.file.name}</p>
                      </div>
                    </div>

                    <div className="popup-btns edit">
                      <button style={{
                        backgroundColor: "#1CC17C",
                        pointerEvents: (editedNoticeObj.provider === noticeObj.provider) && (editedNoticeObj.category === noticeObj.category)
                          && (editedNoticeObj.title === noticeObj.title)
                          && (editedNoticeObj.file.name === (noticeObj.file.public_id ? (noticeObj.file.public_id.split('/')[1] + ".pdf") : noticeObj.file.name)) ? 'none' : ''
                      }}

                      >Edit</button>
                      <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            }

            {
              deletePopup &&
              <div className='popup-box-outer'>
                <div className="popup-box">
                  <p>Are you sure want to delete notice <span>{noticeObj.title}</span>?</p>
                  <div style={{ padding: '15px 0 0' }} className="popup-btns">
                    <button onClick={() => handlePopupAction(true)}>Delete</button>
                    <button onClick={() => handlePopupAction(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            }
          </Fragment>
        )
      }
    </>
  )
}
export default NoticesPanel
