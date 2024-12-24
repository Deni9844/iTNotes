import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useDispatch } from 'react-redux'
import {useAlert} from 'react-alert'
import './panel.css'
import { addNewChapter, deleteChapter, updateChapter } from '../../actions/adminAction.js'
const ChapterSection = ({ subjects, setPopupToggle, editedChapterObj, setEditedChapterObj,newChapterObj, setNewChapterObj, subjectCode,
    setSubjectCode,
    chapterObj, setChapterObj, level
}) => {
    const dispatch = useDispatch()
    const alert = useAlert()

    const [toggle, setToggle] = useState(false)
    const [newChPopup, setNewChPopup] = useState(false)
    const [editChPopup, setEditChPopup] = useState(false)
    const [deleteChPopup, setDeleteChPopup] = useState(false)
    const [permission, setPermission] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [choosedSub, setChoosedSub] = useState()
    const resultPerPage = 5



    const handleAction = (chObj) => {
        setPopupToggle(true);
        if (chObj) {
            setChapterObj(chObj)
            setEditedChapterObj({
                id:chObj._id || chObj.id,
                name: chObj.name,
                number: chObj.number,
                creditHrs: chObj.creditHrs,
                provider: chObj.provider,
                topic: chObj.topic,
                questions:chObj.questions,
                file: {
                    name:chObj.file.public_id? chObj.file.public_id.split('/')[4]+".pdf":chObj.file.name,
                    content: ""
                }
            })
        }
    }

    const handlePopupAction = (perm) => {
        setPermission(perm);
        setPopupToggle(false)
        setNewChPopup(false)
        setEditChPopup(false)
        setDeleteChPopup(false)
    }

    const handleEditFormSubmission = (e) => {
        e.preventDefault()
        if (!editedChapterObj.name || !editedChapterObj.number || !editedChapterObj.creditHrs || !editedChapterObj.provider || 
            !editedChapterObj.file || !editedChapterObj.topic) {
            alert.info("All fields are required. Please ensure no fields are left blank.");
            return;
        }
        handlePopupAction(false)
        const formData = new FormData();
        formData.append('name', editedChapterObj.name);
        formData.append('number', editedChapterObj.number);
        formData.append('creditHrs', editedChapterObj.creditHrs);
        formData.append('provider', editedChapterObj.provider);
        formData.append('topic', editedChapterObj.topic);
        formData.append('file',(editedChapterObj.file.name === (chapterObj.file.public_id? (chapterObj.file.public_id.split('/')[4] + ".pdf"):chapterObj.file.name))? "":editedChapterObj.file.content);
        formData.append('id', editedChapterObj.id);
        dispatch(updateChapter(choosedSub.semester, choosedSub.subject, chapterObj.name, formData))

    }

    const handleFormSubmission = (e) => {
        e.preventDefault()
        if (!newChapterObj.name || !newChapterObj.number || !newChapterObj.creditHrs || !newChapterObj.provider ||
            !newChapterObj.topic || !newChapterObj.file
         ) {
            alert.info("All fields are required. Please ensure no fields are left blank.");
            return;
        }
        handlePopupAction(false)
        const formData = new FormData();
        formData.append('name', newChapterObj.name);
        formData.append('number', newChapterObj.number);
        formData.append('creditHrs', newChapterObj.creditHrs);
        formData.append('provider', newChapterObj.provider);
        formData.append('topic', newChapterObj.topic);
        formData.append('file', newChapterObj.file.content);
        formData.append('id', chapterObj._id);
        dispatch(addNewChapter(choosedSub.semester, choosedSub.subject, formData))
    }

    const registerDataChange = (e) => {
        if (e.target.name === "file") {
            const readfile = e.target.files[0];

            newChPopup ? setNewChapterObj({
                ...newChapterObj, [e.target.name]: {
                    name: readfile?.name,
                    content: readfile
                }
            }) : setEditedChapterObj({
                ...editedChapterObj, [e.target.name]: {
                    name: readfile?.name,
                    content: readfile
                }
            })

        } else {
            newChPopup ?
                setNewChapterObj({ ...newChapterObj, [e.target.name]: e.target.value }) :
                setEditedChapterObj({ ...editedChapterObj, [e.target.name]: e.target.value })
        }
    };

    useEffect(() => {
        const sub = subjects.find(sub => sub.code === subjectCode)
        setChoosedSub(sub)
    
      }, [subjectCode,subjects])
    

   
    useEffect(() => {
        if (permission) {
            setPermission(false)
            dispatch(deleteChapter(level, choosedSub.subject, chapterObj.name))
        }

        if (currentPage > 1 && choosedSub && choosedSub.chapters && ((choosedSub.chapters.length - 1) < ((currentPage - 1) * 5))) {
            setCurrentPage(currentPage => currentPage - 1)
        }

    }, [permission, dispatch, chapterObj, choosedSub, level, currentPage])


    return (
        <div>

                <>
                    <div className='panel-bottom-outer first-more' >
                        <div className="panel-bottom">
                            <div className='head'>
                                <p className='first'>Chapters</p>
                                <div>
                                    <select onChange={(e) => setSubjectCode(e.target.value)} value={subjectCode}>
                                    <option value=''>Select Sub code</option>
                                        {
                                            subjects && subjects.map((sub, i) => (
                                                <option key={i} value={sub.code}>{sub.code}</option>
                                            ))
                                        }
                                    </select>
                                    <p style={{ display: choosedSub && choosedSub.chapters && choosedSub.chapters.length > 5 ? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                                        style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>
                                    <p className='secondary' style={{visibility:choosedSub?'visible':'hidden'}} onClick={() => { handleAction(); setNewChPopup(true) }}>Add New<svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor"
                                        d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" /></svg></p>
                                </div>
                            </div>

                            <div className="table first-more">
                                <div className='row'>
                                    <p>Ch no.</p>
                                    <p>Chapter</p>
                                    <p>Action</p>
                                </div>
                                {
                                    choosedSub && choosedSub.chapters && choosedSub.chapters.map((item, i) => (
                                        ((i >= (currentPage - 1) * 5 && i < (((currentPage - 1) * 5) + 5)) || toggle) && <div className='row' key={i}>
                                            <p>{item.number}</p>
                                            <p>{item.name}</p>
                                            <div>
                                                <p onClick={() => { handleAction(item); setEditChPopup(true) }}>Edit</p>
                                                <p onClick={() => { handleAction(item); setDeleteChPopup(true) }}>Delete</p>
                                            </div>
                                        </div>
                                    ))
                                }

                                {!toggle && choosedSub && choosedSub.chapters.length > resultPerPage && <div className="paginationBox">
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={resultPerPage}
                                        totalItemsCount={choosedSub.chapters.length}
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

                    {newChPopup &&
                        <div className='popup-box-outer'>
                            <div style={{ top: '46%' }} className="popup-box">
                                <p className='heading'>Add New Chapter</p>
                                <form onSubmit={handleFormSubmission}>
                                    <div className='input-field'>
                                        <label>Chapter:</label>
                                        <input
                                            type="Number"
                                            name='number'
                                            onChange={registerDataChange}
                                            required
                                            value={newChapterObj.number}
                                        />

                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            name='name'
                                            onChange={registerDataChange}
                                            required
                                            value={newChapterObj.name}
                                        />

                                        <label>CreditHrs:</label>
                                        <input
                                            type="Number"
                                            name='creditHrs'
                                            onChange={registerDataChange}
                                            required
                                            value={newChapterObj.creditHrs}
                                        />

                                        <label>Provider:</label>
                                        <input
                                            type="text"
                                            name='provider'
                                            onChange={registerDataChange}
                                            required
                                            value={newChapterObj.provider}
                                        />

                                        <label>Topic:</label>
                                        <input
                                            type="text"
                                            name='topic'
                                            onChange={registerDataChange}
                                            required
                                            value={newChapterObj.topic}
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
                                            <p>{newChapterObj?.file?.name}</p>
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

                    {editChPopup &&
                        <div className='popup-box-outer'>
                            <div style={{ top: '46%' }} className="popup-box">
                                <p className='heading'>Edit Chapter</p>
                                <form onSubmit={handleEditFormSubmission}>
                                    <div className='input-field'>
                                        <label>Chapter:</label>
                                        <input
                                            type="Number"
                                            name='number'
                                            onChange={registerDataChange}
                                            required
                                            value={editedChapterObj.number}
                                        />

                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            name='name'
                                            onChange={registerDataChange}
                                            required
                                            value={editedChapterObj.name}
                                        />

                                        <label>CreditHrs:</label>
                                        <input
                                            type="Number"
                                            name='creditHrs'
                                            onChange={registerDataChange}
                                            required
                                            value={editedChapterObj.creditHrs}
                                        />

                                        <label>Provider:</label>
                                        <input
                                            type="text"
                                            name='provider'
                                            onChange={registerDataChange}
                                            required
                                            value={editedChapterObj.provider}
                                        />

                                        <label>Topic:</label>
                                        <input
                                            type="text"
                                            name='topic'
                                            onChange={registerDataChange}
                                            required
                                            value={editedChapterObj.topic}
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
                                            <p>{editedChapterObj.file.name}</p>
                                        </div>
                                    </div>

                                    <div className="popup-btns edit">
                                        <button style={{
                                            backgroundColor: "#1CC17C",
                                            pointerEvents: (editedChapterObj.name === chapterObj.name) && (editedChapterObj.number === chapterObj.number)
                                                && (editedChapterObj.creditHrs === chapterObj.creditHrs) && (editedChapterObj.provider === chapterObj.provider)
                                                && (editedChapterObj.topic === chapterObj.topic) && (editedChapterObj.file.name === (chapterObj.file.public_id? (chapterObj.file.public_id.split('/')[4] + ".pdf"):chapterObj.file.name)) ? 'none' : ''
                                        }}

                                        >Edit</button>
                                        <button type='button' onClick={() => handlePopupAction(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }

                    {
                        deleteChPopup &&
                        <div className='popup-box-outer'>
                            <div className="popup-box">
                                <p>Are you sure want to delete subject <span>{chapterObj.name}</span>?</p>
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

export default ChapterSection
