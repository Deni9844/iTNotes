import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useDispatch } from 'react-redux'
import {useAlert} from 'react-alert'
import './panel.css'
import { addNewQuestion, deleteQuestion, updateQuestion } from '../../actions/adminAction.js'
const QuestionSection = ({ subjects, setPopupToggle, editedQuestionObj, setEditedQuestionObj, newQuestionObj, setNewQuestionObj, qtnSubCode,
    setQtnSubCode, questionObj, setQuestionObj, level, qtnChName, setQtnChName
}) => {
    const alert = useAlert()
    const dispatch = useDispatch()

    const [toggle, setToggle] = useState(false)
    const [newQtnPopup, setNewQtnPopup] = useState(false)
    const [editQtnPopup, setEditQtnPopup] = useState(false)
    const [deleteQtnPopup, setDeleteQtnPopup] = useState(false)
    const [permission, setPermission] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [choosedSub, setChoosedSub] = useState("")
    const [qtnCh, setQtnCh] = useState("")
    const resultPerPage = 5

    const handleAction = (qtnObj) => {
        setPopupToggle(true);
        if (qtnObj) {
            setQuestionObj({...qtnObj,})
            setEditedQuestionObj({
                id: qtnObj._id || qtnObj.id,
                qtns: qtnObj.qtns,
                askedOn: qtnObj.askedOn,
                file: {
                    name: qtnObj.answer ? qtnObj.answer.public_id.split('/')[4] + ".pdf" : qtnObj.file?.name,
                    content: ""
                }
            })
        }
    }

    const handlePopupAction = (perm) => {
        setPermission(perm);
        setPopupToggle(false)
        setNewQtnPopup(false)
        setEditQtnPopup(false)
        setDeleteQtnPopup(false)
    }

    const handleEditFormSubmission = (e) => {
        e.preventDefault()
        if (!editedQuestionObj.qtns ) {
            alert.info("Provide the question");
            return;     
        }
        handlePopupAction(false)
        const formData = new FormData();
        formData.append('qtns', editedQuestionObj.qtns);
        formData.append('askedOn', editedQuestionObj.askedOn);
        formData.append('file', (editedQuestionObj.file.name === (questionObj.answer ? (questionObj.answer.public_id.split('/')[4] + ".pdf") : questionObj.file?.name)) ? "" : editedQuestionObj.file.content);
        dispatch(updateQuestion(choosedSub.semester, choosedSub.subject, qtnChName, editedQuestionObj.id, formData))

    }

    const handleFormSubmission = (e) => {
        e.preventDefault()
        if (!newQuestionObj.qtn) {
            alert.info("Provide the question");
            return;
        }
        handlePopupAction(false)
        const formData = new FormData();
        formData.append('qtn', newQuestionObj.qtn);
        formData.append('askedOn', newQuestionObj.askedOn);
        formData.append('file', newQuestionObj.file?.content);
        dispatch(addNewQuestion(choosedSub.semester, choosedSub.subject, qtnChName, formData))
    }

    const registerDataChange = (e) => {
        if (e.target.name === "file") {
            const readfile = e.target.files[0];

            newQtnPopup ? setNewQuestionObj({
                ...newQuestionObj, [e.target.name]: {
                    name: readfile?.name,
                    content: readfile
                }
            }) : setEditedQuestionObj({
                ...editedQuestionObj, [e.target.name]: {
                    name: readfile?.name,
                    content: readfile
                }
            })

        } else {
            newQtnPopup ?
                setNewQuestionObj({ ...newQuestionObj, [e.target.name]: e.target.value }) :
                setEditedQuestionObj({ ...editedQuestionObj, [e.target.name]: e.target.value })
        }
    };

    useEffect(() => {
        const sub = subjects.find(sub => sub.code === qtnSubCode)
        setChoosedSub(sub)
    }, [qtnSubCode,subjects])

    useEffect(() => {
        if (choosedSub) {
            const ch = choosedSub.chapters.find(ch => ch.name === qtnChName)
            setQtnCh(ch)
        }

    }, [qtnChName, choosedSub])


    useEffect(() => {
        if (permission) {
            setPermission(false)
            dispatch(deleteQuestion(level, choosedSub.subject, qtnChName, questionObj._id || questionObj.id ))
        }

        if (currentPage > 1 && qtnCh && qtnCh.questions?.length && ((qtnCh.questions?.length - 1) < ((currentPage - 1) * 5))) {
            setCurrentPage(currentPage => currentPage - 1)
        }

    }, [permission, dispatch, questionObj, choosedSub, level, currentPage,qtnChName,qtnCh])


    return (
        <div>

            <>
                <div className='panel-bottom-outer first-more' >
                    <div className="panel-bottom">
                        <div className='head'>
                            <p className='first'>Questions</p>
                            <div>
                                <select onChange={(e) => setQtnSubCode(e.target.value)} value={qtnSubCode}>
                                    <option value=''>Select Sub code</option>
                                    {
                                        subjects && subjects.map((sub, i) => (
                                            <option key={i} value={sub.code}>{sub.code}</option>
                                        ))
                                    }
                                </select>
                                <select onChange={(e) => setQtnChName(e.target.value)} value={qtnChName}>
                                    <option value=''>Select Ch no.</option>
                                    {
                                        choosedSub && choosedSub.chapters.map((ch, i) => (
                                            <option key={i} value={ch.name}>{ch.number}</option>
                                        ))
                                    }
                                </select>

                                <p style={{ display: qtnCh && qtnCh.questions?.length > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                                    style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>

                                <p className='secondary' style={{visibility:choosedSub && qtnChName?'visible':'hidden'}} onClick={() => { handleAction(); setNewQtnPopup(true) }}>Add New<svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor"
                                    d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" /></svg></p>
                            </div>
                        </div>

                        <div className="table first-more">
                            <div className='row'>
                                <p>Asked on</p>
                                <p>Question</p>
                                <p>Action</p>
                            </div>
                            {
                                qtnCh && qtnCh.questions?.map((item, i) => (
                                    ((i >= (currentPage - 1) * 5 && i < (((currentPage - 1) * 5) + 5)) || toggle) && <div className='row' key={i}>
                                        <p>{item.askedOn}</p>
                                        <p>{item.qtns}</p>
                                        <div>
                                            <p onClick={() => { handleAction(item); setEditQtnPopup(true) }}>Edit</p>
                                            <p onClick={() => { handleAction(item); setDeleteQtnPopup(true) }}>Delete</p>
                                        </div>
                                    </div>
                                ))
                            }

                            {!toggle && qtnCh && qtnCh.questions?.length > resultPerPage && <div className="paginationBox">
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={resultPerPage}
                                    totalItemsCount={qtnCh.questions?.length}
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

                {newQtnPopup &&
                    <div className='popup-box-outer'>
                        <div style={{ top: '46%' }} className="popup-box">
                            <p className='heading'>Add New Question</p>
                            <form onSubmit={handleFormSubmission}>
                                <div className='input-field'>
                                    <label>Question:</label>
                                    <input
                                        type="text"
                                        name='qtn'
                                        onChange={registerDataChange}
                                        required
                                        value={newQuestionObj.qtns}
                                    />

                                    <label>Asked on:</label>
                                    <input
                                        type="Number"
                                        name='askedOn'
                                        onChange={registerDataChange}
                                        value={newQuestionObj.askedOn}
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
                                        <p>{newQuestionObj?.file?.name}</p>
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

                {editQtnPopup &&
                    <div className='popup-box-outer'>
                        <div style={{ top: '46%' }} className="popup-box">
                            <p className='heading'>Edit Question</p>
                            <form onSubmit={handleEditFormSubmission}>
                                <div className='input-field'>
                                    <label>Question:</label>
                                    <input
                                        type="text"
                                        name='qtns'
                                        onChange={registerDataChange}
                                        required
                                        value={editedQuestionObj.qtns}
                                    />

                                    <label>Asked on:</label>
                                    <input
                                        type="Number"
                                        name='askedOn'
                                        onChange={registerDataChange}
                                        value={editedQuestionObj.askedOn}
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
                                        <p>{editedQuestionObj.file.name}</p>
                                    </div>
                                </div>

                                <div className="popup-btns edit">
                                    <button style={{
                                        backgroundColor: "#1CC17C",
                                        pointerEvents: (editedQuestionObj.qtns === questionObj.qtns) && (editedQuestionObj.askedOn?.toString() === (questionObj.askedOn?.toString() || ""))
                                            && (editedQuestionObj.file?.name === (questionObj.answer ? (questionObj.answer.public_id.split('/')[4] + ".pdf") : questionObj.file?.name)) ? 'none' : ''
                                    }}

                                    >Edit</button>
                                    <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }

                {
                    deleteQtnPopup &&
                    <div className='popup-box-outer'>
                        <div className="popup-box">
                            <p>Are you sure want to delete question <span>{questionObj.qtns}</span>?</p>
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

export default QuestionSection
