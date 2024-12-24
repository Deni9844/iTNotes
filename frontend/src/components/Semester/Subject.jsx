import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SubjectCard from "./SubjectCard.jsx"
import "./Subject.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getAllSubjects } from '../../actions/semesterAction.js'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader.js'
import NotFound from './NotFound.jsx'

const Subject = () => {
  const { level } = useParams();

  const dispatch = useDispatch()

  const alert = useAlert()

  const { subjects, loading, error } = useSelector(state => state.semester)

  
  useEffect(() => {
    window.scrollTo({
        top: 0,
    });
}, [])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
  }, [dispatch, alert, error])

  useEffect(() => {
    dispatch(getAllSubjects(level))
  }, [level, dispatch])



  const CapitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  return (
    <Fragment>
      {
        loading ? (
          <Loader />) : 
          <Fragment>
          <div className="cover">
            <h2>{CapitalizeFirstLetter(level)} Semester</h2>
            <p>{CapitalizeFirstLetter(level)} Semester {'>>'} Subjects</p>
        </div>
        {
        subjects.length > 0 ? (
          <div className="cs-container-outer">
            <div className="cs-container subjects-conatiner" style={{ padding: '50px 80px' }}>
              {
                subjects && subjects.map((item, index) => (
                  <SubjectCard item={item} key={index} />
                ))
              }

            </div>
          </div>
        ) : (
          <div className="outer-cover">

            <NotFound value={'Subject Notes'} />
          </div>
        )
      }
      </Fragment>
      }
    </Fragment>


  )
}

export default Subject
