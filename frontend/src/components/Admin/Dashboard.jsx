import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import logo from '../../images/whiteLogo.png'
import DashboardPanel from './DashboardPanel.jsx'
import SemesterPanel from './SemesterPanel.jsx'
import NoticesPanel from './NoticesPanel.jsx'
import ArticlesPanel from './ArticlesPanel.jsx'
import QueriesPanel from './QueriesPanel.jsx'
import AssetsPanel from './AssetsPanel.jsx'
import SizeListener from '../../WindowResizeListener.jsx'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector,useDispatch} from 'react-redux'
import { getAllUsers, getAllQueries, getAllAssets} from '../../actions/adminAction.js'
import { getAllNotices } from '../../actions/noticeAction.js'
import { getAllArticles } from '../../actions/articleAction.js'

const Dashboard = () => {
  const [toggle, setToggle] = useState(false)
  const [activeOption, setActiveOption] = useState('dashboard')
  const [isHover, setIsHover] = useState(false)
  const [level,setLevel] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [popupToggle,setPopupToggle] = useState(false)
  const [height,setHeight] = useState()


  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)


  function getDivHeight(){
    const div = document.querySelector('.dashboard-right');
    const hei = div.offsetHeight;
    setHeight(hei)
  }

  const toggledMenu = () => {
    setToggle(!toggle)
    getDivHeight();
  }

  useEffect(()=>{
  dispatch(getAllUsers(currentPage))
  },[dispatch,currentPage])

  useEffect(()=>{
    dispatch(getAllNotices())
    dispatch(getAllArticles())
    dispatch(getAllQueries())
    dispatch(getAllAssets())
  },[dispatch])

  return (
    <SizeListener>
      {
        (width) => (

          <>
            <div className="dashboard">
              <div className={`dashboard-menu dashboard-left ${toggle ? 'active' : 'inactive'}`} style={{height: !toggle && !popupToggle ? height:'auto' }} >
                <Link to='/'><img src={logo} alt="" /></Link>
                <div className="options-container">
                  <div className={`${activeOption === 'dashboard' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('dashboard')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 21a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zM4 13a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm5-2V5H5v6zM4 21a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm1-2h4v-2H5zm10 0h4v-6h-4zM13 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1zm2 1v2h4V5z" /></svg>
                    <p>Dashboard</p>
                  </div>
                  <div className={`${activeOption === 'semester' ? 'active-option' : 'inactive-option'}`}  onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m7 1.367l6.5 2.817L7 7L.5 4.184z" /><path d="m3.45 5.469l.006 3.064S4.529 9.953 7 9.953c2.47 0 3.55-1.42 3.55-1.42l-.001-3.064m-8.854 5.132v-5.89m.001 8.282a1.196 1.196 0 1 0 0-2.392a1.196 1.196 0 0 0 0 2.392" /></g></svg>
                    <p>Semester</p>
                  </div>
                  <div className={`${activeOption === 'notices' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('notices')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m16.394 2.021l.066.018c1.1.295 1.971.528 2.656.776c.701.253 1.273.542 1.744.983a4.75 4.75 0 0 1 1.378 2.389c.147.628.112 1.268-.02 2.001c-.127.718-.36 1.589-.655 2.688l-.536 1.999c-.294 1.099-.528 1.97-.775 2.656c-.254.7-.543 1.272-.984 1.743a4.75 4.75 0 0 1-2.302 1.358a4.75 4.75 0 0 1-1.106 1.567c-.471.441-1.043.73-1.744.984c-.685.248-1.556.481-2.655.776l-.067.018c-1.1.294-1.97.527-2.688.656c-.733.131-1.373.166-2.002.02a4.75 4.75 0 0 1-2.388-1.38c-.44-.47-.73-1.042-.984-1.743c-.247-.685-.48-1.556-.775-2.656l-.536-1.998c-.294-1.1-.528-1.97-.656-2.688c-.131-.733-.166-1.373-.02-2.002a4.75 4.75 0 0 1 1.38-2.388c.47-.44 1.042-.73 1.743-.984c.685-.247 1.556-.48 2.655-.775l.034-.01l.751-.2c.392-1.399.736-2.388 1.408-3.105a4.75 4.75 0 0 1 2.388-1.379c.629-.146 1.268-.111 2.002.02c.717.128 1.588.362 2.688.656M7.455 7.503c-1.093.293-1.876.505-2.478.722c-.61.22-.967.424-1.227.668a3.25 3.25 0 0 0-.944 1.634c-.08.348-.079.76.036 1.397c.115.647.332 1.457.637 2.597l.518 1.932c.305 1.14.523 1.95.746 2.567c.22.61.424.968.668 1.228a3.25 3.25 0 0 0 1.634.944c.347.08.76.078 1.397-.036c.647-.115 1.457-.332 2.597-.637c1.14-.306 1.95-.523 2.568-.747c.609-.22.967-.424 1.227-.667c.138-.13.263-.27.376-.419a10.077 10.077 0 0 1-.554-.095c-.672-.134-1.48-.35-2.475-.617l-.058-.015c-1.099-.295-1.97-.528-2.655-.776c-.701-.253-1.273-.542-1.744-.983a4.75 4.75 0 0 1-1.379-2.389c-.146-.628-.111-1.268.02-2.001c.128-.718.362-1.589.656-2.688zm5.987-4.661c-.638-.115-1.05-.117-1.397-.036a3.25 3.25 0 0 0-1.634.944c-.436.465-.705 1.185-1.171 2.893c-.076.278-.156.577-.243.902l-.518 1.932c-.305 1.14-.522 1.95-.637 2.597c-.115.637-.117 1.05-.036 1.397a3.25 3.25 0 0 0 .944 1.634c.26.244.618.447 1.227.668c.618.223 1.428.44 2.568.746c1.025.275 1.785.478 2.403.6c.615.123 1.033.153 1.375.111c.075-.01.146-.022.216-.038a3.25 3.25 0 0 0 1.634-.944c.244-.26.448-.618.668-1.227c.223-.618.44-1.428.746-2.568l.518-1.932c.305-1.14.522-1.95.637-2.597c.114-.637.117-1.05.036-1.397a3.25 3.25 0 0 0-.944-1.634c-.26-.244-.618-.447-1.227-.668c-.619-.223-1.428-.44-2.568-.746c-1.14-.305-1.95-.522-2.597-.637m-2.39 6.964a.75.75 0 0 1 .919-.53l4.83 1.294a.75.75 0 0 1-.389 1.448l-4.83-1.294a.75.75 0 0 1-.53-.918m-.777 2.898a.75.75 0 0 1 .92-.53l2.897.776a.75.75 0 0 1-.388 1.449l-2.898-.777a.75.75 0 0 1-.53-.918" clipRule="evenodd" /></svg>
                    <p>Notices</p>
                  </div>
                  <div className={`${activeOption === 'articles' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('articles')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m210.43 41.22l-130.25-23A14 14 0 0 0 64 29.58l-29.75 169a14 14 0 0 0 11.36 16.22l130.25 23a13.6 13.6 0 0 0 2.46.22a14 14 0 0 0 13.68-11.6l29.75-169a14 14 0 0 0-11.32-16.2M210 55.36l-29.75 169a2 2 0 0 1-.82 1.3a2 2 0 0 1-1.49.33L47.65 203a2 2 0 0 1-1.65-2.36l29.75-169a2 2 0 0 1 .82-1.3A2.06 2.06 0 0 1 78.1 30l130.25 23a2 2 0 0 1 1.65 2.36m-23.89 20.15a6 6 0 0 1-5.9 5a6 6 0 0 1-1.05-.09l-83-14.66a6 6 0 1 1 2.09-11.81l83 14.65a6 6 0 0 1 4.86 6.91M180.56 107a6 6 0 0 1-5.9 5a5.5 5.5 0 0 1-1-.1l-83-14.65a6 6 0 0 1 2.09-11.82l83 14.66a6 6 0 0 1 4.81 6.91m-47 24.19a6 6 0 0 1-5.91 4.95a6.4 6.4 0 0 1-1.05-.09l-41.49-7.33a6 6 0 1 1 2.09-11.81l41.49 7.32a6 6 0 0 1 4.84 6.99Z" /></svg>
                    Articles
                  </div>
                  <div className={`${activeOption === 'queries' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('queries')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.97 8.265a1.45 1.45 0 0 0-.487.57a.75.75 0 0 1-1.341-.67c.2-.402.513-.826.997-1.148C10.627 6.69 11.244 6.5 12 6.5c.658 0 1.369.195 1.934.619a2.45 2.45 0 0 1 1.004 2.006c0 1.033-.513 1.72-1.027 2.215c-.19.183-.399.358-.579.508l-.147.123a4 4 0 0 0-.435.409v1.37a.75.75 0 1 1-1.5 0v-1.473c0-.237.067-.504.247-.736c.22-.28.486-.517.718-.714l.183-.153l.001-.001c.172-.143.324-.27.47-.412c.368-.355.569-.676.569-1.136a.95.95 0 0 0-.404-.806C12.766 8.118 12.384 8 12 8c-.494 0-.814.121-1.03.265M13 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0" /><path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1M2.5 12a9.5 9.5 0 0 0 9.5 9.5a9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5A9.5 9.5 0 0 0 2.5 12" /></svg>
                    <p>Queries</p>
                  </div>
                  <div className={`${activeOption === 'assets' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('assets')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.616 18.5v2.116q0 .153.115.269q.115.115.269.115t.27-.115t.114-.27V18.5H20.5q.154 0 .27-.115q.114-.116.114-.27q0-.153-.115-.269q-.115-.115-.269-.115h-2.116v-2.116q0-.153-.115-.269q-.115-.115-.269-.115t-.27.115t-.114.27v2.115H15.5q-.154 0-.27.115q-.114.116-.114.27q0 .153.115.269q.115.115.269.115zm-12 1.5q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h12.77q.666 0 1.14.475T20 5.615v5.116q0 .212-.144.356t-.357.144t-.356-.144t-.143-.356V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h5.116q.212 0 .356.144t.144.357t-.144.356t-.356.143zM5 18.007V19V5v6.306v-.075zm2.5-2.237q0 .213.144.356t.356.143h2.96q.212 0 .356-.144t.143-.356t-.143-.356t-.357-.144H8q-.213 0-.356.144q-.144.144-.144.357m0-3.77q0 .214.144.357T8 12.5h6.48q.213 0 .357-.144t.144-.357t-.144-.356t-.356-.143H8q-.213 0-.356.144t-.144.357m0-3.77q0 .213.144.357T8 8.73h8q.213 0 .356-.144q.144-.144.144-.357t-.144-.356T16 7.731H8q-.213 0-.356.144t-.144.357M18 22.116q-1.671 0-2.835-1.165Q14 19.787 14 18.116t1.165-2.836T18 14.116t2.836 1.164T22 18.116q0 1.67-1.164 2.835Q19.67 22.116 18 22.116" /></svg>
                    <p>Assets</p>
                  </div>

                </div>
              </div>

              <div style={{ height: width < 570 && toggle ? '100vh' : 'auto', overflow: (width < 570 && toggle) || popupToggle ? 'hidden' : 'none', 
                maxHeight: popupToggle? '97vh':'none'}}
                 className={`dashboard-right ${toggle ? 'l-inactive' : 'l-active'}`}>
                <div className="top-bar" >
                  <div className="menu-bar">
                    <MenuIcon onClick={() => toggledMenu()} />
                  </div>
                  <div className="search-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M11 2a9 9 0 1 0 5.618 16.032l3.675 3.675a1 1 0 0 0 1.414-1.414l-3.675-3.675A9 9 0 0 0 11 2m-6 9a6 6 0 1 1 12 0a6 6 0 0 1-12 0" clipRule="evenodd"></path></svg>
                    <input type="text" placeholder='search here' />
                  </div>
                  <div className="profile-box">
                    <img src={user.avatar.url} alt="" />
                    <div>
                      <p>{user.username}</p>
                      <p>Admin</p>
                    </div>
                  </div>
                </div>
                {
                  width < 570 && toggle &&
                  <div className="mobile-options-menu-outer">
                    <div className="mobile-options-menu">
                      <div className='dashboard-menu menu-container'>
                        <Link to='/'><img src={logo} alt="" /></Link>
                        <div className="options-container">
                          <div className={`${activeOption === 'dashboard' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('dashboard')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 21a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zM4 13a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm5-2V5H5v6zM4 21a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm1-2h4v-2H5zm10 0h4v-6h-4zM13 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1zm2 1v2h4V5z" /></svg>
                            <p>Dashboard</p>
                          </div>
                          <div className={`${activeOption === 'semester' ? 'active-option' : 'inactive-option'}`} onClick={() => {setIsHover(true)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m7 1.367l6.5 2.817L7 7L.5 4.184z" /><path d="m3.45 5.469l.006 3.064S4.529 9.953 7 9.953c2.47 0 3.55-1.42 3.55-1.42l-.001-3.064m-8.854 5.132v-5.89m.001 8.282a1.196 1.196 0 1 0 0-2.392a1.196 1.196 0 0 0 0 2.392" /></g></svg>
                            <p>Semester</p>
                          </div>
                          <div className={`${activeOption === 'notices' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('notices')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m16.394 2.021l.066.018c1.1.295 1.971.528 2.656.776c.701.253 1.273.542 1.744.983a4.75 4.75 0 0 1 1.378 2.389c.147.628.112 1.268-.02 2.001c-.127.718-.36 1.589-.655 2.688l-.536 1.999c-.294 1.099-.528 1.97-.775 2.656c-.254.7-.543 1.272-.984 1.743a4.75 4.75 0 0 1-2.302 1.358a4.75 4.75 0 0 1-1.106 1.567c-.471.441-1.043.73-1.744.984c-.685.248-1.556.481-2.655.776l-.067.018c-1.1.294-1.97.527-2.688.656c-.733.131-1.373.166-2.002.02a4.75 4.75 0 0 1-2.388-1.38c-.44-.47-.73-1.042-.984-1.743c-.247-.685-.48-1.556-.775-2.656l-.536-1.998c-.294-1.1-.528-1.97-.656-2.688c-.131-.733-.166-1.373-.02-2.002a4.75 4.75 0 0 1 1.38-2.388c.47-.44 1.042-.73 1.743-.984c.685-.247 1.556-.48 2.655-.775l.034-.01l.751-.2c.392-1.399.736-2.388 1.408-3.105a4.75 4.75 0 0 1 2.388-1.379c.629-.146 1.268-.111 2.002.02c.717.128 1.588.362 2.688.656M7.455 7.503c-1.093.293-1.876.505-2.478.722c-.61.22-.967.424-1.227.668a3.25 3.25 0 0 0-.944 1.634c-.08.348-.079.76.036 1.397c.115.647.332 1.457.637 2.597l.518 1.932c.305 1.14.523 1.95.746 2.567c.22.61.424.968.668 1.228a3.25 3.25 0 0 0 1.634.944c.347.08.76.078 1.397-.036c.647-.115 1.457-.332 2.597-.637c1.14-.306 1.95-.523 2.568-.747c.609-.22.967-.424 1.227-.667c.138-.13.263-.27.376-.419a10.077 10.077 0 0 1-.554-.095c-.672-.134-1.48-.35-2.475-.617l-.058-.015c-1.099-.295-1.97-.528-2.655-.776c-.701-.253-1.273-.542-1.744-.983a4.75 4.75 0 0 1-1.379-2.389c-.146-.628-.111-1.268.02-2.001c.128-.718.362-1.589.656-2.688zm5.987-4.661c-.638-.115-1.05-.117-1.397-.036a3.25 3.25 0 0 0-1.634.944c-.436.465-.705 1.185-1.171 2.893c-.076.278-.156.577-.243.902l-.518 1.932c-.305 1.14-.522 1.95-.637 2.597c-.115.637-.117 1.05-.036 1.397a3.25 3.25 0 0 0 .944 1.634c.26.244.618.447 1.227.668c.618.223 1.428.44 2.568.746c1.025.275 1.785.478 2.403.6c.615.123 1.033.153 1.375.111c.075-.01.146-.022.216-.038a3.25 3.25 0 0 0 1.634-.944c.244-.26.448-.618.668-1.227c.223-.618.44-1.428.746-2.568l.518-1.932c.305-1.14.522-1.95.637-2.597c.114-.637.117-1.05.036-1.397a3.25 3.25 0 0 0-.944-1.634c-.26-.244-.618-.447-1.227-.668c-.619-.223-1.428-.44-2.568-.746c-1.14-.305-1.95-.522-2.597-.637m-2.39 6.964a.75.75 0 0 1 .919-.53l4.83 1.294a.75.75 0 0 1-.389 1.448l-4.83-1.294a.75.75 0 0 1-.53-.918m-.777 2.898a.75.75 0 0 1 .92-.53l2.897.776a.75.75 0 0 1-.388 1.449l-2.898-.777a.75.75 0 0 1-.53-.918" clipRule="evenodd" /></svg>
                            <p>Notices</p>
                          </div>
                          <div className={`${activeOption === 'articles' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('articles')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m210.43 41.22l-130.25-23A14 14 0 0 0 64 29.58l-29.75 169a14 14 0 0 0 11.36 16.22l130.25 23a13.6 13.6 0 0 0 2.46.22a14 14 0 0 0 13.68-11.6l29.75-169a14 14 0 0 0-11.32-16.2M210 55.36l-29.75 169a2 2 0 0 1-.82 1.3a2 2 0 0 1-1.49.33L47.65 203a2 2 0 0 1-1.65-2.36l29.75-169a2 2 0 0 1 .82-1.3A2.06 2.06 0 0 1 78.1 30l130.25 23a2 2 0 0 1 1.65 2.36m-23.89 20.15a6 6 0 0 1-5.9 5a6 6 0 0 1-1.05-.09l-83-14.66a6 6 0 1 1 2.09-11.81l83 14.65a6 6 0 0 1 4.86 6.91M180.56 107a6 6 0 0 1-5.9 5a5.5 5.5 0 0 1-1-.1l-83-14.65a6 6 0 0 1 2.09-11.82l83 14.66a6 6 0 0 1 4.81 6.91m-47 24.19a6 6 0 0 1-5.91 4.95a6.4 6.4 0 0 1-1.05-.09l-41.49-7.33a6 6 0 1 1 2.09-11.81l41.49 7.32a6 6 0 0 1 4.84 6.99Z" /></svg>
                            Articles
                          </div>
                          <div className={`${activeOption === 'queries' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('queries')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.97 8.265a1.45 1.45 0 0 0-.487.57a.75.75 0 0 1-1.341-.67c.2-.402.513-.826.997-1.148C10.627 6.69 11.244 6.5 12 6.5c.658 0 1.369.195 1.934.619a2.45 2.45 0 0 1 1.004 2.006c0 1.033-.513 1.72-1.027 2.215c-.19.183-.399.358-.579.508l-.147.123a4 4 0 0 0-.435.409v1.37a.75.75 0 1 1-1.5 0v-1.473c0-.237.067-.504.247-.736c.22-.28.486-.517.718-.714l.183-.153l.001-.001c.172-.143.324-.27.47-.412c.368-.355.569-.676.569-1.136a.95.95 0 0 0-.404-.806C12.766 8.118 12.384 8 12 8c-.494 0-.814.121-1.03.265M13 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0" /><path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1M2.5 12a9.5 9.5 0 0 0 9.5 9.5a9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5A9.5 9.5 0 0 0 2.5 12" /></svg>
                            <p>Queries</p>
                          </div>
                          <div className={`${activeOption === 'assets' ? 'active-option' : 'inactive-option'}`} onClick={() => setActiveOption('assets')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.616 18.5v2.116q0 .153.115.269q.115.115.269.115t.27-.115t.114-.27V18.5H20.5q.154 0 .27-.115q.114-.116.114-.27q0-.153-.115-.269q-.115-.115-.269-.115h-2.116v-2.116q0-.153-.115-.269q-.115-.115-.269-.115t-.27.115t-.114.27v2.115H15.5q-.154 0-.27.115q-.114.116-.114.27q0 .153.115.269q.115.115.269.115zm-12 1.5q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h12.77q.666 0 1.14.475T20 5.615v5.116q0 .212-.144.356t-.357.144t-.356-.144t-.143-.356V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h5.116q.212 0 .356.144t.144.357t-.144.356t-.356.143zM5 18.007V19V5v6.306v-.075zm2.5-2.237q0 .213.144.356t.356.143h2.96q.212 0 .356-.144t.143-.356t-.143-.356t-.357-.144H8q-.213 0-.356.144q-.144.144-.144.357m0-3.77q0 .214.144.357T8 12.5h6.48q.213 0 .357-.144t.144-.357t-.144-.356t-.356-.143H8q-.213 0-.356.144t-.144.357m0-3.77q0 .213.144.357T8 8.73h8q.213 0 .356-.144q.144-.144.144-.357t-.144-.356T16 7.731H8q-.213 0-.356.144t-.144.357M18 22.116q-1.671 0-2.835-1.165Q14 19.787 14 18.116t1.165-2.836T18 14.116t2.836 1.164T22 18.116q0 1.67-1.164 2.835Q19.67 22.116 18 22.116" /></svg>
                            <p>Assets</p>
                          </div>

                        </div>
                      </div>
                    </div>
                    <svg onClick={() => {!isHover && toggledMenu();setPopupToggle(false)}} id='dashboard-cross-icon' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27" /></svg>
                  </div>
                }

                {
                  width < 570 ? (toggle ? setPopupToggle(true):''):''
                }

                {
                  activeOption === 'dashboard' && <DashboardPanel isHover={isHover} setIsHover={setIsHover} 
                  width={width} setActiveOption={setActiveOption} setLevel={setLevel} 
                  currentPage={currentPage} setCurrentPage={setCurrentPage} setPopupToggle={setPopupToggle}
                  />
                }
                {
                  activeOption === 'semester' && <SemesterPanel isHover={isHover} setIsHover={setIsHover}
                   width={width} setActiveOption={setActiveOption} setLevel={setLevel} level={level} 
                   setPopupToggle={setPopupToggle}   />
                }
                {
                  activeOption === 'notices' && <NoticesPanel isHover={isHover} setIsHover={setIsHover}
                  width={width} setActiveOption={setActiveOption} setPopupToggle={setPopupToggle} setLevel={setLevel}  />
                }
                {
                  activeOption === 'articles' && <ArticlesPanel isHover={isHover} setIsHover={setIsHover}
                  width={width} setActiveOption={setActiveOption} setPopupToggle={setPopupToggle} setLevel={setLevel}  />
                }
                {
                  activeOption === 'queries' && <QueriesPanel isHover={isHover} setIsHover={setIsHover}
                  width={width} setActiveOption={setActiveOption} setPopupToggle={setPopupToggle} setLevel={setLevel}/>

                }
                {
                  activeOption === 'assets' && <AssetsPanel isHover={isHover} setIsHover={setIsHover}
                  width={width} setActiveOption={setActiveOption} setPopupToggle={setPopupToggle} setLevel={setLevel}/>
                }

              </div>
            </div>
          </>
        )
      }
    </SizeListener>
  )
}

export default Dashboard
