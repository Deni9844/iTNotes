import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import coverImg from '../../images/subjectCove.png'
import './Chapter.css'
import NavContent from './NavContent.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { clearErrors, getSubjectDetails } from '../../actions/semesterAction.js'
import Loader from '../layout/Loader/Loader.js'
import NotFound from './NotFound.jsx'

const Chapter = () => {
  const { level, subject } = useParams();

  const [value, setValue] = useState('chapters')

  const [errorFlag, setErrorFlag] = useState(false)

  const dispatch = useDispatch();

  const alert = useAlert()

  const { details, error, loading } = useSelector((state) => state.subject)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors())
      setErrorFlag(true)
    }
  }, [dispatch, error, alert])

  useEffect(() => {
    dispatch(getSubjectDetails(level, subject))
    window.scroll({
      top: 0,
  })
    setErrorFlag(false)
  }, [dispatch, level, subject])

  const handleClick = (val) => {
    setValue(val);
  }
  return (
    <Fragment>
      {
        loading ? (
          <Loader />
        ) : (<Fragment>
          {
            !errorFlag ?
              <Fragment>
                <div className="chapter-outer">
                  <div className="chapter-cover">
                    <div className="chapter-cover-left">
                      <img src={coverImg} alt="" />
                    </div>
                    <div className="chapter-cover-right">
                      <p>Subject</p>
                      <h3>{subject}</h3>
                      <p>{details.description}</p>
                    </div>
                  </div>
                </div>
                <div className="chapter-content-outer">
                  <div className="chapter-content">
                    <div className="chapter-navbar">
                      <div className={`chapters ${value === 'chapters' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('chapters')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" fill-rule="evenodd" d="M10 36a3 3 0 1 1 0 6a3 3 0 0 1 0-6m35.998 1c1.106 0 2.002.888 2.002 2c0 1.105-.89 2-2.002 2H18.002A1.996 1.996 0 0 1 16 39c0-1.105.89-2 2.002-2zM10 26a3 3 0 1 1 0 6a3 3 0 0 1 0-6m35.998 1c1.106 0 2.002.888 2.002 2c0 1.105-.89 2-2.002 2H18.002A1.996 1.996 0 0 1 16 29c0-1.105.89-2 2.002-2zM10 16a3 3 0 1 1 0 6a3 3 0 0 1 0-6m35.998 1c1.106 0 2.002.888 2.002 2c0 1.105-.89 2-2.002 2H18.002A1.996 1.996 0 0 1 16 19c0-1.105.89-2 2.002-2z" /></svg>
                        <p>Chapters</p>
                      </div>

                      <div className={`syllabus ${value === 'syllabus' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('syllabus')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M24 21v23c-3.291-4-13.371-4-18-4V18c9.874 0 16.114 2 18 3m0 0v23c3.291-4 13.371-4 18-4V18c-9.874 0-16.114 2-18 3" /><circle cx="24" cy="12" r="8" /></g></svg>
                        <p>Syllabus</p>
                      </div>

                      <div className={`question-bank ${value === 'question-bank' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('question-bank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M186.2 139.6h139.6V0H186.2zM372.4 0v139.6H512V0zM0 139.6h139.6V0H0zm186.2 186.2h139.6V186.2H186.2zm186.2 0H512V186.2H372.4zM0 325.8h139.6V186.2H0zM186.2 512h139.6V372.4H186.2zm186.2 0H512V372.4H372.4zM0 512h139.6V372.4H0z" /></svg>
                        <p>Question Bank</p>
                      </div>

                      <div className={`questions ${value === 'questions' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('questions')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12m8-48.72v.72a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8c13.23 0 24-9 24-20s-10.77-20-24-20s-24 9-24 20v4a8 8 0 0 1-16 0v-4c0-19.85 17.94-36 40-36s40 16.15 40 36c0 17.38-13.76 31.93-32 35.28" /></svg>
                        <p>Questions</p>
                      </div>

                      <div className={`text-book ${value === 'text-book' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('text-book')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 6.59c-1.333-.726-2.667-1.09-4-1.09s-2.667.364-4 1.09v9.91c1.333-.667 2.667-1 4-1s2.667.333 4 1z" /><path d="M16.556 7.788c-.685-.192-1.37-.288-2.056-.288s-1.37.096-2.056.288m4.112 2c-.685-.192-1.37-.288-2.056-.288s-1.37.096-2.056.288m4.112 2c-.685-.192-1.37-.288-2.056-.288s-1.37.096-2.056.288m4.112 2c-.685-.192-1.37-.288-2.056-.288s-1.37.096-2.056.288m-3.888-6C7.87 7.596 7.186 7.5 6.5 7.5s-1.37.096-2.056.288m4.112 2C7.87 9.596 7.186 9.5 6.5 9.5s-1.37.096-2.056.288m4.112 2c-.685-.192-1.37-.288-2.056-.288s-1.37.096-2.056.288m4.112 2c-.685-.192-1.37-.288-2.056-.288s-1.37.096-2.056.288" /><path d="M10.5 6.59c-1.333-.726-2.667-1.09-4-1.09s-2.667.364-4 1.09v9.91c1.333-.667 2.667-1 4-1s2.667.333 4 1z" /></g></svg>
                        <p>Text Book</p>
                      </div>

                      <div className={`practical ${value === 'practical' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('practical')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="4"><rect width="38" height="24" x="5" y="8" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M4 40h40M22 14h4" /></g></svg>
                        <p>Practical</p>
                      </div>

                      <div className={`viva ${value === 'viva' ? 'enabled' : 'disabled'}`} onClick={() => handleClick('viva')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="currentColor"><path d="M17.88 15.069a1 1 0 0 1-1.898-.63a10.4 10.4 0 0 0 .518-3.273c0-4.456-2.756-7.412-6.5-7.412S3.5 6.71 3.5 11.166c0 1.14.178 2.247.518 3.273a1 1 0 0 1-1.898.63a12.4 12.4 0 0 1-.62-3.903c0-5.53 3.619-9.412 8.5-9.412s8.5 3.882 8.5 9.412c0 1.354-.212 2.673-.62 3.903" /><path d="M5.977 17.034a3 3 0 0 1-2.942-3.04v-.022a2.978 2.978 0 0 1 3.035-2.937a1 1 0 0 1 .98 1.013l-.054 4a1 1 0 0 1-1.019.986M14.089 11a3 3 0 0 1 2.942 3.04v.022A2.978 2.978 0 0 1 14.013 17h-.016a1 1 0 0 1-.981-1.014l.054-4A1 1 0 0 1 14.089 11" /></g></svg>
                        <p>Viva</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="navcontent-outer">
                  <NavContent item={value} sub={details} />
                </div>

              </Fragment> : <div className="outer-cover">

                <NotFound value={`Subject  ' ${subject} '`} from={'subject'} />
              </div>
          }</Fragment>)}
    </Fragment>
  )
}

export default Chapter
