import React, { Fragment, useEffect, useState } from 'react'
import './panel.css'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { clearAdminError, deleteUser ,editUserRole} from '../../actions/adminAction'
import Pagination from 'react-js-pagination'
import { DELETE_USER_RESET, EDIT_USER_ROLE_RESET, USER_DELETED, USER_ROLE_EDITED } from '../../constants/adminConstants'

const DashboardPanel = ({ isHover, setIsHover, setActiveOption, width, setLevel,
  currentPage, setCurrentPage, setPopupToggle }) => {
  const [toggle, setToggle] = useState(false)
  const [permission, setPermission] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)
  const [editPopup, setEditPopup] = useState(false)
  const [user, setUser] = useState({})
  const [role, setRole] = useState({})

  const dispatch = useDispatch()
  const alert = useAlert()


  const { loading: noticeLoading, notices, error: noticesErr } = useSelector((state) => state.notices)
  const { loading: articlesLoading, articles, error: articlesErr } = useSelector((state) => state.articles)
  const { loading: queriesLoading, queries, error: queriesErr } = useSelector((state) => state.allQueries)
  const { loading: assetsLoading, assets, error: assetsErr } = useSelector((state) => state.allAssets)
  const { loading: usersLoading, users, error: usersErr, resultPerPage, totalActivers, totalAdmins } = useSelector((state) => state.allUsers)
  const { isDeleted, isUpdated, error } = useSelector((state) => state.profile)

  

  const handleAction = (user) => {
    setUser(user)
    setRole({role:user.role})
    setPopupToggle(true);
  }

  const handlePopupAction = (perm) => {
    setPermission(perm);
    setPopupToggle(false)
    setDeletePopup(false)
    setEditPopup(false)
  }

  useEffect(() => {
    if (permission){
      dispatch(deleteUser(user._id));
      setPermission(false)
    }
  }, [permission, dispatch,user])


  useEffect(() => {
    if (noticesErr || articlesErr || queriesErr || assetsErr || usersErr || error) {
      alert.error(noticesErr || articlesErr || queriesErr || assetsErr || usersErr || error);
      dispatch(clearAdminError())
    }

    if (isDeleted) {
      dispatch({type:USER_DELETED,payload:user})
      alert.success("User deleted successfully");
      dispatch({ type: DELETE_USER_RESET });
    }

    if (isUpdated) {
      dispatch({type:USER_ROLE_EDITED,payload:{user,role}})
      alert.success("User role updated successfully");
      dispatch({ type: EDIT_USER_ROLE_RESET});
    }

  }, [dispatch, alert, noticesErr, articlesErr, queriesErr, assetsErr, usersErr, error, isDeleted, isUpdated,role,user])


  return (
    <Fragment>

      {
        noticeLoading || articlesLoading || queriesLoading || assetsLoading || usersLoading ? <Loader /> : (
          <>
            <div className="dashboard-panel-top-outer">
              <div className="dashboard-panel-top">
                <a href="#users">
                  <div className='block'>
                    <div>
                      <p>{totalAdmins}</p>
                      <p>Admin</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17 17q.625 0 1.063-.437T18.5 15.5t-.437-1.062T17 14t-1.062.438T15.5 15.5t.438 1.063T17 17m0 3q.794 0 1.435-.353q.64-.353 1.06-.953q-.57-.344-1.195-.519T17 18t-1.3.175t-1.194.52q.419.6 1.06.952Q16.205 20 17 20M12 3.189q.142 0 .286.025t.28.08l5.384 2q.464.186.757.597q.293.412.293.926v3.914q0 .212-.144.356t-.357.144t-.356-.144t-.143-.356V6.804q0-.193-.106-.346q-.105-.154-.298-.231l-5.384-2q-.096-.039-.212-.039t-.212.039l-5.384 2q-.193.077-.298.23Q6 6.613 6 6.805V11.1q0 1.442.42 2.798t1.164 2.49t1.742 1.987t2.151 1.33q.202.086.297.278t.025.39q-.082.212-.286.285q-.205.073-.388-.012q-2.806-1.188-4.465-3.85Q5 14.135 5 11.1V6.817q0-.514.293-.926q.292-.412.757-.597l5.385-2q.141-.063.282-.085q.142-.02.283-.02M17 21q-1.671 0-2.835-1.164Q13 18.67 13 17t1.165-2.835T17 13t2.836 1.165T21 17t-1.164 2.836T17 21m-5-9.042" /></svg>
                  </div>
                </a>

                <a href="#users">
                  <div className='block'>
                    <div>
                      <p>{totalActivers - totalAdmins}</p>
                      <p>Users</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5M8.75 6a3.25 3.25 0 1 1 6.5 0a3.25 3.25 0 0 1-6.5 0M12 12.25c-2.313 0-4.445.526-6.024 1.414C4.42 14.54 3.25 15.866 3.25 17.5v.102c-.001 1.162-.002 2.62 1.277 3.662c.629.512 1.51.877 2.7 1.117c1.192.242 2.747.369 4.773.369s3.58-.127 4.774-.369c1.19-.24 2.07-.605 2.7-1.117c1.279-1.042 1.277-2.5 1.276-3.662V17.5c0-1.634-1.17-2.96-2.725-3.836c-1.58-.888-3.711-1.414-6.025-1.414M4.75 17.5c0-.851.622-1.775 1.961-2.528c1.316-.74 3.184-1.222 5.29-1.222c2.104 0 3.972.482 5.288 1.222c1.34.753 1.961 1.677 1.961 2.528c0 1.308-.04 2.044-.724 2.6c-.37.302-.99.597-2.05.811c-1.057.214-2.502.339-4.476.339c-1.974 0-3.42-.125-4.476-.339c-1.06-.214-1.68-.509-2.05-.81c-.684-.557-.724-1.293-.724-2.601" clip-rule="evenodd" /></svg>
                  </div>
                </a>

                <div className='block' onClick={() => setActiveOption('notices')}>
                  <div>
                    <p>{notices?.length}</p>
                    <p>Notices</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m16.394 2.021l.066.018c1.1.295 1.971.528 2.656.776c.701.253 1.273.542 1.744.983a4.75 4.75 0 0 1 1.378 2.389c.147.628.112 1.268-.02 2.001c-.127.718-.36 1.589-.655 2.688l-.536 1.999c-.294 1.099-.528 1.97-.775 2.656c-.254.7-.543 1.272-.984 1.743a4.75 4.75 0 0 1-2.302 1.358a4.75 4.75 0 0 1-1.106 1.567c-.471.441-1.043.73-1.744.984c-.685.248-1.556.481-2.655.776l-.067.018c-1.1.294-1.97.527-2.688.656c-.733.131-1.373.166-2.002.02a4.75 4.75 0 0 1-2.388-1.38c-.44-.47-.73-1.042-.984-1.743c-.247-.685-.48-1.556-.775-2.656l-.536-1.998c-.294-1.1-.528-1.97-.656-2.688c-.131-.733-.166-1.373-.02-2.002a4.75 4.75 0 0 1 1.38-2.388c.47-.44 1.042-.73 1.743-.984c.685-.247 1.556-.48 2.655-.775l.034-.01l.751-.2c.392-1.399.736-2.388 1.408-3.105a4.75 4.75 0 0 1 2.388-1.379c.629-.146 1.268-.111 2.002.02c.717.128 1.588.362 2.688.656M7.455 7.503c-1.093.293-1.876.505-2.478.722c-.61.22-.967.424-1.227.668a3.25 3.25 0 0 0-.944 1.634c-.08.348-.079.76.036 1.397c.115.647.332 1.457.637 2.597l.518 1.932c.305 1.14.523 1.95.746 2.567c.22.61.424.968.668 1.228a3.25 3.25 0 0 0 1.634.944c.347.08.76.078 1.397-.036c.647-.115 1.457-.332 2.597-.637c1.14-.306 1.95-.523 2.568-.747c.609-.22.967-.424 1.227-.667c.138-.13.263-.27.376-.419a10.077 10.077 0 0 1-.554-.095c-.672-.134-1.48-.35-2.475-.617l-.058-.015c-1.099-.295-1.97-.528-2.655-.776c-.701-.253-1.273-.542-1.744-.983a4.75 4.75 0 0 1-1.379-2.389c-.146-.628-.111-1.268.02-2.001c.128-.718.362-1.589.656-2.688zm5.987-4.661c-.638-.115-1.05-.117-1.397-.036a3.25 3.25 0 0 0-1.634.944c-.436.465-.705 1.185-1.171 2.893c-.076.278-.156.577-.243.902l-.518 1.932c-.305 1.14-.522 1.95-.637 2.597c-.115.637-.117 1.05-.036 1.397a3.25 3.25 0 0 0 .944 1.634c.26.244.618.447 1.227.668c.618.223 1.428.44 2.568.746c1.025.275 1.785.478 2.403.6c.615.123 1.033.153 1.375.111c.075-.01.146-.022.216-.038a3.25 3.25 0 0 0 1.634-.944c.244-.26.448-.618.668-1.227c.223-.618.44-1.428.746-2.568l.518-1.932c.305-1.14.522-1.95.637-2.597c.114-.637.117-1.05.036-1.397a3.25 3.25 0 0 0-.944-1.634c-.26-.244-.618-.447-1.227-.668c-.619-.223-1.428-.44-2.568-.746c-1.14-.305-1.95-.522-2.597-.637m-2.39 6.964a.75.75 0 0 1 .919-.53l4.83 1.294a.75.75 0 0 1-.389 1.448l-4.83-1.294a.75.75 0 0 1-.53-.918m-.777 2.898a.75.75 0 0 1 .92-.53l2.897.776a.75.75 0 0 1-.388 1.449l-2.898-.777a.75.75 0 0 1-.53-.918" clip-rule="evenodd"></path></svg>

                </div>

                <div className='block' onClick={() => setActiveOption('articles')}>
                  <div>
                    <p>{articles?.length}</p>
                    <p>Articels</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m210.43 41.22l-130.25-23A14 14 0 0 0 64 29.58l-29.75 169a14 14 0 0 0 11.36 16.22l130.25 23a13.6 13.6 0 0 0 2.46.22a14 14 0 0 0 13.68-11.6l29.75-169a14 14 0 0 0-11.32-16.2M210 55.36l-29.75 169a2 2 0 0 1-.82 1.3a2 2 0 0 1-1.49.33L47.65 203a2 2 0 0 1-1.65-2.36l29.75-169a2 2 0 0 1 .82-1.3A2.06 2.06 0 0 1 78.1 30l130.25 23a2 2 0 0 1 1.65 2.36m-23.89 20.15a6 6 0 0 1-5.9 5a6 6 0 0 1-1.05-.09l-83-14.66a6 6 0 1 1 2.09-11.81l83 14.65a6 6 0 0 1 4.86 6.91M180.56 107a6 6 0 0 1-5.9 5a5.5 5.5 0 0 1-1-.1l-83-14.65a6 6 0 0 1 2.09-11.82l83 14.66a6 6 0 0 1 4.81 6.91m-47 24.19a6 6 0 0 1-5.91 4.95a6.4 6.4 0 0 1-1.05-.09l-41.49-7.33a6 6 0 1 1 2.09-11.81l41.49 7.32a6 6 0 0 1 4.84 6.99Z"></path></svg>
                </div>

                <div className='block' onClick={() => setActiveOption('queries')}>
                  <div>
                    <p>{queries?.length}</p>
                    <p>Queries</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.97 8.265a1.45 1.45 0 0 0-.487.57a.75.75 0 0 1-1.341-.67c.2-.402.513-.826.997-1.148C10.627 6.69 11.244 6.5 12 6.5c.658 0 1.369.195 1.934.619a2.45 2.45 0 0 1 1.004 2.006c0 1.033-.513 1.72-1.027 2.215c-.19.183-.399.358-.579.508l-.147.123a4 4 0 0 0-.435.409v1.37a.75.75 0 1 1-1.5 0v-1.473c0-.237.067-.504.247-.736c.22-.28.486-.517.718-.714l.183-.153l.001-.001c.172-.143.324-.27.47-.412c.368-.355.569-.676.569-1.136a.95.95 0 0 0-.404-.806C12.766 8.118 12.384 8 12 8c-.494 0-.814.121-1.03.265M13 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path><path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1M2.5 12a9.5 9.5 0 0 0 9.5 9.5a9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5A9.5 9.5 0 0 0 2.5 12"></path></svg>
                </div>

                <div className='block' onClick={() => setActiveOption('assets')}>
                  <div>
                    <p>{assets?.length}</p>
                    <p>Assets</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.616 18.5v2.116q0 .153.115.269q.115.115.269.115t.27-.115t.114-.27V18.5H20.5q.154 0 .27-.115q.114-.116.114-.27q0-.153-.115-.269q-.115-.115-.269-.115h-2.116v-2.116q0-.153-.115-.269q-.115-.115-.269-.115t-.27.115t-.114.27v2.115H15.5q-.154 0-.27.115q-.114.116-.114.27q0 .153.115.269q.115.115.269.115zm-12 1.5q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h12.77q.666 0 1.14.475T20 5.615v5.116q0 .212-.144.356t-.357.144t-.356-.144t-.143-.356V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h5.116q.212 0 .356.144t.144.357t-.144.356t-.356.143zM5 18.007V19V5v6.306v-.075zm2.5-2.237q0 .213.144.356t.356.143h2.96q.212 0 .356-.144t.143-.356t-.143-.356t-.357-.144H8q-.213 0-.356.144q-.144.144-.144.357m0-3.77q0 .214.144.357T8 12.5h6.48q.213 0 .357-.144t.144-.357t-.144-.356t-.356-.143H8q-.213 0-.356.144t-.144.357m0-3.77q0 .213.144.357T8 8.73h8q.213 0 .356-.144q.144-.144.144-.357t-.144-.356T16 7.731H8q-.213 0-.356.144t-.144.357M18 22.116q-1.671 0-2.835-1.165Q14 19.787 14 18.116t1.165-2.836T18 14.116t2.836 1.164T22 18.116q0 1.67-1.164 2.835Q19.67 22.116 18 22.116"></path></svg>
                </div>
              </div>

              <div className={`sem-item ${isHover ? 'active' : 'inactive'}`} style={{ left: width < 570 ? '30px' : '10px' }} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} >
                <ul>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('first') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>First Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('second') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Second Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('third') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Third Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('fourth') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Fourth Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('fifth') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Fifth Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('sixth') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Sixth Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('seventh') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Seventh Semester</li>
                  <li onClick={() => { setActiveOption('semester'); setIsHover(false); setLevel('eight') }} style={{ fontSize: width < 570 ? '15px' : '16px', padding: width < 570 ? '14px 20px' : 'auto' }}>Eight Semester</li>
                </ul>
              </div>
            </div>

            <div className='panel-bottom-outer' id='users'>
              <div className="panel-bottom">
                <div className='head'>
                  <p className='first'>Users</p>
                  <div>
                  <p style={{ display: totalActivers > 5? 'flex' : 'none' }} onClick={() => { setToggle(!toggle); toggle ? setCurrentPage(1) : setCurrentPage() }}>{toggle ? 'Show less' : 'View all'} <svg
                    style={{ transform: toggle ? 'rotate(-90deg)' : 'rotate(90deg)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 17V7l5 5z" /></svg></p>
                  </div>
                </div>

                <div className="table">
                  <div className='row'>
                    <p>Name</p>
                    <p>Role</p>
                    <p>Action</p>
                  </div>
                  {
                    users && users.map((user, i) => (
                      <div className='row' key={i}>
                        <p>{user.username}</p>
                        <p>{user.role}</p>
                        <div>
                          <p onClick={() => { handleAction(user); setEditPopup(true) }}>Edit</p>
                          <p onClick={() => { handleAction(user); setDeletePopup(true) }}>Delete</p>
                        </div>
                      </div>
                    ))
                  }
                  {!toggle && totalActivers > resultPerPage && <div className="paginationBox">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={totalActivers}
                      onChange={(e) => setCurrentPage(e)}
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

                </div>
              </div>
            </div>

            {
              deletePopup &&
              <div className='popup-box-outer'>
                <div className="popup-box">
                  <p>Are you sure want to delete user <span>{user.username}</span>?</p>
                  <div style={{padding:'15px 0 0'}} className="popup-btns">
                    <button onClick={() => handlePopupAction(true)}>Delete</button>
                    <button onClick={() => handlePopupAction(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            }

            {
              editPopup &&
              <div className='popup-box-outer'>
                <div className="popup-box">
                  <p className='heading'>Edit Role</p>
                  <div className='input-field'>
                    <label >Name:</label>
                    <input className='readOnly' type="text" value={user.username} readOnly/>

                    <label>Role:</label>
                    <select onChange={(e) => setRole({role:e.target.value})} value={role.role}>
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>

                  </div>
                  <div className="popup-btns edit">
                    <button style={{backgroundColor:"#1CC17C",pointerEvents: user.role === role.role?'none':'' }} 
                    onClick={() => {handlePopupAction(false);dispatch(editUserRole(user._id,role))}}>Edit</button>
                    <button onClick={() => handlePopupAction(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            }

          </>
        )
      }
    </Fragment>

  )
}

export default DashboardPanel
