import React, { Fragment } from 'react'
import logo from '../../../images/Logo.png'
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';
import facebook from '../../../images/facebook.png'
import instagram from '../../../images/instagram.png'
import twitter from '../../../images/twitter.png'
import youtube from '../../../images/youtube.png'
import './footer.css'
import whiteLogo from '../../../images/whiteLogo.png'

const Footer = () => {
  return (
    <Fragment>
      <div className="footer-outer">
        <div className="footer">
          <div className="top-segment">
            <div className="left">
              <img src={whiteLogo} alt="" />
              <p id='description'>
                ItNotes is a dynamic learning platform designed for CSIT Bachelor's students, offering a diverse range of study materials. Tailored to the CSIT curriculum, ItNotes provides comprehensive resources, including textbooks, notes, and multimedia content. Its standout feature is an interactive Q&A hub, fostering collaborative learning among students. </p>
              <p id='email'><EmailIcon />info@ITNotes.Com</p>
            </div>
          <div className='mid-and-right'>

            <div className="mid">
              <h4>Semesters</h4>
              <ul>
                <Link to='/semester/first'>First Semester</Link>
                <Link to='/semester/second'>Second Semester</Link>
                <Link to='/semester/third'>Third Semester</Link>
                <Link to='/semester/fourth'>Fourth Semester</Link>
                <Link to='/semester/fifth'>Fifth Semester</Link>
                <Link to='/semester/sixth'>Sixth Semester</Link>
                <Link to='/semester/seventh'>Seventh Semester</Link>
                <Link to='/semester/eight'>Eighth Semester</Link>
              </ul>
            </div>

            <div className="right">
              <h4>Links</h4>
              <ul>
                <Link>About Us</Link>
                <Link>Privacy Policy</Link>
                <Link>Terms And Conditions</Link>
              </ul>
            </div>
          </div>

          </div>


          <div className="follow">
            <span>Follow us:</span>
            <div className='social-media'>

              <Link><img src={youtube} alt="" id='yt' /></Link>
              <Link><img src={facebook} alt="" id='fb' /></Link>
              <Link><img src={instagram} alt="" id='ig' /></Link>
              <Link><img src={twitter} alt="" id='tw' /></Link>
            </div>
          </div>

          <div className="bottom-segment">
            <div></div>
            <p>Copyright 2024 | ITNotes | All Right Reserved</p>
          </div>


        </div>
      </div>
    </Fragment>
  )
}

export default Footer