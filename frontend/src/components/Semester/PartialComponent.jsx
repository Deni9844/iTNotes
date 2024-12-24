import React, { Fragment, useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { addReply, likeUnlike } from '../../actions/userActon.js';
import { addNoticeReply, noticeCmtlikeUnlike } from '../../actions/noticeAction.js';
import { addArticleReply, articleCmtlikeUnlike } from '../../actions/articleAction.js';

const PartialComponent = ({ item, isAuthenticated, from, itemComm, forCmp }) => {

    const dispatch = useDispatch()

    const { details } = useSelector((state) => state.chapter)
    const { details: subjectDetails } = useSelector((state) => state.subject)
    const { user } = useSelector((state) => state.user)
    const { notice } = useSelector((state) => state.notice)
    const { article } = useSelector((state) => state.article)

    const [toggleLike, settoggleLike] = useState(null);
    const [toggleUnlike, settoggleUnlike] = useState(null);
    const [isEnabled, setIsEnabled] = useState(true);
    const [status, setStatus] = useState('d-like');
    const [isCommentbox, setIsCommentbox] = useState(false);
    const [text, setText] = useState(from === 'rpy' ? `@${item.name} ` : '');
    const [rows, setRows] = useState(1);

    const handleLike = (val) => {
        if (isAuthenticated) {
            const preVal = status
            console.log(`val = ${val} & prev = ${status}`)
            setStatus(val)
            const data = {
                like: { value: 0 },
                unlike: { value: 0 },
                subjectId: subjectDetails._id,
                chapterId: details._id
            };

            const noticeData = {
                like: { value: 0 },
                unlike: { value: 0 },
                noticeId: notice._id
            };

            const articleData = {
                like: { value: 0 },
                unlike: { value: 0 },
                articleId: article._id
            };

            if (val === 'e-like') {
                data.like.value = 1;
                noticeData.like.value = 1;
                articleData.like.value = 1;
                settoggleLike(prev => prev + 1)
                console.log("e-like")
                if (preVal === 'e-unlike')
                    settoggleUnlike(prev => prev > 0 ? prev - 1 : 0)
            } else if (val === 'e-unlike') {
                settoggleUnlike(prev => prev + 1)
                data.unlike.value = 1;
                noticeData.unlike.value = 1;
                articleData.unlike.value = 1;
                if (preVal === 'e-like')
                    settoggleLike(prev => prev > 0 ? prev - 1 : 0)

            } else if (val === 'd-like') {
                settoggleLike(prev => prev - 1)
            } else {
                settoggleUnlike(prev => prev - 1)
            }

            if (forCmp === 'nd')
                dispatch(noticeCmtlikeUnlike(noticeData, itemComm._id, from === "rpy" ? item._id : null))
            else if (forCmp === 'ad')
                dispatch(articleCmtlikeUnlike(articleData, itemComm._id, from === "rpy" ? item._id : null))
            else
                dispatch(likeUnlike(data, itemComm._id, from === "rpy" ? item._id : null))
        }

    }


    const handleChange = (event) => {
        const text = event.target.value
        setText(text);

    };


    const handleKeyPress = (event) => {
        const textarea = event.target;
        const cursorPosition = textarea.selectionStart;
        const cursorEndPosition = textarea.selectionEnd;
        const nonDeletableStart = item.name.length + 2;

        if (from === 'rpy' && cursorPosition <= nonDeletableStart) {
            textarea.selectionStart = textarea.value.length;
        }

        if (event.key === 'Backspace') {
            if (from === 'rpy') {
                if (textarea.value.length === item.name.length + 2) {
                    event.preventDefault()
                } else if ((cursorEndPosition - cursorPosition) > 0)
                    textarea.selectionStart = cursorPosition > (item.name.length + 2) ? cursorPosition : (item.name.length + 2);
            }

            //if both start and end cursor position is at same position
            if ((cursorEndPosition - cursorPosition) === 0) {
                const lines = textarea.value.split('\n');
                if (lines[rows - 1] === '')
                    setRows(rows > 1 ? rows - 1 : 1)
            } else {
                //if specific area of text is selected
                const text = textarea.value.substring(cursorPosition, cursorEndPosition);
                const lines = text.split('\n');

                setRows(rows > 1 ? rows - (lines.length - 1) : 1)
            }
        }

        if (event.key === 'Enter') {
            setRows(rows + 1);
        }
    };

    const handleReplyClick = () => {
        const textarea = document.getElementById(`textarea-${item._id}`);
        setIsCommentbox(true);
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = from === 'rpy' ? item.name.length + 2 : 0;
            textarea.selectionEnd = from === 'rpy' ? item.name.length + 2 : 0;
        }, 0);

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

    const commentSubmitHandler = () => {
        setIsCommentbox(false)
        if (forCmp === 'nd') {
            const data = {
                noticeId: notice._id,
                text: text
            }
            dispatch(addNoticeReply(data, itemComm._id))
        } if (forCmp === 'ad') {
            const data = {
                articleId: article._id,
                text: text
            }
            dispatch(addArticleReply(data, itemComm._id))
        } else {
            const myForm = new FormData()
            myForm.set('text', text);
            myForm.set('subjectId', subjectDetails._id);
            myForm.set('chapterId', details._id);
            dispatch(addReply(myForm, itemComm._id))
        }
    }

    useEffect(() => {
        settoggleLike(item.like.value)
        settoggleUnlike(item.unlike.value)
    },[item])


    useEffect(() => {
        if (isAuthenticated) {
            const hasLiked = item.like.users.some((u) => u.user === user._id)
            if (hasLiked) {
                setStatus('e-like')
            }

            const hasUnliked = item.unlike.users.some((u) => u.user === user._id)
            if (hasUnliked) {
                setStatus('e-unlike')
            }
        } else {
            setIsEnabled(false)
        }
    }, [isAuthenticated, item.like, item.unlike, user])


    return (
        <Fragment>
            {
                (toggleLike !== null && toggleUnlike !== null) &&
                <div>
                    <p>{item.name} <span className='time'>{getTimeAgo(item.time)}</span> </p>
                    <p>{item.text}</p>
                    {status === 'e-like' ? <svg style={{ pointerEvents: isEnabled ? 'auto' : 'none' }} onClick={() => handleLike('d-like')} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20.27 16.265l.705-4.08a1.666 1.666 0 0 0-1.64-1.95h-5.181a.833.833 0 0 1-.822-.969l.663-4.045a4.783 4.783 0 0 0-.09-1.973a1.635 1.635 0 0 0-1.092-1.137l-.145-.047a1.346 1.346 0 0 0-.994.068c-.34.164-.588.463-.68.818l-.476 1.834a7.628 7.628 0 0 1-.656 1.679c-.415.777-1.057 1.4-1.725 1.975l-1.439 1.24a1.67 1.67 0 0 0-.572 1.406l.812 9.393A1.666 1.666 0 0 0 8.597 22h4.648c3.482 0 6.453-2.426 7.025-5.735" /><path fill="currentColor" fill-rule="evenodd" d="M2.968 9.485a.75.75 0 0 1 .78.685l.97 11.236a1.237 1.237 0 1 1-2.468.107V10.234a.75.75 0 0 1 .718-.749" clip-rule="evenodd" /></svg> :
                        <svg style={{ pointerEvents: isEnabled ? 'auto' : 'none' }} onClick={() => handleLike('e-like')} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20.975 12.185l-.739-.128zm-.705 4.08l-.74-.128zM6.938 20.477l-.747.065zm-.812-9.393l.747-.064zm7.869-5.863l.74.122zm-.663 4.045l.74.121zm-6.634.411l-.49-.568zm1.439-1.24l.49.569zm2.381-3.653l-.726-.189zm.476-1.834l.726.188zm1.674-.886l-.23.714zm.145.047l.229-.714zM9.862 6.463l.662.353zm4.043-3.215l-.726.188zm-2.23-1.116l-.326-.675zM3.971 21.471l-.748.064zM3 10.234l.747-.064a.75.75 0 0 0-1.497.064zm17.236 1.823l-.705 4.08l1.478.256l.705-4.08zm-6.991 9.193H8.596v1.5h4.649zm-5.56-.837l-.812-9.393l-1.495.129l.813 9.393zm11.846-4.276c-.507 2.93-3.15 5.113-6.286 5.113v1.5c3.826 0 7.126-2.669 7.764-6.357zM13.255 5.1l-.663 4.045l1.48.242l.663-4.044zm-6.067 5.146l1.438-1.24l-.979-1.136L6.21 9.11zm4.056-5.274l.476-1.834l-1.452-.376l-.476 1.833zm1.194-2.194l.145.047l.459-1.428l-.145-.047zm-1.915 4.038a8.378 8.378 0 0 0 .721-1.844l-1.452-.377A6.878 6.878 0 0 1 9.2 6.11zm2.06-3.991a.885.885 0 0 1 .596.61l1.452-.376a2.385 2.385 0 0 0-1.589-1.662zm-.863.313a.515.515 0 0 1 .28-.33l-.651-1.351c-.532.256-.932.73-1.081 1.305zm.28-.33a.596.596 0 0 1 .438-.03l.459-1.428a2.096 2.096 0 0 0-1.548.107zm2.154 8.176h5.18v-1.5h-5.18zM4.719 21.406L3.747 10.17l-1.494.129l.971 11.236zm-.969.107V10.234h-1.5v11.279zm-.526.022a.263.263 0 0 1 .263-.285v1.5c.726 0 1.294-.622 1.232-1.344zM14.735 5.343a5.533 5.533 0 0 0-.104-2.284l-1.452.377a4.03 4.03 0 0 1 .076 1.664zM8.596 21.25a.916.916 0 0 1-.911-.837l-1.494.129a2.416 2.416 0 0 0 2.405 2.208zm.03-12.244c.68-.586 1.413-1.283 1.898-2.19L9.2 6.109c-.346.649-.897 1.196-1.553 1.76zm13.088 3.307a2.416 2.416 0 0 0-2.38-2.829v1.5c.567 0 1 .512.902 1.073zM3.487 21.25c.146 0 .263.118.263.263h-1.5c0 .682.553 1.237 1.237 1.237zm9.105-12.105a1.583 1.583 0 0 0 1.562 1.84v-1.5a.083.083 0 0 1-.082-.098zm-5.72 1.875a.918.918 0 0 1 .316-.774l-.98-1.137a2.418 2.418 0 0 0-.83 2.04z" /></svg>
                    }
                    <span>{toggleLike}</span>
                    <div style={{ display: 'inline-flex' }}>
                        {status === 'e-unlike' ? <svg style={{ transform: 'rotate(180deg)', pointerEvents: isEnabled ? 'auto' : 'none' }} onClick={() => handleLike('d-unlike')} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20.27 16.265l.705-4.08a1.666 1.666 0 0 0-1.64-1.95h-5.181a.833.833 0 0 1-.822-.969l.663-4.045a4.783 4.783 0 0 0-.09-1.973a1.635 1.635 0 0 0-1.092-1.137l-.145-.047a1.346 1.346 0 0 0-.994.068c-.34.164-.588.463-.68.818l-.476 1.834a7.628 7.628 0 0 1-.656 1.679c-.415.777-1.057 1.4-1.725 1.975l-1.439 1.24a1.67 1.67 0 0 0-.572 1.406l.812 9.393A1.666 1.666 0 0 0 8.597 22h4.648c3.482 0 6.453-2.426 7.025-5.735" /><path fill="currentColor" fill-rule="evenodd" d="M2.968 9.485a.75.75 0 0 1 .78.685l.97 11.236a1.237 1.237 0 1 1-2.468.107V10.234a.75.75 0 0 1 .718-.749" clip-rule="evenodd" /></svg> :
                            <svg style={{ transform: 'rotate(180deg)', pointerEvents: isEnabled ? 'auto' : 'none' }} onClick={() => handleLike('e-unlike')} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20.975 12.185l-.739-.128zm-.705 4.08l-.74-.128zM6.938 20.477l-.747.065zm-.812-9.393l.747-.064zm7.869-5.863l.74.122zm-.663 4.045l.74.121zm-6.634.411l-.49-.568zm1.439-1.24l.49.569zm2.381-3.653l-.726-.189zm.476-1.834l.726.188zm1.674-.886l-.23.714zm.145.047l.229-.714zM9.862 6.463l.662.353zm4.043-3.215l-.726.188zm-2.23-1.116l-.326-.675zM3.971 21.471l-.748.064zM3 10.234l.747-.064a.75.75 0 0 0-1.497.064zm17.236 1.823l-.705 4.08l1.478.256l.705-4.08zm-6.991 9.193H8.596v1.5h4.649zm-5.56-.837l-.812-9.393l-1.495.129l.813 9.393zm11.846-4.276c-.507 2.93-3.15 5.113-6.286 5.113v1.5c3.826 0 7.126-2.669 7.764-6.357zM13.255 5.1l-.663 4.045l1.48.242l.663-4.044zm-6.067 5.146l1.438-1.24l-.979-1.136L6.21 9.11zm4.056-5.274l.476-1.834l-1.452-.376l-.476 1.833zm1.194-2.194l.145.047l.459-1.428l-.145-.047zm-1.915 4.038a8.378 8.378 0 0 0 .721-1.844l-1.452-.377A6.878 6.878 0 0 1 9.2 6.11zm2.06-3.991a.885.885 0 0 1 .596.61l1.452-.376a2.385 2.385 0 0 0-1.589-1.662zm-.863.313a.515.515 0 0 1 .28-.33l-.651-1.351c-.532.256-.932.73-1.081 1.305zm.28-.33a.596.596 0 0 1 .438-.03l.459-1.428a2.096 2.096 0 0 0-1.548.107zm2.154 8.176h5.18v-1.5h-5.18zM4.719 21.406L3.747 10.17l-1.494.129l.971 11.236zm-.969.107V10.234h-1.5v11.279zm-.526.022a.263.263 0 0 1 .263-.285v1.5c.726 0 1.294-.622 1.232-1.344zM14.735 5.343a5.533 5.533 0 0 0-.104-2.284l-1.452.377a4.03 4.03 0 0 1 .076 1.664zM8.596 21.25a.916.916 0 0 1-.911-.837l-1.494.129a2.416 2.416 0 0 0 2.405 2.208zm.03-12.244c.68-.586 1.413-1.283 1.898-2.19L9.2 6.109c-.346.649-.897 1.196-1.553 1.76zm13.088 3.307a2.416 2.416 0 0 0-2.38-2.829v1.5c.567 0 1 .512.902 1.073zM3.487 21.25c.146 0 .263.118.263.263h-1.5c0 .682.553 1.237 1.237 1.237zm9.105-12.105a1.583 1.583 0 0 0 1.562 1.84v-1.5a.083.083 0 0 1-.082-.098zm-5.72 1.875a.918.918 0 0 1 .316-.774l-.98-1.137a2.418 2.418 0 0 0-.83 2.04z" /></svg>
                        }
                        <span style={{ paddingLeft: '2px' }}>{toggleUnlike}</span>
                    </div>
                    {
                        isAuthenticated &&
                        <span onClick={() => handleReplyClick()} className='reply'>Reply</span>
                    }

                    <div className='w-c-box' style={{ display: isCommentbox ? 'block' : 'none' }}>
                        <textarea
                            id={`textarea-${item._id}`}
                            value={text}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            rows={rows}

                        />
                        <div className="buttons">
                            <button onClick={() => { setIsCommentbox(false); setText(`@${item.name} `); setRows(1) }}>Cancel</button>
                            <button onClick={() => commentSubmitHandler()} style={{ backgroundColor: text !== '' ? '#5967E5' : '#e7e3e3', color: text !== '' ? 'white' : '#575454' }}>Comment</button>
                        </div>
                    </div>

                </div>
            }
        </Fragment>
    )
}

export default PartialComponent
