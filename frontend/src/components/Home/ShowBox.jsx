import React, { Fragment } from 'react'
import './home.css'

const ShowBox = ({item,value}) => {
  return (
    <Fragment>
             <div className={`container cont-${value}`}>
            <div className="container-left">
              <img src={item.img} alt="" />
            </div>
            <div className="container-right">
              <div>
                <h2>{item.title}</h2>             
              </div>
              <div>
              <p>{item.paragraph}</p>
              </div>
            </div>
          </div>
      
    </Fragment>
  )
}

export default ShowBox
