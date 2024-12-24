import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/semesterAction.js'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Loader from '../layout/Loader/Loader.js'
import './panel.css'
import { getAllAssets, clearAdminError, replyContributor, deleteAssets } from '../../actions/adminAction.js'
import { ASSEST_DELETED, ASSEST_REPLIED, DELETE_ASSEST_RESET, REPLY_ASSEST_RESET } from '../../constants/adminConstants.js'

const AssetsPanel = ({ isHover, setIsHover, setActiveOption, width, setPopupToggle, setLevel }) => {
  const [toggle, setToggle] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)
  const [replyPopup, setReplyPopup] = useState(false)
  const [previewPopup, setPreviewPopup] = useState(false)
  const [permission, setPermission] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState('')
  const [active, setActive] = useState(-1)
  const [assetsObj, setAssetsObj] = useState({})
  const [num, setNum] = useState(0)

  const { assets, loading, totalAssets, error } = useSelector(state => state.allAssets)
  const { loading: replyUpdateLoader, isAssestDeleted, isAssestReplied,
    error: replyDeleteErr } = useSelector((state) => state.profile)

  const resultPerPage = 5
  const dispatch = useDispatch()
  const alert = useAlert()

  const handleAction = async (obj) => {
    setPopupToggle(true);
    if (obj) {
      setAssetsObj(obj)
    }
  }

  const handlePopupAction = (perm) => {
    setPermission(perm);
    setPopupToggle(false)
    setReplyPopup(false)
    setPreviewPopup(false)
    setDeletePopup(false)
  }

  const handleFormSubmission = async (e) => {
    e.preventDefault()

    if (!message) {
      alert.info("Please write the reply message");
      return;
    }

    handlePopupAction(false)
    const formData = new FormData();
    formData.append('message', message);
    dispatch(replyContributor(assetsObj._id,formData))
  }

  const handleDownload = (url, fileName) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Force download with filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
      })
      .catch(err => console.error('Download error:', err));
  };


  useEffect(() => {
    if(currentPage >=1 ){
      dispatch(getAllAssets(currentPage, 5))
      setNum((currentPage - 1 || 0) * 5);
    }
   
  }, [currentPage]);

  useEffect(() => {
    if (permission) {
      setPermission(false)
      dispatch(deleteAssets(assetsObj._id))
    }

    if (assets && !assets.length) {
      setCurrentPage(currentPage => currentPage - 1)
    }

  }, [permission, dispatch, assets,assetsObj])

  useEffect(() => {
    if (error || replyDeleteErr) {
      alert.error(error || replyDeleteErr)
      error ? dispatch(clearErrors()) : dispatch(clearAdminError())
    }

    if (isAssestReplied) {
      dispatch({ type: ASSEST_REPLIED, payload: { id: assetsObj._id } })
      alert.success("Responded to contributor successfully")
      dispatch({ type: REPLY_ASSEST_RESET })
      setMessage('')
    }

    if (isAssestDeleted) {
      dispatch({ type: ASSEST_DELETED, payload: { id: assetsObj._id } })
      alert.success("assets deleted successfully")
      dispatch({ type: DELETE_ASSEST_RESET })
    }
  }, [isAssestDeleted, isAssestReplied, dispatch, alert,assetsObj,
    currentPage, error, replyDeleteErr])

  return (
    <>
      {
        loading || replyUpdateLoader ? <Loader /> : (
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
                  <p className='first'>Assets</p>
                  <div>
                    <p style={{ display: totalAssets > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                      style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>
                  </div>
                </div>

                <div className="table fourCol">
                  <div className='row'>
                    <p>S.N</p>
                    <p>Type</p>
                    <p>Level</p>
                    <p>Action</p>
                  </div>
                  {
                    assets && assets.map((item, i) => (
                      (i < 5 || toggle) && <div className='row' key={i}>
                        <p>{num + i + 1}</p>
                        <p>{item.type}</p>
                        <p>{item.semester}</p>
                        <div>
                          {item.status === 'not replied' && <p onClick={() => { handleAction(item); setReplyPopup(true) }}>Reply</p>}
                          <p style={{ backgroundColor: "#CC1818" }} onClick={() => { handleAction(item); setDeletePopup(true) }}>Delete</p>
                          <span onClick={() => { handleAction(item); setPreviewPopup(true) }}>Preview</span>
                        </div>
                      </div>
                    ))
                  }

                  {!toggle && totalAssets > resultPerPage && <div className="paginationBox">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={totalAssets}
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

            {replyPopup &&
              <div className='popup-box-outer'>
                <div style={{ top: '46%' }} className="popup-box">
                  <p className='heading'>Reply contributor</p>
                  <form onSubmit={handleFormSubmission}>
                    <div className='input-field'>
                      <label>Email:</label>
                      <input
                        type="text"
                        name='email'
                        readOnly
                        className='readOnly'
                        value={assetsObj.email}
                      />
                      <label>Asset:</label>
                      <div className='img-cont'>
                        {
                          assetsObj.file && assetsObj.file.map((item, i) => (
                            <div className="img-block" >
                              <div className={`options ${active === i ? 'active' : 'inactive'}`}
                                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)}>
                                <p onClick={() => document.getElementById(`view-${i}`).click()}>View</p>
                                <p onClick={() => handleDownload(item.url, `file-${i}`)}>Download</p>
                              </div>
                              {item.url.includes(".pdf") ? <embed
                                src={item.url}
                                alt={`file ${i+1}`}
                                type="application/pdf"
                                width="130px"
                                height="130px"
                                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)}
                              /> : <img src={item.url} alt={`file ${i+1}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} />}
                              <a style={{ display: 'none' }} id={`view-${i}`} href={item.url} target="_blank" rel="noopener noreferrer"></a>

                            </div>

                          ))
                        }
                      </div>
                      <label>Reply:</label>
                      <input
                        type="text"
                        name='reply'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <div className="popup-btns edit">
                      <button style={{
                        backgroundColor: "#1CC17C"
                      }}
                      >Submit</button>
                      <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            }

            {previewPopup &&
              <div className='popup-box-outer'>
                <div style={{ top: '46%' }} className="popup-box">
                  <p className='heading'>Preview </p>
                  <form >
                    <div className='input-field'>
                      <label>Level:</label>
                      <input
                        type="text"
                        readOnly
                        className='readOnly'
                        value={assetsObj.semester}
                      />

                      <label>Subject:</label>
                      <input
                        type="text"
                        readOnly
                        className='readOnly'
                        value={assetsObj.subject}
                      />

                      <label>Status:</label>
                      <input
                        type="text"
                        readOnly
                        className='readOnly'
                        value={assetsObj.status}
                        style={{ color: assetsObj.status === "replied" ? '#CC1818' : 'unset' }}
                      />

                      <label>Asset:</label>
                      <div className='img-cont'>
                        {
                          assetsObj.file && assetsObj.file.map((item, i) => (
                            <div className="img-block" >
                              <div className={`options ${active === i ? 'active' : 'inactive'}`}
                                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)}>
                                <p onClick={() => document.getElementById(`view-${i}`).click()}>View</p>
                                <p onClick={() => handleDownload(item.url, `file-${i}`)}>Download</p>
                              </div>
                              {item.url.includes(".pdf") ? <embed
                                src={item.url}
                                alt={`file ${i+1}`}
                                type="application/pdf"
                                width="130px"
                                height="130px"
                                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)}
                              /> : <img src={item.url}  alt={`file ${i+1}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} />}
                              <a style={{ display: 'none' }} id={`view-${i}`} href={item.url} target="_blank" rel="noopener noreferrer"></a>

                            </div>

                          ))
                        }
                      </div>
                    </div>
                    <div style={{ justifyContent: 'center' }} className="popup-btns edit">
                      <button type='button' onClick={() => handlePopupAction(false)}>Okay</button>
                    </div>
                  </form>
                </div>
              </div>
            }

            {
              deletePopup &&
              <div className='popup-box-outer'>
                <div className="popup-box">
                  <p>Are you sure want to delete the query?</p>
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

export default AssetsPanel
