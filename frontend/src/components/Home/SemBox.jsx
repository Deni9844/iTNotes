import React, { Fragment } from 'react'
import './home.css'
import { Link } from 'react-router-dom'

const SemBox = ({ item, value,icon }) => {
  
  return (
    <Fragment>
      <Link to={`/semester/${item.name.toLowerCase()}`}>
        <div className="sem-container">
          <img src={icon} alt="" className={`image-${value}`} />
          <div className="content">
            <h4>{item.name} Semester</h4>
            <p>{item.subCount} subjects</p>
          </div>
        </div>
      </Link>
    </Fragment>
  )
}

export default SemBox
