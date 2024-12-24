import React, { Fragment } from 'react'
import'./notFound.css'
import { Link } from 'react-router-dom'

const NotFound = ({value, from}) => {
  return (
    <Fragment>
        <div className="not-found">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z"/></svg>
            </div>
            <div>
              {
                from === 'subject'?
                <>
                <p>Didn’t Find {value} ?</p>
                <p>Click on the button to contribute Subject Notes on ITNotes.</p>
                </>:
                <>
                <p>Didn’t Find Any {value}?</p>
                <p>Click on the button to contribute {value} on ITNotes.</p>
                </>
              }
             
                
            </div>
            <Link to='/contribute'> <button>Contribute</button> </Link>
           
        </div>
    </Fragment>
  )
}

export default NotFound
