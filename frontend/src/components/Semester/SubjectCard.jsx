import React from 'react'
import codeIcon from '../../images/code.png'
import chapterIcon from '../../images/chapter.png'
import favouriteIcon from '../../images/favourite.png'
import rightArrowIcon from '../../images/rightArrow.png'
import { Link } from 'react-router-dom'

const SubjectCard = ({ item }) => {
    const maxLength = 100

    const truncateText = (text) => {        
       return text.length > maxLength ? text.substring(0, maxLength) + ' . . .' : text
    }

    return (
        <Link to={`/semester/${item.semester}/${item.subject}`} style={{ textDecoration: "none", color: 'black' }}>
            <div className='cs-card'>
                <h4>{item.subject}</h4>
                <p>{truncateText(item.description)}</p>
                <div className="cd-ch-container">
                    <div className="code">
                        <img src={codeIcon} alt="" />
                        <span>{item.code}</span>
                    </div>
                    <div className="chapter">
                        <img src={chapterIcon} alt="" />
                        <span>{item.chapters?.length}+</span>
                    </div>
                </div>
                <div className="hr-line">

                </div>
                <div className="card-bottom">
                    <img src={favouriteIcon} alt="" />
                    <button type='submit'>Explore Chapter <img src={rightArrowIcon} alt="" /></button>
                </div>
            </div>
        </Link>


    )
}

export default SubjectCard
