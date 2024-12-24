import React, { Fragment, useEffect, useState } from 'react'
import './questions.css'
import './chapterDetails.css'
import { useSelector, useDispatch, } from 'react-redux'
import { clearErrors, getQuestion } from '../../actions/semesterAction.js'
import Loader from '../layout/Loader/Loader.js'
import QuestionSearchCard from './QuestionSearchCard.jsx'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import { subjects } from '../../data/data.js'
import { useNavigate } from 'react-router-dom'
import solutionImg from '../../images/solution.png'

const Questions = () => {
    const dispatch = useDispatch();
    const alert = useAlert()
    const navigate = useNavigate()

    const [sem, setSem] = useState('all')
    const [sub, setSub] = useState('all')
    const [ans, setAns] = useState('all')
    const [odr, setOdr] = useState('descending')
    const [filter, setFilter] = useState([])
    const [searchClick, setSearchClick] = useState(true)
    const [text, setText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [prevPage, setprevPage] = useState(currentPage)
    const [ansNum, setAnsNum] = useState(null)

    const { questions, loading, error, resultPerPage, filteredCount } = useSelector((state) => state.questions)
    const { active } = useSelector((state) => state.activePurchase)

    const handleSearch = () => {
        setSearchClick(true)
    }

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

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
    }, {
        title: "Answer",
        values: [{
            t: "All",
            val: "all"
        }, {
            t: "Has Answer",
            val: "hasAnswer"
        }, {
            t: "Not Answer",
            val: "hasNoAnswer"
        }]
    }, {
        title: "Order",
        values: [{
            t: "Newest",
            val: "descending"
        }, {
            t: "Oldest",
            val: "ascending"
        }]
    },]

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

    const handleAnsChange = (event) => {
        setAns(event.target.value)
    }

    const handleOdrChange = (event) => {
        setOdr(event.target.value)
    }

    const ansToggleHandler = (val) => {
        setAnsNum(val)
    }

    const handleSubPlanClick = () => {
        document.getElementById('root').style.position = "unset"
        navigate('/subscription-plan')
    }

    const handleKeyDown = (e) => {
      if(e.key === 'Enter'){
        handleSearch()
      }
    }


    useEffect(() => {
        if (searchClick || currentPage !== prevPage) {
            const dataForm = new FormData()
            dataForm.set('semester', sem);
            dataForm.set('subject', sub);
            dataForm.set('order', odr);
            dataForm.set('answer', ans);
            dataForm.set('page', currentPage);
            const resText = text.trim();
            dispatch(getQuestion(dataForm, resText))
            setSearchClick(false);
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Optional: Smooth scrolling animation
            });

            if (currentPage !== prevPage) setprevPage(currentPage)
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }
    }, [searchClick, error, alert, dispatch, odr, sem, sub, ans, text, currentPage, prevPage])

    useEffect(() => {
        if (ansNum !== null) {
            document.getElementById('root').style.position = "fixed"
           
        } else {
            document.getElementById('root').style.position = "unset"
        }
    }, [ansNum])

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
        <Fragment>
            {
                loading || !filter ?
                    <Loader /> : <Fragment>
                        <div className="cover">
                            <h2>Questions</h2>
                            <p>Ask Any Questions from TU CSIT syllabus</p>
                            <div className="qtns-search">
                                <input type='text' placeholder='Search Questions...'
                                    onChange={(e) => setText(e.target.value)} value={text} 
                                    onKeyDown={handleKeyDown}/>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M11 2a9 9 0 1 0 5.618 16.032l3.675 3.675a1 1 0 0 0 1.414-1.414l-3.675-3.675A9 9 0 0 0 11 2m-6 9a6 6 0 1 1 12 0a6 6 0 0 1-12 0" clipRule="evenodd" /></svg>
                                <button onClick={handleSearch}>Search</button>
                            </div>
                        </div>

                        <div className="outer-qtns">
                            <div className='qtns-container'>
                                <div className="selection">

                                    <p>Search</p>
                                    <div className='dashed'>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <input type="text" onChange={(e) => setText(e.target.value)} value={text} /><br />
                                    <p>Semester</p>
                                    <div className='dashed'>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <select onChange={handleSemChange} value={sem}>
                                        {
                                            filter[0] && filter[0].values.map((item, index) => (
                                                <option key={index} value={item.val}>{item.t}</option>
                                            ))
                                        }
                                    </select>

                                    <p>Subject</p>
                                    <div className='dashed'>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <select onChange={handleSubChange} value={sub}>
                                        {
                                            filter[1] && filter[1].values.map((item, index) => (
                                                <option key={index} value={item.val}>{item.t}</option>
                                            ))
                                        }
                                    </select>

                                    <p>Answer</p>
                                    <div className='dashed'>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <select onChange={handleAnsChange} value={ans}>
                                        {
                                            filter[2] && filter[2].values.map((item, index) => (
                                                <option key={index} value={item.val}>{item.t}</option>
                                            ))
                                        }
                                    </select>

                                    <p>Order</p>
                                    <div className='dashed'>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <select onChange={handleOdrChange} value={odr}>
                                        {
                                            filter[3] && filter[3].values.map((item, index) => (
                                                <option key={index} value={item.val}>{item.t}</option>
                                            ))
                                        }
                                    </select>

                                    <button onClick={handleSearch}>Search</button>
                                </div>

                                <div className="qtns">
                                    {
                                        questions.length > 0 ? questions.map((item, index) => (
                                            <QuestionSearchCard item={item} key={index} ansToggleHandler={ansToggleHandler}
                                                index={index} />
                                        )) : <p id='no-result' >No result found !!</p>
                                    }
                                    {filteredCount > resultPerPage && <div className="paginationBox">
                                        <Pagination
                                            activePage={currentPage}
                                            itemsCountPerPage={resultPerPage}
                                            totalItemsCount={filteredCount}
                                            onChange={setCurrentPageNo}
                                            nextPageText="Next"
                                            prevPageText="Prev"
                                            firstPageText="1st"
                                            lastPageText="Last"
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            activeClass="pageItemActive"
                                            activeLinkClass="pageLinkActive"
                                        />
                                    </div>}
                                </div>
                            </div>

                        </div>

                        <div className={`ans-card ${ansNum !== null ? 'ans-active' : 'ans-inactive'}`} style={{ height: ansNum === null ? '0px' : '100vh' }}>
                            <div className="ans-box-outer">
                                <div className='ans-box '>
                                    <div className='top'>
                                        <h3>Question's Answer</h3>
                                        <svg onClick={() => ansToggleHandler(null)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" /><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" /></g></svg>
                                    </div>
                                    <div className='hr-line1'></div>
                                    {
                                        ansNum !== null &&
                                        <p className='qtns'>{questions[ansNum].qtns}</p>
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
                                                    questions[ansNum].answer ? <iframe src={questions[ansNum].answer?.url} frameborder="0" title='answer'>
                                                    </iframe> : <p style={{ color: '#BE0909' }}>** This question has not been answered yet **</p>
                                                }

                                            </div> :
                                            <div className='bg-red-600 text-base p-4 mb-4 text-white grid place-items-center gap-4 '>
                                                <p>You are using FREE plan. You can't access the question's answer in FREE plan. Please purchase one of the subscription plan to access the answer of this question.</p>
                                                <button className='bg-secondary p-2 text-sm w-fit ' onClick={handleSubPlanClick}>
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
                                            questions && ansNum < questions.length - 1 ?
                                                <div className='nxt-btn' onClick={() => ansToggleHandler(ansNum + 1)}>
                                                    <button>Next</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg></div> :
                                                <div className='nxt-btn' style={{ pointerEvents: 'none' }}>
                                                    <button>Finished</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg></div>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Fragment>
            }


        </Fragment>
    )
}

export default Questions
