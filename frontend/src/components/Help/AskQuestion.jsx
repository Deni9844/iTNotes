import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader.js'
import { useSelector, useDispatch } from 'react-redux'
import './ASkQuestion.css'
import { askQuestion, clearAdminError } from '../../actions/adminAction.js'
import { NEW_QUERY_RESET } from '../../constants/adminConstants.js'
import { subjects } from '../../data/data.js'

const AskQuestion = () => {
    const dispatch = useDispatch();
    const alert = useAlert()
    const [sem, setSem] = useState('all')
    const [sub, setSub] = useState('all')
    const [filter, setFilter] = useState([])
    const [rows, setRows] = useState(1);
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [file, setFile] = useState([]);

    const { loading, error, isQueryAdded } = useSelector((state) => state.new)


    const filterData = [{
        title: "Semester",
        values: [{
            t: "All Semester",
            val: "all"
        }, {
            t: "First Semester",
            val: "first"
        }, {
            t: "Second Semester",
            val: "second"
        }, {
            t: "Third Semester",
            val: "third"
        }, {
            t: "Fourth Semester",
            val: "fourth"
        }, {
            t: "Fifth Semester",
            val: "fifth"
        }, {
            t: "Sixth Semester",
            val: "sixth"
        }, {
            t: "Seventh Semester",
            val: "seventh"
        }, {
            t: "Eight Semester",
            val: "eight"
        }]
    }, {
        title: "Subject",
        values: []
    }]

    const setSemSubjects = (str) => {
        filterData[1].values.push({ val: "all", t: "All Subjects" })
        const allSubjects = str.split("|");
        allSubjects.map((item) => (
            filterData[1].values.push({ val: item, t: item })
        ))
    }

    const handleSemChange = (event) => {
        setSem(event.target.value);
    }

    const handleSubChange = (event) => {
        setSub(event.target.value)
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

    const registerDataChange = (e) => {

        const files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prevImages) => [...prevImages, reader.result]);
                setFile((prevFile) => [...prevFile, files[i]])

            };
            reader.readAsDataURL(files[i]);
        }
    }

    const handleImgRemove = (imgInd) => {
        // Remove the image preview
        setImages((prevImages) => (
            prevImages.filter((img, ind) => ind !== imgInd)
        ))

        //Remove the actual file
        setFile((prevFile) => (
            prevFile.filter((img, ind) => ind !== imgInd)
        ))
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (sub === "all") {
            alert.info("Subject is required");
            return;
        }
        if (sem === "all") {
            alert.info("Semester is required");
            return;
        }

        if (!text && !images.length) {
            alert.info("Question or question related image is required");
            return;
        }

        const formData = new FormData()
        formData.append("subject", sub)
        formData.append("semester", sem)
        formData.append("question", text)

        //append each file individually
        file.forEach((f) => {
            formData.append("file", f);
        });
        dispatch(askQuestion(formData))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearAdminError())
        }
        if (isQueryAdded) {
            alert.success("Question submitted successfully")
            dispatch({ type: NEW_QUERY_RESET })
            setText('')
            setImages([])
            setSem('all')
            setSub('all')
        }

        if (loading) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Optional: Smooth scrolling animation
            });
        }
    }, [alert, dispatch, isQueryAdded, error, loading])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: Smooth scrolling animation
        });
    }, [])

    useEffect(() => {
        switch (sem) {
            case 'all':
                let allSubStr = subjects.sem1 + subjects.sem2 + subjects.sem3 + subjects.sem4 +
                    subjects.sem5 + subjects.sem6 + subjects.sem7 + subjects.sem8;
                setSemSubjects(allSubStr)
                break;
            case 'first':
                setSemSubjects(subjects.sem1)
                break;
            case 'second':
                setSemSubjects(subjects.sem2)
                break;
            case 'third':
                setSemSubjects(subjects.sem3)
                break;
            case 'fourth':
                setSemSubjects(subjects.sem4)
                break;
            case 'fifth':
                setSemSubjects(subjects.sem5)
                break;
            case 'sixth':
                setSemSubjects(subjects.sem6)
                break;
            case 'seventh':
                setSemSubjects(subjects.sem7)
                break;
            case 'eight':
                setSemSubjects(subjects.sem8)
                break;
            default: break
        }
        setFilter(filterData)
        setSub(filterData[1].values[0].val)
    }, [sem])
    return (
        <div>
            {
                loading ? <Loader /> :
                    <>
                        <div className="cover">
                            <h2>Ask Question</h2>
                            <p>Page {'>>'} Help {'>>'}  Ask Question</p>
                        </div>
                        <div className="ask-question-outer">
                            <div className="ask-question">
                                <div className="ask-question-left">
                                    <h2>Ask Question</h2>
                                    <p>If you have any question related to subjects of CSIT then fell free to ask us.
                                        We are always ready to address your queries.</p>
                                    <form onSubmit={handleFormSubmit}>
                                        <textarea
                                            value={null}
                                            onChange={handleChange}
                                            onKeyDown={handleKeyPress}
                                            rows={rows}
                                            placeholder="Write a question..." />

                                        {
                                            images && images.map((img, i) => (
                                                <div style={{
                                                    position: 'relative', width: 'fit-content', margin: '6px',
                                                    display: 'inline-flex', border: '4px solid white'
                                                }}>
                                                    <svg className='cross-icon' onClick={() => handleImgRemove(i)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27" /></svg>
                                                    <img src={img} alt="" style={{ height: '200px' }} />
                                                </div>
                                            ))
                                        }

                                        <div id='imgQtn' onClick={() => document.getElementById('img').click()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M4.502 9a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" /><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773l3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" /></g></svg>
                                        </div>

                                        <input
                                            id='img'
                                            type="file"
                                            name="imgQ"
                                            accept="image/*"
                                            multiple
                                            onChange={registerDataChange}
                                            style={{ display: 'none' }}
                                        />
                                        <div className='hr-line'></div>

                                        <div className="selectGrp">

                                            <div className='select' >
                                                <select onChange={handleSemChange} value={sem}>
                                                    {
                                                        filter[0] && filter[0].values.map((item, index) => (
                                                            <option key={index} value={item.val}>{item.t}</option>
                                                        ))
                                                    }
                                                </select >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z" /></svg>
                                            </div>

                                            <div className='select'>
                                                <select onChange={handleSubChange} value={sub}>
                                                    {
                                                        filter[1] && filter[1].values.map((item, index) => (
                                                            <option key={index} value={item.val}>{item.t}</option>
                                                        ))
                                                    }
                                                </select>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z" /></svg>
                                            </div>
                                        </div>

                                        <div className="button" onClick={() => document.getElementById('submit').click()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M27.71 4.29a1 1 0 0 0-1.05-.23l-22 8a1 1 0 0 0 0 1.87l8.59 3.43L19.59 11L21 12.41l-6.37 6.37l3.44 8.59A1 1 0 0 0 19 28a1 1 0 0 0 .92-.66l8-22a1 1 0 0 0-.21-1.05" /></svg>
                                            <span>Submit Question</span>
                                            <input id='submit' type="submit" value="Submit Question" style={{ display: 'none' }} />
                                        </div>
                                    </form>
                                </div>
                                <div className="ask-question-right">
                                    <div className="question">
                                        <div className='svg'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z" /></svg>
                                        </div>
                                        <div>
                                            <h3>Question</h3>
                                            <p>Your Question must be clear otherwise rejected.</p>
                                        </div>
                                    </div>

                                    <div className="image">
                                        <div className='svg'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M4.502 9a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" /><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773l3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" /></g></svg>
                                        </div>
                                        <div>
                                            <h3>Images</h3>
                                            <p>Can upload multiple images of maximum size of 2MB each.</p>
                                        </div>
                                    </div>

                                    <div className="pdf">
                                        <div className='svg'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4zM790.2 326L602 137.8V326zM633.22 637.26c-15.18-.5-31.32.67-49.65 2.96c-24.3-14.99-40.66-35.58-52.28-65.83l1.07-4.38l1.24-5.18c4.3-18.13 6.61-31.36 7.3-44.7c.52-10.07-.04-19.36-1.83-27.97c-3.3-18.59-16.45-29.46-33.02-30.13c-15.45-.63-29.65 8-33.28 21.37c-5.91 21.62-2.45 50.07 10.08 98.59c-15.96 38.05-37.05 82.66-51.2 107.54c-18.89 9.74-33.6 18.6-45.96 28.42c-16.3 12.97-26.48 26.3-29.28 40.3c-1.36 6.49.69 14.97 5.36 21.92c5.3 7.88 13.28 13 22.85 13.74c24.15 1.87 53.83-23.03 86.6-79.26c3.29-1.1 6.77-2.26 11.02-3.7l11.9-4.02c7.53-2.54 12.99-4.36 18.39-6.11c23.4-7.62 41.1-12.43 57.2-15.17c27.98 14.98 60.32 24.8 82.1 24.8c17.98 0 30.13-9.32 34.52-23.99c3.85-12.88.8-27.82-7.48-36.08c-8.56-8.41-24.3-12.43-45.65-13.12M385.23 765.68v-.36l.13-.34a55 55 0 0 1 5.6-10.76c4.28-6.58 10.17-13.5 17.47-20.87c3.92-3.95 8-7.8 12.79-12.12c1.07-.96 7.91-7.05 9.19-8.25l11.17-10.4l-8.12 12.93c-12.32 19.64-23.46 33.78-33 43c-3.51 3.4-6.6 5.9-9.1 7.51a16.4 16.4 0 0 1-2.61 1.42c-.41.17-.77.27-1.13.3a2.2 2.2 0 0 1-1.12-.15a2.07 2.07 0 0 1-1.27-1.91M511.17 547.4l-2.26 4l-1.4-4.38c-3.1-9.83-5.38-24.64-6.01-38c-.72-15.2.49-24.32 5.29-24.32c6.74 0 9.83 10.8 10.07 27.05c.22 14.28-2.03 29.14-5.7 35.65zm-5.81 58.46l1.53-4.05l2.09 3.8c11.69 21.24 26.86 38.96 43.54 51.31l3.6 2.66l-4.39.9c-16.33 3.38-31.54 8.46-52.34 16.85c2.17-.88-21.62 8.86-27.64 11.17l-5.25 2.01l2.8-4.88c12.35-21.5 23.76-47.32 36.05-79.77zm157.62 76.26c-7.86 3.1-24.78.33-54.57-12.39l-7.56-3.22l8.2-.6c23.3-1.73 39.8-.45 49.42 3.07c4.1 1.5 6.83 3.39 8.04 5.55a4.64 4.64 0 0 1-1.36 6.31a6.7 6.7 0 0 1-2.17 1.28" /></svg>
                                        </div>
                                        <div>
                                            <h3>PDF File</h3>
                                            <p>PDF File is not supported while asking question.</p>
                                        </div>
                                    </div>

                                    <div className="email">
                                        <div className='svg'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m21.84 8.561l-.09-.36a5.115 5.115 0 0 0-.47-1a4.75 4.75 0 0 0-1.82-1.74l-5.25-2.84a4.8 4.8 0 0 0-4.51 0l-5.25 2.84a4.75 4.75 0 0 0-1.82 1.74a4.33 4.33 0 0 0-.46 1v.14A4.62 4.62 0 0 0 2 9.571v7.62a4.76 4.76 0 0 0 4.75 4.75h10.5a4.75 4.75 0 0 0 4.75-4.75v-7.63a4.788 4.788 0 0 0-.16-1m-8.26 3.35a3.3 3.3 0 0 1-3.25 0L3.8 8.131c.03-.076.067-.15.11-.22a3.25 3.25 0 0 1 1.25-1.19l5.25-2.84a3.2 3.2 0 0 1 1.54-.39a3.24 3.24 0 0 1 1.55.39l5.25 2.84a3.22 3.22 0 0 1 1.4 1.5z" /></svg>
                                        </div>
                                        <div>
                                            <h3>Email</h3>
                                            <p>You will receive an email when your question will be answered.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default AskQuestion
