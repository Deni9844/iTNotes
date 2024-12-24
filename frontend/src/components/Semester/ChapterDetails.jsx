import React, { Fragment, useEffect, useState } from 'react';
import './chapterDetails.css'
import MenuIcon from '@mui/icons-material/Menu';
import SegmentIcon from '@mui/icons-material/Menu'
import QuestionCard from './QuestionCard.jsx'
import CommentCard from './CommentCard.jsx'
import logo from '../../images/whiteLogo.png'
import { Link } from 'react-router-dom'
import solutionImg from '../../images/solution.png'
import { useParams,useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { clearErrors, getChapterDetails, getSubjectDetails } from '../../actions/semesterAction.js';
import Loader from '../layout/Loader/Loader.js';
import NotFound from './NotFound.jsx';
import { addComment } from '../../actions/userActon.js';
import { CLEAR_ERRORS, NEW_COMMENT_RESET } from '../../constants/userConstants.js';
import LoginIcon from '@mui/icons-material/Login';

const ChapterDetails = () => {

  const { level, subject, chapter } = useParams()

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const alert = useAlert()

  const [errorFlag, setErrorFlag] = useState(false)

  const { loading, error, details } = useSelector((state) => state.chapter)
  const { details: subjectDetails } = useSelector((state) => state.subject)
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const { success, error: commentError,loading:cmtloading } = useSelector((state) => state.newComment)
  const { active } = useSelector((state) => state.activePurchase)

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommentbox, setIsCommentbox] = useState(false);
  const [text, setText] = useState('');
  const [rows, setRows] = useState(1);
  const [activeChapter, setActiveChapter] = useState(0)
  const [ansNum, setAnsNum] = useState(null)
  const [sortedChaptersArr, setSortedChaptersArr] = useState([])
  const [sortedCommentsArr, setSortedCommentsArr] = useState([])
  const [bound, setBound] = useState(5)
  const [commentsToggle, setCommentsToggle] = useState(false);
  const [sharePopup, setSharePopup] = useState(false)

  const getUrl = (val) => {

    switch (val) {
      case 'fb':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
      case 'tw':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20this%20out!`
      case 'wp':
        return `https://api.whatsapp.com/send?text=Check%20this%20out:%20${encodeURIComponent(window.location.href)}`
      case 'vw':
        return `viber://forward?text=Check%20this%20out:%20${encodeURIComponent(window.location.href)}`
      case 'mw':
        return `fb-messenger://share?link=${encodeURIComponent(window.location.href)}`
      case 'mail':
        return `mailto:?subject=Check%20this%20out&body=I%20found%20this%20interesting:%20${encodeURIComponent(window.location.href)}`
      default: break;
    }
  }

  function copyLink() {
    const copyText = document.getElementById('shareLink');
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    alert.success('Link copied to clipboard');
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClick = () => {
    const qtnsContainer = document.getElementById('qtns-container');
    if (qtnsContainer) {
      qtnsContainer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setRows(rows + 1);
    } else if (event.key === 'Backspace') {
      const textarea = event.target;
      const lines = textarea.value.split('\n');
      if (lines[rows - 1] === '')
        setRows(rows > 1 ? rows - 1 : 1)
    }
  };

  const ansToggleHandler = (val) => {
    setAnsNum(val)
  }

  const commentSubmitHandler = () => {
    setIsCommentbox(!isCommentbox)
    const myForm = new FormData()
    myForm.set('text', text);
    myForm.set('subjectId', subjectDetails._id);
    myForm.set('chapterId', details._id);
    dispatch(addComment(myForm))
  }

  const hanldeCommentsToggle = () => {
    if (!commentsToggle) {
      setBound(details.comments.length)
      setCommentsToggle(true)
    } else {
      setBound(5)
      setCommentsToggle(false)
    }
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors())
      setErrorFlag(true)
    }
    if (details) {
      setActiveChapter(details.number - 1)
      setSortedCommentsArr([])
      if (details.comments && details.comments.length > 0) {
        const sortedComments = details.comments.slice().sort((a, b) => new Date(b.time) - new Date(a.time))
        setSortedCommentsArr(sortedComments)
      }
    }

    if (subjectDetails) {
      if (subjectDetails.chapters && subjectDetails.chapters.length > 0) {
        const sortedChapters = subjectDetails.chapters.slice().sort((a, b) => a.number - b.number)
        setSortedChaptersArr(sortedChapters)
      }
    }

    if (success) {
      alert.success("Comment added successfully")
      dispatch({ type: NEW_COMMENT_RESET })
      dispatch(getChapterDetails(level, subject, chapter))
    }

    if (commentError) {
      alert.error(commentError)
      dispatch({ type: CLEAR_ERRORS })
    }
  }, [dispatch, error, alert, details, subjectDetails, success, commentError, level, subject, chapter])

  useEffect(() => {
    dispatch(getSubjectDetails(level, subject))
    dispatch(getChapterDetails(level, subject, chapter))
    setErrorFlag(false)
    setIsMenuOpen(false)

  }, [dispatch, level, subject, chapter])


  return (
    <Fragment>
      {loading || cmtloading ?
        <Loader /> :
        !errorFlag ? (
          <Fragment>
            <div class={`share-popup-overlay ${sharePopup ? 'active' : 'inactive'}`}>
              <div class={`share-popup-box ${sharePopup ? 'active' : 'inactive'}`}>
                <span class="share-popup-close" onClick={() => setSharePopup(false)}>X</span>
                <div class="share-popup-title">Share this link via</div>

                <div class="share-popup-icons">
                  <a href={getUrl('fb')} target="_blank"
                    rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
                  <a href={getUrl('mw')} target="_blank"
                    rel="noopener noreferrer"><i class="fab fa-facebook-messenger"></i></a>
                  <a href={getUrl('vw')} target="_blank"
                    rel="noopener noreferrer" ><i class="fab fa-viber"></i></a>
                  <a href={getUrl('tw')} target="_blank"
                    rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
                  <a href={getUrl('wp')} target="_blank"
                    rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>
                  <a href={getUrl('mail')} target="_blank"
                    rel="noopener noreferrer"><i class="fas fa-envelope"></i></a>
                </div>

                <div class="share-popup-copy">
                  <input type="text" value="https://your-link-here.com" id="shareLink" readonly />
                  <button onClick={() => copyLink()}>Copy</button>
                </div>
              </div>
            </div>

            <div className="chapter-details">
              <div className="chapter-details-box">
                <div className={`chapter-details-menu ${isMenuOpen ? 'active' : 'inactive'}`}>
                  <div>
                    <Link to='/'><img src={logo} alt="" /></Link>
                  </div>
                  <div>
                    {
                      sortedChaptersArr &&
                      sortedChaptersArr.map((ch, index) => (
                        <Link to={`/semester/${level}/${subject}/${ch.name}`} className={activeChapter === index ? 'active-ch' : null}
                        ><SegmentIcon />{ch.name}</Link>
                      ))
                    }
                  </div>

                </div>
                <div className="chapter-details-content">
                  <div className='menu-bar'>
                    <MenuIcon onClick={toggleMenu} />
                    <input type="text" placeholder='Serach question . . .' />
                  </div>
                  <div className="top-content">
                    <div className="info">
                      <div className="info-left">
                        <h3>{details.name}</h3>
                        <p>By {details.provider}</p>
                        <div className="button" onClick={handleClick}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="M26.887 37.504c1.617 0 2.367-1.125 2.367-2.625v-.797c.047-3.094 1.172-4.383 4.922-6.96c4.008-2.72 6.562-5.86 6.562-10.384c0-7.031-5.718-11.062-12.82-11.062c-5.297 0-9.961 2.508-11.953 7.031c-.492 1.102-.703 2.18-.703 3.07c0 1.336.773 2.274 2.203 2.274c1.195 0 1.992-.703 2.344-1.852c1.218-4.453 4.148-6.14 7.945-6.14c4.57 0 8.133 2.578 8.133 6.656c0 3.351-2.086 5.226-5.086 7.336c-3.68 2.555-6.375 5.297-6.375 9.422v1.476c0 1.5.82 2.555 2.46 2.555m0 12.82c1.851 0 3.328-1.5 3.328-3.328a3.31 3.31 0 0 0-3.328-3.328c-1.828 0-3.352 1.477-3.352 3.328c0 1.828 1.524 3.328 3.352 3.328" /></svg>
                          <button  >Important Questions</button>
                        </div>

                      </div>
                      <div className="info-right">
                        <div onClick={() => setSharePopup(true)} className="button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363t.075-.337l-7.05-4.1q-.425.375-.95.588T6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.213t.95.587l7.05-4.1q-.05-.15-.075-.337T15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.212t-.95-.588L8.9 11.3q.05.15.075.338T9 12q0 .175-.025.363T8.9 12.7l7.05 4.1q.425-.375.95-.587T18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22" /></svg>
                          <button >Share</button>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="main-content">
                    <div className="read-pdf box">

                      <div className="pdf">{
                        <iframe src={details.file?.url} frameborder="0" title='chapter'>

                        </iframe>
                      }</div>

                      <div className="buttons">
                        {
                          activeChapter - 1 >= 0 ? <Link style={{ textDecoration: 'none' }} to={`/semester/${level}/${subject}/${sortedChaptersArr[activeChapter - 1].name}`}>
                            <div className='pre-btn'>
                              <button>Previous chapter</button>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42" /></svg>
                            </div>
                          </Link> : <div style={{ pointerEvents: 'none' }} className='pre-btn'>
                            <button>Finished</button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42" /></svg>
                          </div>
                        }
                        {
                          activeChapter + 1 < sortedChaptersArr.length ? <Link style={{ textDecoration: 'none' }} to={`/semester/${level}/${subject}/${sortedChaptersArr[activeChapter + 1].name}`}>
                            <div className='nxt-btn'>
                              <button>Next chapter</button>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42" /></svg>
                            </div></Link> :
                            <div style={{ pointerEvents: 'none' }} className='nxt-btn'>
                              <button>Finished</button>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42" /></svg>
                            </div>
                        }
                      </div>
                    </div>
                    <div id="qtns-container" className="imp-qtns box">
                      <h4>Important Questions</h4>
                      <div className='hr-bar'></div>
                      {
                        details.questions &&
                        <>
                          {details.questions.map((item, index) => (
                            <QuestionCard item={item} key={index} ansToggleHandler={ansToggleHandler} index={index} />
                          ))}

                          {details.questions.length > 5 && <div className='more-btn'>
                            <button>More</button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg>
                          </div>}
                        </>
                      }
                    </div>

                    <div className="comments box">
                      <h4>Comments</h4>
                      <div style={{ height: '1.5px' }} className='hr-bar'></div>
                      {
                        isAuthenticated ?
                          <div className="comment-box" style={{ paddingTop: '30px' }}>
                            <div className="profile" style={{ background: `url('${user.avatar.url}') center center / cover no-repeat` }}>
                            </div>
                            <div className="write-comment">
                              {
                                isCommentbox ?
                                  <Fragment>
                                    <p style={{ font: '200 15px interRegular', paddingBottom: '4px' }}>{user.username}</p>
                                    <p style={{ font: '200 13px interLight', paddingBottom: '4px' }}>@{user.username}</p>
                                  </Fragment>
                                  : <Fragment>
                                    <p onClick={() => setIsCommentbox(!isCommentbox)}>Add a comment</p>
                                    <div></div>
                                  </Fragment>

                              }
                            </div>

                          </div> :
                          <div className='log-in'>
                            <p >Please login to comment </p>
                            <Link to={'/login'}><LoginIcon />Login</Link>
                          </div>
                      }

                      {
                        isCommentbox ? <div className='w-c-box'>
                          <textarea
                            autoFocus
                            value={null}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            rows={rows}
                          />
                          <div className="buttons">
                            <button onClick={() => setIsCommentbox(!isCommentbox)}>Cancel</button>
                            <button onClick={() => commentSubmitHandler()} style={{ backgroundColor: text !== '' ? '#5967E5' : '#e7e3e3', color: text !== '' ? 'white' : '#575454' }}>Comment</button>
                          </div>
                        </div> : null
                      }

                      <div className="comments-container">
                        {sortedCommentsArr && sortedCommentsArr.length > 0 ?
                          <Fragment>
                            {sortedCommentsArr.map((itemComm, index) => (
                              index < bound &&
                              <CommentCard itemComm={itemComm} key={index} isAuthenticated={isAuthenticated} />
                            ))}


                            {
                              sortedCommentsArr.length > 5 ?
                                <Fragment>
                                  {
                                    commentsToggle ?
                                      <div className='all-comments' onClick={hanldeCommentsToggle}>
                                        <span>hide comments</span>
                                        <svg style={{ transform: `rotate(90deg)` }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg>
                                      </div> :
                                      <div className='all-comments' onClick={hanldeCommentsToggle}>
                                        <span>See all comments</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg>
                                      </div>
                                  }
                                </Fragment> : null

                            }
                          </Fragment> : <p className='no-comments'>No comments yet</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`ans-card ${ansNum !== null ? 'ans-active' : 'ans-inactive'}`}>
                <div className="ans-box-outer">
                  <div className='ans-box '>
                    <div className='top'>
                      <h3>Question's Answer</h3>
                      <svg onClick={() => ansToggleHandler(null)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" /><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" /></g></svg>
                    </div>
                    <div className='hr-line1'></div>
                    {
                      ansNum !== null &&
                      <p className='qtns'>{details.questions[ansNum].qtns}</p>
                    }
                    <div className='solution'>
                      <img src={solutionImg} alt="" />
                      <p>Solution</p>
                      <div className='hr-line2'></div>
                    </div>
                    {
                      ansNum !== null && active ?
                        <div className="answer">
                          {
                            details.questions[ansNum].answer ? <iframe src={details.questions[ansNum].answer?.url} frameborder="0" title='answer'>
                            </iframe> : <p style={{ color: '#BE0909' }}>** This question has not been answered yet **</p>
                          }

                        </div> :
                        <div className='bg-red-600 text-base p-4 mb-4 text-white grid place-items-center gap-4 '>
                          <p>You are using FREE plan. You can't access the question's answer in FREE plan. Please purchase one of the subscription plan to access the answer of this question.</p>
                          <button className='bg-secondary p-2 text-sm w-fit ' onClick={() => navigate('/subscription-plan')}>
                            View subscription plan</button>
                        </div>
                    }
                    <div className='hr-line1'></div>
                    <div class="buttons">
                      {
                        ansNum > 0 ?
                          <div className='pre-btn' onClick={() => ansToggleHandler(ansNum - 1)}>
                            <button>Previous</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg>
                          </div> : <div className='pre-btn' style={{ pointerEvents: 'none' }}>
                            <button>Finished</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg>
                          </div>
                      }

                      {
                        details.questions && ansNum < details.questions.length - 1 ?
                          <div className='nxt-btn' onClick={() => ansToggleHandler(ansNum + 1)}>
                            <button>Next</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg></div> :
                          <div className='nxt-btn' style={{ pointerEvents: 'none' }}>
                            <button>Finished</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg></div>
                      }
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </Fragment>) : <div className="outer-cover">
          <NotFound value={`Chapter  ' ${chapter} '`} from={'subject'} />
        </div>
      }
    </Fragment>

  );
};

export default ChapterDetails;
