import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import NotFound  from '../NotFound/NotFound'

const ProtectedRoute = ({isAdmin,Component}) => {
    const {loading,isAuthenticated,user} = useSelector((state) => state.user)
  return (
    loading === false && <Fragment>
        {
            isAuthenticated ? (
             isAdmin && user.role === 'admin'?<Component/>:<NotFound/>
            ):<Navigate to='/login'/>
        }
    </Fragment>
  )
}

export default ProtectedRoute
