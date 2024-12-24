import React, { Fragment, useEffect, useState } from 'react'
import './notices.css'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { getAllNotices } from '../../actions/noticeAction'
import { CLEAR_ERRORS } from '../../constants/noticeConstant'
import Pagination from 'react-js-pagination'
import Loader from '../layout/Loader/Loader'
import { Link } from 'react-router-dom'
import moment from 'moment'

const Notices = () => {
    const [currentPage, setCurrentPage] = useState(1)

    const dispatch = useDispatch();
    const alert = useAlert()

    const { notices, loading, error, totalNotices, resultPerPage } = useSelector((state) => state.notices)


    
    const getTimeAgo = (datetime) => {
        const currentTime = moment();
        const postTime = moment(datetime);
        const diffYears = currentTime.diff(postTime, 'years');

        if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        } else {
            return postTime.fromNow();
        }
    };

    useEffect(() => {
           dispatch(getAllNotices(currentPage));
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: Smooth scrolling animation
          });
    }, [dispatch, currentPage])

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: CLEAR_ERRORS })
        }
    }, [dispatch, error, alert])
    return (
        <Fragment>
            {
                loading ? <Loader /> :
                    (<Fragment>
                        <div className="cover">
                            <h2>Notices</h2>
                            <p>Page {'>>'} Notices</p>
                        </div>
                        <div className="outer-notices">
                            <div className="notices-container">
                                {
                                  notices.map((item, index) => (
                                        <Link key={index} to={`/notice/${item._id}`} ><div className={`notice ${item.category.toLowerCase() === 'notice' ? 'notice-box' :
                                            item.category.toLowerCase() === 'result' ? 'result-box' : 'exam-schedule-box'} `}>
                                            <div className="top">
                                                <div className="icon" >
                                                    {
                                                        item.category.toLowerCase() === 'notice' ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28.707 19.293L26 16.586V13a10.014 10.014 0 0 0-9-9.95V1h-2v2.05A10.014 10.014 0 0 0 6 13v3.586l-2.707 2.707A1 1 0 0 0 3 20v3a1 1 0 0 0 1 1h7v1a5 5 0 0 0 10 0v-1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707M19 25a3 3 0 0 1-6 0v-1h6Z" /></svg> :
                                                            item.category.toLowerCase() === 'result' ? <svg style={{ transform: 'scaleX(-1)', fontSize: '38px' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 89.61L22.486 177.18L256 293.937l111.22-55.61l-104.337-31.9A16 16 0 0 1 256 208a16 16 0 0 1-16-16a16 16 0 0 1 16-16l-2.646 8.602l18.537 5.703l.008.056l27.354 8.365L455 246.645v12.146a16 16 0 0 0-7 13.21a16 16 0 0 0 7.293 13.406C448.01 312.932 448 375.383 448 400c16 10.395 16 10.775 32 0c0-24.614-.008-87.053-7.29-114.584A16 16 0 0 0 480 272a16 16 0 0 0-7-13.227v-25.42L413.676 215.1l75.838-37.92zM119.623 249L106.5 327.74c26.175 3.423 57.486 18.637 86.27 36.627c16.37 10.232 31.703 21.463 44.156 32.36c7.612 6.66 13.977 13.05 19.074 19.337c5.097-6.288 11.462-12.677 19.074-19.337c12.453-10.897 27.785-22.128 44.156-32.36c28.784-17.99 60.095-33.204 86.27-36.627L392.375 249h-6.25L256 314.063L125.873 249z" /></svg> :
                                                                <svg style={{ fontSize: '32px' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14a1 1 0 1 0-1-1a1 1 0 0 0 1 1m5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1m-5 4a1 1 0 1 0-1-1a1 1 0 0 0 1 1m5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1M7 14a1 1 0 1 0-1-1a1 1 0 0 0 1 1M19 4h-1V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16Zm0-11H4V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1ZM7 18a1 1 0 1 0-1-1a1 1 0 0 0 1 1" /></svg>
                                                    }

                                                </div>
                                                <div className='type-time'>
                                                    <h4>{item.category}</h4>
                                                    <p>{getTimeAgo(item.createdAt)}</p>
                                                </div>
                                            </div>
                                            <h3>{item.title}</h3>
                                        </div>
                                        </Link>
                                    ))
                                }


                            </div>

                            {totalNotices > resultPerPage && <div className="paginationBox">
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={resultPerPage}
                                    totalItemsCount={totalNotices}
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

                    </Fragment>)
            }

        </Fragment>
    )
}

export default Notices
