import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/semesterAction.js'
import { clearAdminError, deleteQuery, getAllQueries, replyQuestion } from '../../actions/adminAction.js'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Loader from '../layout/Loader/Loader.js'
import './panel.css'
import { DELETE_QUERY_RESET, QUERY_DELETED, QUERY_REPLIED, REPLY_QUERY_RESET } from '../../constants/adminConstants.js'

const QueriesPanel = ({ isHover, setIsHover, setActiveOption, width, setPopupToggle, setLevel }) => {
  const [toggle, setToggle] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)
  const [replyPopup, setReplyPopup] = useState(false)
  const [previewPopup, setPreviewPopup] = useState(false)
  const [permission, setPermission] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [file, setFile] = useState({})
  const [queryObj, setQueryObj] = useState({})
  const [active, setActive] = useState(-1)
  const [num, setNum] = useState(0)

  const { queries, loading, totalQueries, error } = useSelector(state => state.allQueries)
  const { loading: replyUpdateLoader, isQueryDeleted, isQueryReplied,
    error: replyDeleteErr } = useSelector((state) => state.profile)

  const resultPerPage = 5
  const dispatch = useDispatch()
  const alert = useAlert()

  const handleAction = async (obj) => {
    setPopupToggle(true);
    if (obj) {
      setQueryObj(obj)
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

    if (!file.answer) {
      alert.info("Please provide the answer");
      return;
    }

    handlePopupAction(false)
    const formData = new FormData();
    formData.append('file', file.answer);
    dispatch(replyQuestion(formData, queryObj._id))
  }

  const registerDataChange = (e) => {
    const readfile = e.target.files[0];

    setFile({ name: readfile?.name, answer: readfile })
  };


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
    if (currentPage >= 1) {
      dispatch(getAllQueries(currentPage, 5))
      setNum((currentPage - 1 || 0) * 5);
    }
  }, [currentPage]);

  useEffect(() => {
    if (permission) {
      setPermission(false)
      dispatch(deleteQuery(queryObj._id))
    }

    if (queries && !queries.length) {
      setCurrentPage(currentPage => currentPage - 1)
    }

  }, [permission, dispatch, queries, queryObj])

  useEffect(() => {
    if (error || replyDeleteErr) {
      alert.error(error || replyDeleteErr)
      error ? dispatch(clearErrors()) : dispatch(clearAdminError())
    }

    if (isQueryReplied) {
      dispatch({ type: QUERY_REPLIED, payload: { id: queryObj._id } })
      alert.success("Responded to query successfully")
      dispatch({ type: REPLY_QUERY_RESET })
      setFile({})
    }

    if (isQueryDeleted) {
      dispatch({ type: QUERY_DELETED, payload: { id: queryObj._id } })
      alert.success("query deleted successfully")
      dispatch({ type: DELETE_QUERY_RESET })
    }
  }, [isQueryDeleted, isQueryReplied, dispatch, alert, queryObj,
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
                  <p className='first'>Queries</p>
                  <div>
                    <p style={{ display: totalQueries > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                      style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>
                  </div>
                </div>

                <div className="table first-less">
                  <div className='row'>
                    <p>S.N</p>
                    <p>Query</p>
                    <p>Action</p>
                  </div>
                  {
                    queries && queries.map((item, i) => (
                      (i < 5 || toggle) && <div className='row' key={i}>
                        <p>{num + i + 1}</p>
                        <p>{item.question || "Image provided. Preview to see"}</p>
                        <div>
                          {item.status === 'not replied' && <p onClick={() => { handleAction(item); setReplyPopup(true) }}>Reply</p>}
                          <p style={{ backgroundColor: "#CC1818" }} onClick={() => { handleAction(item); setDeletePopup(true) }}>Delete</p>
                          <span onClick={() => { handleAction(item); setPreviewPopup(true) }}>Preview</span>
                        </div>
                      </div>
                    ))
                  }

                  {!toggle && totalQueries > resultPerPage && <div className="paginationBox">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={totalQueries}
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
                  <p className='heading'>Reply query</p>
                  <form onSubmit={handleFormSubmission}>
                    <div className='input-field'>
                      <label>Email:</label>
                      <input
                        type="text"
                        name='email'
                        readOnly
                        className='readOnly'
                        value={queryObj.email}
                      />
                      <label>Query:</label>
                      <div>
                        <input
                          type="text"
                          name='question'
                          className='readOnly'
                          readOnly
                          value={queryObj.question}
                          style={{ display: 'block' }}
                        />
                        <div className='img-cont' style={{ marginTop: '10px' }}>
                          {
                            queryObj.img && queryObj.img.map((item, i) => (
                              <div className="img-block" >
                                <div className={`options ${active === i ? 'active' : 'inactive'}`}
                                  onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)}>
                                  <p onClick={() => document.getElementById(`view-${i}`).click()}>View</p>
                                  <p onClick={() => handleDownload(item.url, `file-${i}`)}>Download</p>
                                </div>
                                <img src={item.url} alt={`file ${i + 1}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} />
                                <a style={{ display: 'none' }} id={`view-${i}`} href={item.url} target="_blank" rel="noopener noreferrer"></a>
                              </div>

                            ))
                          }
                        </div>

                      </div>

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
                        <p>{file?.name}</p>
                      </div>
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
                  <p className='heading'>Preview Query </p>
                  <form >
                    <div className='input-field'>
                      <label>Level:</label>
                      <input
                        type="text"
                        readOnly
                        className='readOnly'
                        value={queryObj.semester}
                      />

                      <label>Subject:</label>
                      <input
                        type="text"
                        readOnly
                        className='readOnly'
                        value={queryObj.subject}
                      />

                      <label>Status:</label>
                      <input
                        type="text"
                        readOnly
                        className='readOnly'
                        value={queryObj.status}
                        style={{ color: queryObj.status === "replied" ? '#CC1818' : 'unset' }}
                      />

                      <label>Query:</label>
                      <div>
                        {
                          queryObj.question &&
                          <input
                            type="text"
                            name='question'
                            className='readOnly'
                            readOnly
                            value={queryObj.question}
                            style={{ display: 'block' }}
                          />
                        }

                        <div className='img-cont' style={{ marginTop: '10px' }}>
                          {
                            queryObj.img && queryObj.img.map((item, i) => (
                              <div className="img-block" >
                                <div className={`options ${active === i ? 'active' : 'inactive'}`}
                                  onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)}>
                                  <p onClick={() => document.getElementById(`view-${i}`).click()}>View</p>
                                  <p onClick={() => handleDownload(item.url, `file-${i}`)}>Download</p>
                                </div>
                                <img src={item.url} alt={`file ${i + 1}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} />
                                <a style={{ display: 'none' }} id={`view-${i}`} href={item.url} target="_blank" rel="noopener noreferrer"></a>
                              </div>

                            ))
                          }
                        </div>

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

export default QueriesPanel
