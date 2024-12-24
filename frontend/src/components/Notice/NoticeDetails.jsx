import React, { Fragment, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CommentCard from '../Semester/CommentCard'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { addNoticeComment, getAllNotices, getNotice, placeNoticeLikeUnlike } from '../../actions/noticeAction'
import { CLEAR_ERRORS } from '../../constants/noticeConstant'
import Loader from '../layout/Loader/Loader'
import moment from 'moment'
import LoginIcon from '@mui/icons-material/Login';
import { NEW_COMMENT_RESET } from '../../constants/userConstants'

const NoticeDetails = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const alert = useAlert()

    const [sortedCommentsArr, setSortedCommentsArr] = useState([])
    const [bound, setBound] = useState(5)
    const [commentsToggle, setCommentsToggle] = useState(false);
    const [isCommentbox, setIsCommentbox] = useState(false);
    const [text, setText] = useState('');
    const [rows, setRows] = useState(1);
    const [toggle, setToggle] = useState('none');
    const [totalLike, setTotalLike] = useState();
    const [totalUnlike, setTotalUnlike] = useState();



    const { notice, loading, error } = useSelector((state) => state.notice)
    const { notices } = useSelector((state) => state.notices)
    const { isAuthenticated, user } = useSelector((state) => state.user)
    const { success, error: commentError } = useSelector((state) => state.newComment)

    const hanldeCommentsToggle = () => {
        if (!commentsToggle) {
              setBound(notice.comments.length)
            setCommentsToggle(true)
        } else {
            setBound(5)
            setCommentsToggle(false)
        }
    }

    const commentSubmitHandler = () => {
        setIsCommentbox(!isCommentbox)
        const data = {
            noticeId : id,
            text:text
        }
        dispatch(addNoticeComment(data))
    }

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

    const handelNoticeLikeUnlike = (like, unlike) => {
        if(!user) return alert.error("Please login to submit vote")
        const data = {
            like, unlike
        }

        if ((toggle === 'like' && like === 1) | (toggle === 'unlike' && unlike === 1)) return alert.error("you have already submitted vote")

        dispatch(placeNoticeLikeUnlike(id, data))

        if (like) {
            setTotalLike(totalLike + 1)
            if (toggle === 'unlike') setTotalUnlike(totalUnlike > 0 ? totalUnlike - 1:0)
            setToggle('like')
        } else if (unlike) {
            setTotalUnlike(totalUnlike + 1)
            if (toggle === 'like') setTotalLike(totalLike > 0 ? totalLike - 1 : 0)
            setToggle('unlike')
        }

    }


    const getTimeAgo = (datetime) => {
        const currentTime = moment();
        const postTime = moment(datetime);
        const diffYears = currentTime.diff(postTime, 'years');

        if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        } else {
            return postTime.fromNow();
        }
    };

    useEffect(() => {
        dispatch(getNotice(id))
        if (!notices.length)
            dispatch(getAllNotices(1))
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
        setToggle('none')

    }, [dispatch, id, notices])

    useEffect(() => {
        setSortedCommentsArr([])
        if (error) {
            alert.error(error)
            dispatch({ type: CLEAR_ERRORS })
        }

        if (notice.comments && notice.comments.length > 0) {
            const sortedComments = notice.comments.slice().sort((a, b) => new Date(b.time) - new Date(a.time))
            setSortedCommentsArr(sortedComments)
        }

        if (notice.like) {
            setTotalLike(notice.like.total)
            setTotalUnlike(notice.unlike.total)
        }

        if (notice.like && user) {
            const hasLiked = notice.like.users.some((u) => u.id === user._id)
            if (hasLiked) {
                setToggle('like')
            }
            const hasUnLiked = notice.unlike.users.some((u) => u.id === user._id)
            if (hasUnLiked) {
                setToggle('unlike')
            }
        }

    }, [error, alert, dispatch, notice, loading])

    useEffect(() => {
        if (success) {
            alert.success("Comment added successfully")
            dispatch({ type: NEW_COMMENT_RESET })
            dispatch(getNotice(id))
        }

        if (commentError) {
            alert.error(commentError)
            dispatch({ type: CLEAR_ERRORS })
        }
    }, [dispatch,alert,success,commentError,id])
    return (
        <Fragment>
            {
                loading ? <Loader /> : (
                    <Fragment>
                        <div className="cover">
                            <h2>Notices</h2>
                            <p>Page {'>>'} Notices {'>>'} Notice</p>
                        </div>
                        <div className="outer-notices notice-details-container">
                            <div className="notice-details-container-left">
                                <h2>{notice.title}</h2>
                                <div className='notice-details'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="12" cy="6" r="4" fill="currentColor" /><path fill="currentColor" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5" /></svg>
                                        <p>{notice.provider}</p>
                                    </div>
                                    <div>
                                        <svg style={{ fontSize: '18px' }} xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1em" viewBox="0 0 640 512"><path fill="currentColor" d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5.4-.9.7-1.1.8l-.2.2C1 327.2-1.4 334.4.8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352m240-176c0 112.3-99.1 196.9-216.5 207c24.3 74.4 104.9 129 200.5 129c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1.6 10.3.6 15.5z" /></svg>
                                        {
                                            notice.comments && <p>{notice.comments.length} comments</p>
                                        }
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1" /></g></svg>
                                        <p>{getTimeAgo(notice.createdAt)}</p>
                                    </div>
                                    <div style={{ cursor: 'pointer' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92c1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92" /></svg>
                                        <p>Share</p>
                                    </div>

                                </div>
                                <div className="read-notice">
                                    Read pdf
                                </div>
                                <div className="like-unlike">
                                    <div className="like" onClick={(e) => handelNoticeLikeUnlike(1, 0)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M1.36 9.495v7.157h3.03l.153.018c2.813.656 4.677 1.129 5.606 1.422c1.234.389 1.694.484 2.531.54c.626.043 1.337-.198 1.661-.528c.179-.182.313-.556.366-1.136a.681.681 0 0 1 .406-.563c.249-.108.456-.284.629-.54c.16-.234.264-.67.283-1.301a.682.682 0 0 1 .339-.57c.582-.337.87-.717.93-1.163c.066-.493-.094-1.048-.513-1.68a.683.683 0 0 1 .176-.936c.401-.282.621-.674.676-1.23c.088-.886-.477-1.541-1.756-1.672a9.42 9.42 0 0 0-3.394.283a.68.68 0 0 1-.786-.95c.5-1.058.778-1.931.843-2.607c.085-.897-.122-1.547-.606-2.083c-.367-.406-.954-.638-1.174-.59c-.29.062-.479.23-.725.818c-.145.348-.215.644-.335 1.335c-.115.656-.178.952-.309 1.34c-.395 1.176-1.364 2.395-2.665 3.236a11.877 11.877 0 0 1-2.937 1.37a.676.676 0 0 1-.2.03zm-.042 8.52c-.323.009-.613-.063-.856-.233c-.31-.217-.456-.559-.459-.953l.003-7.323c-.034-.39.081-.748.353-1.014c.255-.25.588-.368.94-.36h2.185A10.505 10.505 0 0 0 5.99 6.95c1.048-.678 1.82-1.65 2.115-2.526c.101-.302.155-.552.257-1.14c.138-.789.224-1.156.422-1.628c.41-.982.948-1.462 1.69-1.623c.73-.158 1.793.263 2.465 1.007c.745.824 1.074 1.855.952 3.129c-.052.548-.204 1.161-.454 1.844a10.509 10.509 0 0 1 2.578-.056c2.007.205 3.134 1.512 2.97 3.164c-.072.712-.33 1.317-.769 1.792c.369.711.516 1.414.424 2.1c-.106.79-.546 1.448-1.278 1.959c-.057.693-.216 1.246-.498 1.66a2.87 2.87 0 0 1-.851.834c-.108.684-.335 1.219-.706 1.595c-.615.626-1.714.999-2.718.931c-.953-.064-1.517-.18-2.847-.6c-.877-.277-2.693-.737-5.43-1.377zm1.701-8.831a.68.68 0 0 1 .68-.682a.68.68 0 0 1 .678.682v7.678a.68.68 0 0 1-.679.681a.68.68 0 0 1-.679-.681z" /></svg>
                                        <span>{totalLike}</span>
                                    </div>
                                    <div className="unlike" onClick={(e) => handelNoticeLikeUnlike(0, 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M1.36 9.495v7.157h3.03l.153.018c2.813.656 4.677 1.129 5.606 1.422c1.234.389 1.694.484 2.531.54c.626.043 1.337-.198 1.661-.528c.179-.182.313-.556.366-1.136a.681.681 0 0 1 .406-.563c.249-.108.456-.284.629-.54c.16-.234.264-.67.283-1.301a.682.682 0 0 1 .339-.57c.582-.337.87-.717.93-1.163c.066-.493-.094-1.048-.513-1.68a.683.683 0 0 1 .176-.936c.401-.282.621-.674.676-1.23c.088-.886-.477-1.541-1.756-1.672a9.42 9.42 0 0 0-3.394.283a.68.68 0 0 1-.786-.95c.5-1.058.778-1.931.843-2.607c.085-.897-.122-1.547-.606-2.083c-.367-.406-.954-.638-1.174-.59c-.29.062-.479.23-.725.818c-.145.348-.215.644-.335 1.335c-.115.656-.178.952-.309 1.34c-.395 1.176-1.364 2.395-2.665 3.236a11.877 11.877 0 0 1-2.937 1.37a.676.676 0 0 1-.2.03zm-.042 8.52c-.323.009-.613-.063-.856-.233c-.31-.217-.456-.559-.459-.953l.003-7.323c-.034-.39.081-.748.353-1.014c.255-.25.588-.368.94-.36h2.185A10.505 10.505 0 0 0 5.99 6.95c1.048-.678 1.82-1.65 2.115-2.526c.101-.302.155-.552.257-1.14c.138-.789.224-1.156.422-1.628c.41-.982.948-1.462 1.69-1.623c.73-.158 1.793.263 2.465 1.007c.745.824 1.074 1.855.952 3.129c-.052.548-.204 1.161-.454 1.844a10.509 10.509 0 0 1 2.578-.056c2.007.205 3.134 1.512 2.97 3.164c-.072.712-.33 1.317-.769 1.792c.369.711.516 1.414.424 2.1c-.106.79-.546 1.448-1.278 1.959c-.057.693-.216 1.246-.498 1.66a2.87 2.87 0 0 1-.851.834c-.108.684-.335 1.219-.706 1.595c-.615.626-1.714.999-2.718.931c-.953-.064-1.517-.18-2.847-.6c-.877-.277-2.693-.737-5.43-1.377zm1.701-8.831a.68.68 0 0 1 .68-.682a.68.68 0 0 1 .678.682v7.678a.68.68 0 0 1-.679.681a.68.68 0 0 1-.679-.681z" /></svg>

                                        <span>{totalUnlike}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="notice-details-container-right">
                                <p className='other-nt'>Other Notices</p>
                                <div class="dashed"><div></div><div></div></div>
                                {notices && notices.slice(0, 10).filter(item => item._id !== id).map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Link to={`/notice/${item._id}`}>
                                                <p>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0" /></svg>
                                                    {item.title}
                                                </p>
                                            </Link>
                                            <div className="hr-line"></div>
                                        </Fragment>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="outer-notices" style={{ paddingTop: '0', paddingBottom: '70px' }}>
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
                                                <CommentCard itemComm={itemComm} key={index} isAuthenticated={isAuthenticated} forCmp="nd"/>
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
                    </Fragment>
                )
            }

        </Fragment >
    )
}

export default NoticeDetails
