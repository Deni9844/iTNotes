import React, { useEffect, useState } from 'react'
import './Account.css'
import { Link } from 'react-router-dom'
import facebook from '../../images/facebook.png'
import instagram from '../../images/instagram.png'
import twitter from '../../images/twitter.png'
import youtube from '../../images/youtube.png'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { cancelPurchasedItem, clearMessage, deletePurchasedItem, getAllPurchases,
   getAtivePurchasedItem, updateDetails } from '../../actions/userActon'
import Loader from '../layout/Loader/Loader'
import { useNavigate } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import { useAlert } from 'react-alert'
import { ArrowBack } from '@mui/icons-material'
import moment from 'moment'
import Pagination from 'react-js-pagination'
import { CLEAR_ERROR } from '../../constants/adminConstants'
import { CANCEL_PURCHASE_RESET, DELETE_PURCHASE_RESET } from '../../constants/userConstants'

const Account = () => {
  const [active, setActive] = useState('dashboard')
  const { user, loading, isAuthenticated } = useSelector((state) => state.user)
  const { purchases, loading: purchaseLoader, error, totalPurchases } = useSelector((state) => state.purchase)
  const { isPurchasedItemDeleted, isPurchasedItemCancelled, error: profileError } = useSelector((state) => state.profile)
  const { activePurchases, error: activeError } = useSelector((state) => state.activePurchase)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [status, setStatus] = useState('')
  const [college, setCollege] = useState('')
  const [semester, setSemester] = useState('')
  const [fbUrl, setFbUrl] = useState('')
  const [ytUrl, setYtUrl] = useState('')
  const [twUrl, setTwUrl] = useState('')
  const [igUrl, setIgUrl] = useState('')
  const [pass, setPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [conPass, setConPass] = useState('')
  const [purchase, setPurchase] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [timeLeft, setTimeLeft] = useState([])
  const [hasExpired, setHasExpired] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const alert = useAlert()

  const resultPerPage = 10

  const options = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
  ]

  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  const handleUpdateDetails = () => {
    const formData = {
      username,
      email,
      semester,
      college,
      status,
      phoneNum: number,
      facebook: fbUrl,
      instagram: igUrl,
      twitter: twUrl,
      youtube: ytUrl,
      currentPass: pass,
      newPass: newPass,
      confirmNewPass: conPass
    }

    dispatch(updateDetails(formData))
  }

  const getPlan = (purchase) => {
    return purchase.plan.charAt(0).toUpperCase() + purchase.plan.slice(1)
  }

  const getDate = (datetime) => {
    return moment(datetime).format('MMMM D, YYYY')
  };

  useEffect(() => {
    dispatch(getAllPurchases(currentPage))
    dispatch(getAtivePurchasedItem())
  }, [currentPage])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      setUsername(user.username)
      setEmail(user.email)
      setNumber(user.phoneNum)
      setStatus(user.status)
      setCollege(user.college)
      setSemester(user.semester)
      setFbUrl(user.facebook)
      setIgUrl(user.instagram)
      setTwUrl(user.twitter)
      setYtUrl(user.youtube)
    }
  }, [user, isAuthenticated, navigate, dispatch])

  useEffect(() => {
    if (error || profileError || activeError) {
      alert.error(error || profileError || activeError)
      dispatch(profileError ? dispatch({ type: CLEAR_ERROR }) : clearMessage())
    }

    if (isPurchasedItemDeleted) {
      alert.success("Item deleted successdully")
      dispatch({ type: DELETE_PURCHASE_RESET })
      dispatch(getAllPurchases(currentPage))
    }

    if (isPurchasedItemCancelled) {
      alert.success("Subscription cancelled successdully")
      dispatch({ type: CANCEL_PURCHASE_RESET })
      dispatch(getAllPurchases(currentPage))
    }

  }, [error, profileError, activeError, isPurchasedItemDeleted, isPurchasedItemCancelled, dispatch, alert])

  useEffect(() => {
    if (activePurchases) {
      const initialTimeLeft = activePurchases.map(purchase => {
        const targetDate = new Date(purchase.endDate);
        return Math.max(0, targetDate - Date.now());
      });
      setTimeLeft(initialTimeLeft);
      setHasExpired(Array(activePurchases.length).fill(false)); // Initialize all as not expired

      const intervalId = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          const updatedTimeLeft = prevTimeLeft.map((time, index) => {
            if (time === 0 && !hasExpired[index]) {
              dispatch(getAtivePurchasedItem());
              setHasExpired(prev => {
                const newHasExpired = [...prev];
                newHasExpired[index] = true;
                return newHasExpired;
              });
            }
            return Math.max(0, time - 1000);
          });
          return updatedTimeLeft;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [activePurchases, dispatch]);


  const formatTime = (timeInMilliseconds) => {
    const timeInSeconds = Math.floor(timeInMilliseconds / 1000);

    const days = Math.floor(timeInSeconds / (24 * 3600));
    const hours = Math.floor((timeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;
  };


  return (
    <>
      {
        (loading || purchaseLoader) ? <Loader /> :
          isAuthenticated &&
          <>
            <div className="account-outer">
              <div className="account">
                <div className="account-top">
                  <div className="profile">
                    <div className="profile-img">
                      <img src={user.avatar.url} alt="" />
                    </div>
                    <div className="name">
                      <h3>{user.username}</h3>
                      <p>@{user.username}</p>
                    </div>
                  </div>
                  <div className="navbar">
                    <ul>
                      <li className={active === 'dashboard' ? 'active' : 'inactive'} onClick={() => setActive('dashboard')}>Dashboard</li>
                      <li className={(active === 'subscriptions' || active === 'sub-details') ? 'active' : 'inactive'} onClick={() => setActive('subscriptions')}>Subscriptions</li>
                      <li className={active === 'details' ? 'active' : 'inactive'} onClick={() => setActive('details')}>Account details</li>
                      <li className={active === 'subscribed' ? 'active' : 'inactive'} onClick={() => setActive('subscribed')}>Subscribed</li>
                    </ul>
                  </div>
                </div>

                <div className="bottom">
                  <div className="bottom-left">
                    <div className="top">
                      <div className='name'>
                        <p>{user.username}</p>
                        <p>{user.status}</p>
                      </div>
                      <div className='cont'>
                        <div>
                          <p>{user.questions}</p>
                          <p>Questions</p>
                        </div>
                        <div>
                          <p>{user.contributions}</p>
                          <p>Contribution</p>
                        </div>
                      </div>
                    </div>

                    <div className="down">
                      <div className="contact">
                        <h3>Contact</h3>
                        <div className='socialMedia'>
                          <Link to={user.youtube}><img src={youtube} alt="" id='yt' /></Link>
                          <Link to={user.facebook}><img src={facebook} alt="" id='fb' /></Link>
                          <Link to={user.instgram}><img src={instagram} alt="" id='ig' /></Link>
                          <Link to={user.twitter}><img src={twitter} alt="" id='tw' /></Link>
                        </div>
                      </div>

                      <div className="role">
                        <p>I am</p>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 8 8"><path fill="currentColor" d="M4 0C2.9 0 2 1.12 2 2.5S2.9 5 4 5s2-1.12 2-2.5S5.1 0 4 0M1.91 5C.85 5.05 0 5.92 0 7v1h8V7c0-1.08-.84-1.95-1.91-2c-.54.61-1.28 1-2.09 1c-.81 0-1.55-.39-2.09-1" /></svg>{user.status}</p>
                      </div>
                      <div className="college">
                        <p>College</p>
                        <p ><svg id='clz-icon' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 89.61L22.486 177.18L256 293.937l111.22-55.61l-104.337-31.9A16 16 0 0 1 256 208a16 16 0 0 1-16-16a16 16 0 0 1 16-16l-2.646 8.602l18.537 5.703l.008.056l27.354 8.365L455 246.645v12.146a16 16 0 0 0-7 13.21a16 16 0 0 0 7.293 13.406C448.01 312.932 448 375.383 448 400c16 10.395 16 10.775 32 0c0-24.614-.008-87.053-7.29-114.584A16 16 0 0 0 480 272a16 16 0 0 0-7-13.227v-25.42L413.676 215.1l75.838-37.92zM119.623 249L106.5 327.74c26.175 3.423 57.486 18.637 86.27 36.627c16.37 10.232 31.703 21.463 44.156 32.36c7.612 6.66 13.977 13.05 19.074 19.337c5.097-6.288 11.462-12.677 19.074-19.337c12.453-10.897 27.785-22.128 44.156-32.36c28.784-17.99 60.095-33.204 86.27-36.627L392.375 249h-6.25L256 314.063L125.873 249z" /></svg> {user.college}</p>
                      </div>
                      <div className="semester">
                        <p>Semester</p>
                        <p><svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8M13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3c0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57c0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6" /></svg> {user.semester}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bottom-right">
                    {
                      active === 'dashboard' ? <>
                        <h3>About Me</h3>
                        <div className="flName">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 8 8"><path fill="currentColor" d="M4 0C2.9 0 2 1.12 2 2.5S2.9 5 4 5s2-1.12 2-2.5S5.1 0 4 0M1.91 5C.85 5.05 0 5.92 0 7v1h8V7c0-1.08-.84-1.95-1.91-2c-.54.61-1.28 1-2.09 1c-.81 0-1.55-.39-2.09-1"></path></svg>
                            <p>Username: <span>{user.username}</span> </p>
                          </div>
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 8 8"><path fill="currentColor" d="M4 0C2.9 0 2 1.12 2 2.5S2.9 5 4 5s2-1.12 2-2.5S5.1 0 4 0M1.91 5C.85 5.05 0 5.92 0 7v1h8V7c0-1.08-.84-1.95-1.91-2c-.54.61-1.28 1-2.09 1c-.81 0-1.55-.39-2.09-1"></path></svg>
                            <p>Status: <span>{user.status}</span></p>
                          </div>
                        </div>
                        <div className="semClz">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8M13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3c0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57c0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6"></path></svg>
                            <p>Semester: <span>{user.semester} Semester</span></p>
                          </div>

                          <div>
                            <svg id='clz-icon' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 89.61L22.486 177.18L256 293.937l111.22-55.61l-104.337-31.9A16 16 0 0 1 256 208a16 16 0 0 1-16-16a16 16 0 0 1 16-16l-2.646 8.602l18.537 5.703l.008.056l27.354 8.365L455 246.645v12.146a16 16 0 0 0-7 13.21a16 16 0 0 0 7.293 13.406C448.01 312.932 448 375.383 448 400c16 10.395 16 10.775 32 0c0-24.614-.008-87.053-7.29-114.584A16 16 0 0 0 480 272a16 16 0 0 0-7-13.227v-25.42L413.676 215.1l75.838-37.92zM119.623 249L106.5 327.74c26.175 3.423 57.486 18.637 86.27 36.627c16.37 10.232 31.703 21.463 44.156 32.36c7.612 6.66 13.977 13.05 19.074 19.337c5.097-6.288 11.462-12.677 19.074-19.337c12.453-10.897 27.785-22.128 44.156-32.36c28.784-17.99 60.095-33.204 86.27-36.627L392.375 249h-6.25L256 314.063L125.873 249z"></path></svg>
                            <p>College: <span>{user.college}</span></p>
                          </div>
                        </div>
                      </> : active === "subscriptions" ? <>
                        <table className='w-[100%] '>
                          <tbody>
                            <tr className='border-[1px] border-black-opacity-30 '>
                              <th className='p-2 text-start text-[0.9rem]'>Subscription</th>
                              <th className='p-2 text-start text-[0.9rem]'>Status</th>
                              <th className='p-2 text-start text-[0.9rem]'>Total</th>
                            </tr>
                            {
                              purchases.map((p, i) => (
                                <tr className='border-[1px] border-black-opacity-30' key={i}>
                                  <td className='p-[0.6rem] text-base'>#{p._id.slice(-5)}</td>
                                  <td className='p-[0.6rem] text-base'>{p.status}</td>
                                  <td className='p-[0.6rem] text-base'>{p.totalPrice}</td>
                                  <td><button className=' rounded-sm font-bold py-[0.3rem] px-[0.8rem] text-[0.9rem]
                             bg-black-opacity-10 flex items-center text-black-opacity-80' onClick={() => { setPurchase(p); setActive('sub-details') }}>View</button></td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>

                        {totalPurchases > resultPerPage && <div className="paginationBox">
                          <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={totalPurchases}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                          />
                        </div>}


                      </> : active === "sub-details" && purchase ? <>
                        <ArrowBack style={{ fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setActive('subscriptions')} />
                        <p className='text-[0.97rem] mb-5'>Order <span className='font-bold'>#{purchase._id.slice(-5)}</span> was placed on <span className='font-bold'>{getDate(purchase.startDate)}</span> and is currently <span className='font-bold'>{purchase.status}</span></p>
                        <h2 className='font-bold text-xl mb-3'>Order details</h2>
                        <p className='h-[1.5px] bg-black-opacity-30 mb-3'></p>
                        <table className='text-[1.09rem] w-[100%] mb-3'>
                          <tbody>
                            <tr className='border-[1px] border-black-opacity-20'>
                              <th className='text-start p-3'>Product</th>
                              <th className='text-start p-3'>Total</th>
                            </tr>
                            <tr className='border-[1px] border-black-opacity-20'>
                              <td className='text-start p-3'>Subscription Plan - {getPlan(purchase)} Plan × {purchase.slot}
                                <p className='block'><span className='font-bold'>Plans:</span> {getPlan(purchase)} Plan </p></td>
                              <td className='text-start p-3'>₨ {purchase.totalPrice}</td>
                            </tr>
                            <tr className='border-[1px] border-black-opacity-20'>
                              <th className='text-start p-3'>Subtotal:</th>
                              <th className='text-start p-3'>₨ {purchase.totalPrice}</th>
                            </tr>
                            <tr className='border-[1px] border-black-opacity-20'>
                              <th className='text-start p-3'>Payment method:</th>
                              <th className='text-start p-3'>iTNotes Automated Esewa Checkout</th>
                            </tr>
                            <tr className='border-[1px] border-black-opacity-20'>
                              <th className='text-start p-3'>Total:</th>
                              <th className='text-start p-3'>₨ {purchase.totalPrice}</th>
                            </tr>
                          </tbody>
                        </table>
                        <div className='flex mb-6 justify-center gap-3'>
                          {
                            purchase.status === "pending" ? (<>
                              <Link to={`/checkout?id=${purchase._id}&slot=${purchase.slot}&mnth=${purchase.plan === "monthly" ? 1 : purchase.plan === "quarterly" ? 6 : 12}`}><button className='rounded-sm font-bold py-[0.3rem] px-4 text-[0.9rem]
                             bg-[#b8bce0]  flex items-center text-black-opacity-80' >Pay</button> </Link>

                              <button className='rounded-sm font-bold py-[0.3rem] px-4 text-[0.9rem]
                             bg-black-opacity-10 flex items-center text-black-opacity-80' onClick={() => { setActive('subscriptions'); dispatch(cancelPurchasedItem(purchase._id)) }}>Cancel</button>

                            </>) : purchase.status !== "pending" && <button className='rounded-sm font-bold py-[0.3rem] px-4 text-[0.9rem]
                              bg-black-opacity-10 flex items-center text-black-opacity-80' onClick={() => { setActive('subscriptions'); dispatch(deletePurchasedItem(purchase._id)) }}>Delete</button>
                          }

                        </div>


                        <h2 className='font-bold text-xl mb-3'>Billing address</h2>
                        <p className='h-[1px] bg-black-opacity-30 mb-3'></p>
                        <div className='p-2 address '>
                          <p className='text-[1.09rem] mb-2'>{user.username}</p>
                          <p className='flex items-center gap-[0.4rem] mb-2'><CallIcon style={{ fontSize: '1.1rem' }} /><span className='text-[0.97rem] font-normal'>{user.phoneNum}</span></p>
                          <p className='flex items-center gap-[0.4rem]'><EmailIcon style={{ fontSize: '1.2rem' }} /><span className='text-[0.97rem] font-normal'>{user.email}</span></p>
                        </div>
                      </> : active === "subscribed" ? <>
                        {activePurchases && activePurchases.length > 0 ?
                          activePurchases.map((e, i) => (
                            <div>
                              {
                                timeLeft[i] > 0 && <div className='mb-5 shadow-custom p-6'>
                                  <p style={{ fontSize: '1.1rem' }} className=' mb-2'>You have subscribed to plan: <span className='font-bold text-black-opacity-80'>{getPlan(e)} plan x {e.slot}</span></p>
                                  <p style={{ fontSize: '1.05rem' }} className='flex items-center'>Your subscription ends in <span className=' ml-2 font-bold text-2xl text-black-opacity-80'>
                                    {formatTime(timeLeft[i])}
                                  </span></p>
                                </div>
                              }

                            </div>
                          ))
                          :
                          <p className='text-[1.05rem]'>You do not have any active subscription(s).</p>
                        }
                      </> : <>
                        <div className="input-block single">
                          <p>Display name <span>*</span></p>
                          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="input-block single">
                          <p>Email Address <span>*</span></p>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <p className='heading'>Additional Information</p>
                        <div className="input-block single">
                          <p>Phone Number(optional)</p>
                          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>
                        <div className="input-block single">
                          <p>You are <span>*</span></p>
                          <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="parent">Parent</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="input-block-2">
                          <div className="input-block">
                            <p>College Name <span>*</span></p>
                            <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} />
                          </div>
                          <div className="input-block">
                            <p>Studying? <span>*</span></p>
                            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                              {
                                options.map((option, indx) => (
                                  <option key={indx} value={option.charAt(0).toLowerCase() + option.slice(1)}>{option} Semester</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                        <p className='heading'>Social Information</p>
                        <div className="input-block-2">
                          <div className="input-block">
                            <p>Facebook(optional)</p>
                            <input type="text" value={fbUrl} onChange={(e) => setFbUrl(e.target.value)} />
                          </div>
                          <div className="input-block">
                            <p>Youtube(optional)</p>
                            <input type="text" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} />
                          </div>
                        </div>
                        <div className="input-block-2">
                          <div className="input-block">
                            <p>Instagram(optional)</p>
                            <input type="text" value={igUrl} onChange={(e) => setIgUrl(e.target.value)} />
                          </div>
                          <div className="input-block">
                            <p>Twitter(optional)</p>
                            <input type="text" value={twUrl} onChange={(e) => setTwUrl(e.target.value)} />
                          </div>
                        </div>

                        <p className='heading'>Password Change</p>
                        <div className="input-block single">
                          <p>Current password (leave blank to leave unchanged)</p>
                          <input type="text" onChange={(e) => setPass(e.target.value)} />
                        </div>
                        <div className="input-block single">
                          <p>New password (leave blank to leave unchanged)</p>
                          <input type="text" onChange={(e) => setNewPass(e.target.value)} />
                        </div>
                        <div className="input-block single">
                          <p>Confirm password</p>
                          <input type="text" onChange={(e) => setConPass(e.target.value)} />
                        </div>
                        <div className='btn' onClick={() => handleUpdateDetails()}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.414A2 2 0 0 0 19.414 5L17 2.586A2 2 0 0 0 15.586 2zm10.238 8.793a1 1 0 1 0-1.414-1.414l-4.242 4.243l-1.415-1.415a1 1 0 0 0-1.414 1.414l2.05 2.051a1.1 1.1 0 0 0 1.556 0l4.88-4.879Z" /></g></svg>
                          <input type="submit" value="Save changes" />
                        </div>
                      </>
                    }

                  </div>
                </div>
              </div>
            </div>

          </>
      }
    </>

  )
}

export default Account
