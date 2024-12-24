import React, { Fragment, useEffect, useState } from 'react'
import './article.css'
import cover from '../../images/article_cover.png'
import { clearError, getAllArticles } from '../../actions/articleAction'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import moment from 'moment'
import Pagination from 'react-js-pagination'
import Loader from '../layout/Loader/Loader'
import { Link } from 'react-router-dom'

const Articels = () => {
  const dispatch = useDispatch()
  const [currentPage,setCurrentPage] = useState(1)

  const { articles, error, loading, totalArticles,resultPerPage} = useSelector((state) => state.articles)

  const alert = useAlert()

  const info = {
    resultPerPage : 6
}

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
    dispatch(getAllArticles(currentPage,6));
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [dispatch,currentPage])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }
  }, [dispatch, error, alert])

  return (
    <Fragment>
      {loading ? <Loader /> : (<>
        <div className="cover">
          <h2>Articles</h2>
          <p>Page {'>>'} Articles</p>
        </div>
        <div className="outer-articles">
          <div className="articles-container">
            {
              articles && articles.map((item, index) => (
                <Link to={`/article/${item._id}`} key={index} style={{textDecoration:'none',color:'#000000'}}>
                <div className="article">
                  <img src={cover} alt="" />
                  <div className="more-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1c117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48m126.42 327.25a4 4 0 0 1-6.14-.32a124.3 124.3 0 0 0-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.2 124.2 0 0 0-32.35 29.58a4 4 0 0 1-6.14.32A175.32 175.32 0 0 1 80 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 0 1-46.68 119.25" /><path fill="currentColor" d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144" /></svg>
                    <span>{item.author}</span>
                    <svg className="date" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="m960 95.888l-256.224.001V32.113c0-17.68-14.32-32-32-32s-32 14.32-32 32v63.76h-256v-63.76c0-17.68-14.32-32-32-32s-32 14.32-32 32v63.76H64c-35.344 0-64 28.656-64 64v800c0 35.343 28.656 64 64 64h896c35.344 0 64-28.657 64-64v-800c0-35.329-28.656-63.985-64-63.985m0 863.985H64v-800h255.776v32.24c0 17.679 14.32 32 32 32s32-14.321 32-32v-32.224h256v32.24c0 17.68 14.32 32 32 32s32-14.32 32-32v-32.24H960zM736 511.888h64c17.664 0 32-14.336 32-32v-64c0-17.664-14.336-32-32-32h-64c-17.664 0-32 14.336-32 32v64c0 17.664 14.336 32 32 32m0 255.984h64c17.664 0 32-14.32 32-32v-64c0-17.664-14.336-32-32-32h-64c-17.664 0-32 14.336-32 32v64c0 17.696 14.336 32 32 32m-192-128h-64c-17.664 0-32 14.336-32 32v64c0 17.68 14.336 32 32 32h64c17.664 0 32-14.32 32-32v-64c0-17.648-14.336-32-32-32m0-255.984h-64c-17.664 0-32 14.336-32 32v64c0 17.664 14.336 32 32 32h64c17.664 0 32-14.336 32-32v-64c0-17.68-14.336-32-32-32m-256 0h-64c-17.664 0-32 14.336-32 32v64c0 17.664 14.336 32 32 32h64c17.664 0 32-14.336 32-32v-64c0-17.68-14.336-32-32-32m0 255.984h-64c-17.664 0-32 14.336-32 32v64c0 17.68 14.336 32 32 32h64c17.664 0 32-14.32 32-32v-64c0-17.648-14.336-32-32-32" /></svg>
                    <span>{getTimeAgo(item.createdAt)}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <button>Read More  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 12l-6-6m6 6l-6 6m6-6H5" /></svg></button>
                </div>
                </Link>
              ))
            }

          </div>

          {totalArticles > Number(resultPerPage) && <div className="paginationBox">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={Number(resultPerPage)}
              totalItemsCount={totalArticles}
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
        </div></>)
      }

    </Fragment>
  )
}

export default Articels
