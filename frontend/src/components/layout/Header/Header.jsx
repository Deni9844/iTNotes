import React, { Fragment, useEffect, useState } from 'react'
import logo from '../../../images/Logo.png'
import { Link } from 'react-router-dom'
import './Header.css'
import WindowSizeListener from '../../../WindowResizeListener'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useSelector } from 'react-redux'
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useDispatch } from 'react-redux'
import { clearMessage, logOut , getAtivePurchasedItem } from '../../../actions/userActon'
import { useAlert } from 'react-alert';
import { clearErrors } from '../../../actions/semesterAction'
import Loader from '../Loader/Loader'
import { googleLogout } from '@react-oauth/google';
import { CLEAR_ACTIVE_PURCHASE } from '../../../constants/userConstants'

const Header = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [toggle, setToggle] = useState(false);
    const [semester, setSemester] = useState(false);
    const [help, setHelp] = useState(false);
    const [isHovered, setIsHovered] = useState(null);
    const [accountPanal, setAccountPanal] = useState(false);

    const { isAuthenticated, user, error, loading, message } = useSelector((state) => state.user)

    const handleMenuClick = () => {
        setToggle(!toggle)
        if (!toggle) {
            document.body.style.height = '100vh';
            document.body.style.overflow = 'hidden';

        } else {
            document.body.style.height = 'auto';
            document.body.style.overflow = 'visible';
        }

    }

    const handleMouseEnter = (itemName) => {
        setIsHovered(itemName);
    }

    const handleMouseLeave = () => {
        setIsHovered(null);
    }

    const handleSemesterClick = () => {
        setSemester(!semester)
    }

    const handleHelpClick = () => {
        setHelp(!help)
    }

    const handleBackClick = (input) => {
        input === 'semester' ? setSemester(!semester) : setHelp(!help)
    }

    const handleLogOut = () => {
        googleLogout()
        dispatch({type:CLEAR_ACTIVE_PURCHASE})
        dispatch(logOut())
        
    }

    const handleMenuClickAndLogout = () => {
        handleMenuClick();
        handleLogOut();
    }

    useEffect(() => {
        if (error) {
            if (error !== "Please login to access this resources")
                alert.error(error)
            dispatch(clearErrors())
        }

        if (message) {
            alert.success(message);
            dispatch(clearMessage())
        }
    }, [error, alert, message, dispatch])
    return (
        <WindowSizeListener>
            {(width) => (

                loading ? <Loader /> :
                    <Fragment>
                        <div className="outer-navBar" >
                            <div className="navBar">
                                <Link to='/' className='a-logo'><img className='logo' src={logo} alt="" /> </Link>
                                {
                                    width >= 955 ? <Fragment>
                                        <ul className='nav-items-container'>
                                            <div className='div-navItem first' onMouseEnter={() => handleMouseEnter('semester')} onMouseLeave={() => handleMouseLeave()}  >
                                                <li>Semester</li>
                                                <div className={`nav-item ${isHovered === 'semester' ? 'active' : 'inactive'}`} onMouseEnter={() => handleMouseEnter('semester')} >
                                                    <Link to='/semester/first'>First Semester</Link>
                                                    <Link to='/semester/second'>Second Semester</Link>
                                                    <Link to='/semester/third'>Third Semester</Link>
                                                    <Link to='/semester/fourth'>Fourth Semester</Link>
                                                    <Link to='/semester/fifth'>Fifth Semester</Link>
                                                    <Link to='/semester/sixth'>Sixth Semester</Link>
                                                    <Link to='/semester/seventh'>Seventh Semester</Link>
                                                    <Link to='/semester/eight'>Eight Semester</Link>
                                                </div>
                                            </div>
                                            <Link to='/questions'><li>Questions</li></Link>
                                            <Link to='/subscription-plan'>Subscription</Link>
                                            <Link to='/notices'><li>Notices</li></Link>
                                            <Link to='/articles'><li>Articles</li></Link>
                                            <div className='div-navItem lasts' onMouseEnter={() => handleMouseEnter('help')} onMouseLeave={() => handleMouseLeave()}  >
                                                <li>Help</li>
                                                <div className={` nav-item ${isHovered === 'help' ? 'active' : 'inactive'}`} >
                                                    <Link to={'/askquestion'}>Ask question</Link>
                                                    <Link to={'/contactus'}>Contact Us</Link>
                                                    <Link to={'/contribute'}>Contribute</Link>
                                                </div>
                                            </div>
                                        </ul>
                                        {
                                            isAuthenticated ? <div className='logged-user-btn' onClick={() => setAccountPanal(!accountPanal)}>
                                                <img src={user?.avatar.url} alt="" style={{
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat'
                                                }} />
                                                <p>{user?.username}</p>
                                                {
                                                    accountPanal &&
                                                    <div className='account-panal'>
                                                        <div>
                                                            <EditIcon />
                                                            <Link to='/account'>Edit profile</Link>
                                                        </div>
                                                        <div onClick={handleLogOut}>
                                                            <LogoutIcon />
                                                            <Link>Log out</Link>
                                                        </div>
                                                        {
                                                            user.role === "admin" &&
                                                        <div >
                                                            <DashboardIcon />

                                                                <Link to='/admin/dashboard'>Dashboard</Link>         
                                                        </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                                : <div className='nav-buttons'>
                                                    <Link to='/login' ><input type="button" value="Log in" /> </Link>`
                                                    <Link to='/signup'><input type="button" value="Sign up" /></Link>
                                                </div>
                                        }


                                    </Fragment> : <div className='left-nav-options'>
                                        {
                                            isAuthenticated && <div className='logged-user-btn' onClick={() => setAccountPanal(!accountPanal)}>
                                                <img src={user.avatar.url} alt="" style={{
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat'
                                                }} />
                                                <p>{user.username}</p>
                                                {
                                                    accountPanal &&
                                                    <div className='account-panal'>
                                                        <div>
                                                            <EditIcon />
                                                            <Link to='/account'>Edit profile</Link>
                                                        </div>
                                                        <div onClick={handleLogOut}>
                                                            <LogoutIcon />
                                                            <Link>Log out</Link>
                                                        </div>
                                                        {
                                                            user.role === "admin" &&
                                                        <div >
                                                            <DashboardIcon />

                                                                <Link to='/admin/dashboard'>Dashboard</Link>         
                                                        </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        }

                                        <div className="menu-icon">
                                            <MenuIcon onClick={handleMenuClick} style={{ cursor: 'pointer' }} />

                                        </div>

                                    </div>



                                }




                            </div>
                        </div>

                        <div className={`menu ${toggle ? 'menu-bg-active' : 'menu-bg-inactive'}`}>
                            <div className='menu-content'>
                                <CloseIcon onClick={handleMenuClick} style={{ cursor: 'pointer' }} />
                                <div>
                                    <div className='expand flag' onClick={handleSemesterClick}>
                                        <p >Semester  </p>
                                        <ArrowRightIcon />
                                    </div>

                                    <Link onClick={handleMenuClick} to='/questions'>Questions</Link>
                                    <Link onClick={handleMenuClick} to='/subscription-plan'>Subscription</Link>
                                    <Link onClick={handleMenuClick} to='/notices'>Notices</Link>
                                    <Link onClick={handleMenuClick} to='/articles'>Articles</Link>
                                    <div className='expand flag' onClick={handleHelpClick}>
                                        <p >Help  </p>
                                        <ArrowRightIcon />
                                    </div>
                                    {
                                        isAuthenticated ? <div className='nav-buttons'>
                                            <Link onClick={handleMenuClick} to='/account' >

                                                <input type="button" value="Account" />
                                            </Link>
                                            <Link onClick={handleMenuClickAndLogout} to='' >

                                                <input type="button" value="Log out" />
                                            </Link>


                                        </div> :
                                            <div className='nav-buttons'>
                                                <Link onClick={handleMenuClick} to='/login' ><input type="button" value="Log in" /> </Link>
                                                <Link onClick={handleMenuClick} to='/signup' >  <input type="button" value="Sign up" /></Link>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className={`semester ${semester || help ? 'sem-enabled' : 'sem-disabled'}`}>
                                {semester && <Fragment>
                                    <div className='expand'>
                                        <KeyboardArrowLeftIcon onClick={() => handleBackClick('semester')} />
                                        <p >Semester  </p>
                                        <CloseIcon onClick={handleMenuClick} style={{ cursor: 'pointer' }} />
                                    </div>
                                    <Link onClick={handleMenuClick} to='/semester/first'>First Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/second'>Second Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/third'>Third Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/fourth'>Fourth Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/fifth'>Fifth Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/sixth'>Sixth Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/seventh'>Seventh Semester</Link>
                                    <Link onClick={handleMenuClick} to='/semester/eight'>Eight Semester</Link>
                                </Fragment>}

                                {help && <Fragment>
                                    <div className='expand'>
                                        <KeyboardArrowLeftIcon onClick={() => handleBackClick('help')} />
                                        <p >Help  </p>
                                        <CloseIcon onClick={handleMenuClick} style={{ cursor: 'pointer' }} />
                                    </div>
                                    <Link to='/askquestion' onClick={handleMenuClick} >Ask question</Link>
                                    <Link to='/contactus' onClick={handleMenuClick} >Contact Us</Link>
                                    <Link to='/contribute' onClick={handleMenuClick} >Contribute</Link>
                                </Fragment>}
                            </div>
                        </div>


                    </Fragment>

            )}
        </WindowSizeListener>

    )
}

export default Header
