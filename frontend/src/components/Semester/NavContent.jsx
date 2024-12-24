import React, { Fragment, useEffect, useState } from 'react'
import ChaptersCard from './ChaptersCard.jsx'
import { Link, useNavigate } from 'react-router-dom'
import NotFound from './NotFound.jsx'
import solutionImg from '../../images/solution.png'
import './notFound.css'
import Pagination from 'react-js-pagination'
import { useSelector } from 'react-redux'

const NavContent = ({ item, sub }) => {
  let referenceBooksArr = []

  const { chapters, subject, syllabus, code, semester, qtnsBank, labReport, viva, book } = sub

  const [questionBank, setQuestionBank] = useState("")

  const [qtnsBankArr, setQtnsBankAArr] = useState([])

  const [chaptersArr, setChaptersArr] = useState([])

  const [flattenedArr, setFlattenedArr] = useState([])
  const [ansNum, setAnsNum] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const {active} = useSelector((state) => state.activePurchase)

  const navigate = useNavigate();
  let shortForm = "";
  const resultPerPage = 6


  const RomanObj = [{
    value: 'first',
    roman: 'I'
  }, {
    value: 'second',
    roman: 'II'
  }, {
    value: 'third',
    roman: 'III'
  }, {
    value: 'fourth',
    roman: 'IV'
  }, {
    value: 'fifth',
    roman: 'V'
  }, {
    value: 'sixth',
    roman: 'VI'
  }, {
    value: 'seventh',
    roman: 'VII'
  }, {
    value: 'eight',
    roman: 'VIII'
  },]

  const ansToggleHandler = (val) => {
    setAnsNum(val)
  }


  const getRomanValue = () => {
    const res = RomanObj.find((obj) => obj.value.toLowerCase() === semester.toLowerCase())
    return res.roman
  }

  const getAllReferenceBooks = (str) => {
    referenceBooksArr = str.split("|")
  }

  const getShortForm = (name) => {
    const words = name.split(" ")
    words.map((word, index) => (
      shortForm += word.charAt(0)
    ))

  }

  const handleSubPlanClick = () => {
    document.getElementById('root').style.position = "unset"
    navigate('/subscription-plan')
  }

  useEffect(() => {
    if (qtnsBank && qtnsBank.length > 0) {
      const sortedQtnsBankArr = qtnsBank.slice().sort((a, b) => b.year - a.year)
      setQtnsBankAArr(sortedQtnsBankArr)
      setQuestionBank(sortedQtnsBankArr[0].file.url)
    }

    if (chapters && chapters.length > 0) {
      const sortedChapters = chapters.slice().sort((a, b) => a.number - b.number)
      setChaptersArr(sortedChapters)

      const flattenedArr = []
      chapters.map((ch) => (
        ch.questions.map((qtn) => (
          flattenedArr.push(qtn)
        ))
      ))
      setFlattenedArr(flattenedArr)
    }
  }, [qtnsBank, chapters])


  useEffect(() => {
    if (ansNum !== null) {
      document.getElementById('root').style.position = "fixed"
    } else {
      document.getElementById('root').style.position = "unset"
    }
  }, [ansNum])
  return (
    <Fragment>

      {item === 'chapters' &&
        <div className="cs-container chapters-container" style={{ display: chaptersArr.length === 0 ? 'block' : 'grid' }}>
          {
            chaptersArr.length > 0 ? (
              chaptersArr && chaptersArr.map((ele, index) => (
                <ChaptersCard item={ele} key={index} level={semester} subject={subject} />
              ))
            ) :
              <NotFound value={'Chapters'} />
          }
        </div>}

      {item === 'syllabus' && <div className="max-width syllabus-container">
        {
          syllabus ? <Fragment>
            <h4 className='heading'>Tribhuvan University<br />Institute of Science and Technology<br />
              Bachelor of Science in Computer Science and Information Technology</h4>
            <div className="details">
              <div>
                <p>Course Title: {subject} </p>
                <p>Course no: {code} </p>
                <p>Semester: {getRomanValue()} </p>
                <p>Nature of course: Theory + Lab </p>
              </div>
              <div>
                <p>Full Marks: {syllabus.fullMarks} </p>
                <p>Pass Marks: {syllabus.passMarks}</p>
                <p>Credit Hours: 3 </p>
              </div>
            </div>
            <div className="chapters">
              <p className='course'><span>Course Description: </span>{syllabus.courseDescription}</p>
              <p className='course'><span>Course Objective: </span>{syllabus.courseObjective}</p>
              <h3>Course Contents: </h3>
              {
                chapters && chapters.map((item, index) => (
                  <Link><h4>Unit {index + 1}. {item.name}</h4>
                    <p>{item.topic}</p></Link>
                ))
              }
            </div>
            <div className="others">
              {
                syllabus.labWorks && <>
                  <h3>Laboratory Works</h3>
                  <p>{syllabus.labWorks}</p>
                </>
              }

              {
                syllabus.textBook && <>
                  <h3>Text Books</h3>
                  <p>{syllabus.textBook}</p>
                </>
              }

              {
                syllabus.referenceBooks && <>
                  <h3>Reference Books</h3>
                  {getAllReferenceBooks(syllabus.referenceBooks)}
                  {
                    referenceBooksArr.map((item, index) => (
                      <p>{index + 1}. {item}  </p>
                    ))

                  }
                </>
              }
            </div>
          </Fragment> : <NotFound value={'Syllabus'} />
        }
      </div>}

      {item === 'question-bank' && <div className={`max-width ${qtnsBankArr.length > 0 ? 'question-bank-container' : null}`}>
        {getShortForm(subject)}
        {
          qtnsBankArr.length > 0 ?
            <>
              <div className="years">
                <p>Exam Year</p>
                {
                  qtnsBankArr.map((item) => (
                    <p onClick={() => setQuestionBank(item.file.url)}>{shortForm} Question {item.year}</p>
                  ))}
              </div>
              <div className='pdf-outer'>
                <div className='pdf'>
                  <iframe src={questionBank} frameborder="0" title='Qtn-bank'>

                  </iframe>
                </div>
              </div>
            </> : <NotFound value={'Question Bank'} />
        }
      </div>}

      {item === 'questions' && <div className="max-width questions-container">
        {
          flattenedArr.length > 0 ?
            <>
              {
                flattenedArr.map((qtn, i) => (
                  (i >= (currentPage - 1) * 6 && i < (((currentPage - 1) * 6) + 6)) &&
                  <div className='question-box' onClick={() => (setAnsNum(i))}>
                    <div className="image">
                      <img alt="" style={{ background: `url(${qtn.provider.url}) center center / cover no-repeat` }} />
                    </div>
                    <div className="details">
                      <p className="question">{qtn.qtns}</p>
                      <div>
                        <p style={{ backgroundColor: qtn.answer?.url ? '#5967E5' : '#9017bacc' }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M437.3 30L202.7 339.3L64 200.7l-64 64L213.3 478L512 94z" /></svg>{qtn.answer?.url ? "Answered" : "Not Answerd"}</p>
                        <p style={{ color: qtn.askedOn ? "initial" : "unset" }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 3h2v18H4zm14 0H7v18h11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-2 6h-6V8h6zm0-2h-6V6h6z" /></svg>{subject}</p>
                        {qtn.askedOn &&
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.89 15.89 0 0 0-5.46-12A143 143 0 0 0 202.24 74m279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.31 143.31 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61"></path></svg>Asked on {qtn.askedOn} Exam</p>}

                      </div>
                    </div>
                  </div>
                ))
              }

            </> : <NotFound value={'Questions'} />
        }

        {flattenedArr && flattenedArr.length > resultPerPage && <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={flattenedArr.length}
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

      </div>}


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
              <p className='qtns'>{flattenedArr[ansNum].qtns}</p>
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
                  flattenedArr[ansNum].answer ? <iframe src={flattenedArr[ansNum].answer?.url} frameborder="0" title='answer'>
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
                flattenedArr && ansNum < flattenedArr.length - 1 ?
                  <div className='nxt-btn' onClick={() => ansToggleHandler(ansNum + 1)}>
                    <button>Next</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg></div> :
                  <div className='nxt-btn' style={{ pointerEvents: 'none' }}>
                    <button>Finished</button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"></path></svg></div>
              }
            </div>

          </div>
        </div>
      </div>

      {item === 'text-book' | item === 'practical' | item === 'viva' ?
        <div className="max-width others-conatiner">
          {book && item === 'text-book' ? (
            <div className='pdf-outer other'>
              <div className='pdf'>
                <iframe src={book.file?.url} frameborder="0" title='text book'>

                </iframe>
              </div>
            </div>) : labReport && item === 'practical' ? (
              <div className='pdf-outer other'>
                <div className='pdf'>
                  <iframe src={labReport.file?.url} frameborder="0" title='Practical'>

                  </iframe>
                </div>
              </div>) : viva && item === 'viva' ? (
                <div className='pdf-outer other'>
                  <div className='pdf'>
                    <iframe src={viva.file?.url} frameborder="0" title='Viva'>

                    </iframe>
                  </div>
                </div>) :
            <NotFound value={item === 'text-book' ? 'Text Book' : item === 'practical' ? 'Practical File' : 'VIVA Questions'} />
          }
        </div> : null
      }


    </Fragment>
  )
}

export default NavContent
