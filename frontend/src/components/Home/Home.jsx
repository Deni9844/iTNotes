import React, { Fragment, useEffect, useState } from 'react'
import cover from '../../images/cover.png'
import './home.css';
import SemBox from './SemBox.jsx'
import ShowBox from './ShowBox.jsx'
import icon1 from '../../images/first.png';
import icon2 from '../../images/second.png';
import icon3 from '../../images/third.png';
import icon4 from '../../images/fourth.png';
import icon5 from '../../images/fifth.png';
import icon6 from '../../images/sixth.png';
import icon7 from '../../images/seventh.png';
import icon8 from '../../images/eighth.png';
import img1 from '../../images/study.png'
import img2 from '../../images/Updates.png'
import img3 from '../../images/question.png'
import WindowSizeListener from '../../WindowResizeListener.jsx'
import axios from 'axios';
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearErrors, getAllSemesters } from '../../actions/semesterAction.js';
import Loader from '../layout/Loader/Loader.js';

const Home = () => {

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch()
  const alert = useAlert()

  const { semesters, loading, error } = useSelector(state => state.semesters)

  const semArr = [{
    name: "First",
    icon: icon1

  }, {
    name: "Second",
    icon: icon2

  }, {
    name: "Third",
    icon: icon3

  }, {
    name: "Fourth",
    icon: icon4

  }, {
    name: "Fifth",
    icon: icon5

  }, {
    name: "Sixth",
    icon: icon6

  }, {
    name: "Seventh",
    icon: icon7

  }, {
    name: "Eight",
    icon: icon8

  }]

  const dataArr = [{
    title: "Interactive learning",
    paragraph: "Engage with study materials that go beyond static notes, promoting a dynamic and immersive learning experience.",
    img: img1
  }, {
    title: " Curated Resources",
    paragraph: "Benefit from a meticulous selection of study materials tailored to optimize your understanding and performance.",
    img: img2
  }, {
    title: "Interactive Q&A",
    paragraph: "Elevate your learning experience by asking any IT-related question. fosters a dynamic community where you can seek knowledge.",
    img: img3
  },]

  useEffect(() => {
    dispatch(getAllSemesters())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
  }, [error, dispatch,alert])


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        const fetchSuggestions = async () => {
          try {

            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            }

            const { data } = await axios.get(`/api/v1/semesters?keyword=${query}`, config);
            setSuggestions(data.filteredNote);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          }
        };

        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300); // Wait 300ms before making the API call


    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout when the component unmout or before the next render to avoid rapid api calls
  }, [query]);

  return (
    <>

      {
        loading ? <Loader /> :
          <WindowSizeListener>
            {(width) => (
              <Fragment>
                <div className="outer-home">
                  <div className="home-top">
                    <div className="top-left">
                      <h3>tech &nbsp;knowledge</h3>
                      <h1>Elevate Your Board Prep with Essential <span>IT Notes</span></h1>
                      <p>Access Study Materials and More – Your Complete Arsenal to Face University Exams with Confidence and Success</p>
                      <div className="top-left-btns">
                        <a href="#search"><input className='left' type="button" value="Serach" /></a>
                        <Link to='/askquestion'>   <input className='right' type="button" value="Ask question" /></Link>
                      </div>
                    </div>

                    <div className="top-right">
                      <img src={cover} alt="" />
                    </div>
                  </div>
                  <div className="home-mid" id='search'>
                    <div className="home-mid-search">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" d="m21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0a8.5 8.5 0 0 1 17 0Z" /></svg>
                      <input type="text" onChange={(e) => setQuery(e.target.value)} placeholder='Search Note . . .' />
                      <input type="button" value="Serach" style={{ pointerEvents: query.length > 0 ? 'none' : 'auto' }} />
                      <div className='search-results'>
                        {suggestions && suggestions.map((item, i) => (
                          <Link to={`/semester/${item.semester}/${item.subject}`} key={i}>{item.subject} </Link>
                        ))}
                      </div>
                    </div>

                    <h3>Semester Wise <span>CSIT Notes</span></h3>
                    <p id='para'>Complete semester wise notes for CSIT.</p>
                    <div className="home-mid-semesters">
                      {
                        semesters && semesters.map((item, index) => (
                          <SemBox item={item} key={index} value={index} icon={semArr[index].icon} />
                        ))
                      }
                    </div>
                  </div>

                  <div className="home-bottom">
                    <h1>Why Choose <span>itNotes</span>  for {width > 500 ? <br /> : null}
                      <span>Your Tech Journey?</span></h1>
                    {
                      dataArr.map((item, index) => (
                        <ShowBox item={item} key={index} value={index} />
                      ))
                    }
                  </div>
                </div>
              </Fragment>
            )}</WindowSizeListener>
      }

    </>
  )
}

export default Home
