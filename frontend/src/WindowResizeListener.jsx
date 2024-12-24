import React, { useEffect, useState } from 'react'

const WindowResizeListener = ({children}) => {
    const [width,setWidth] = useState(window.innerWidth);

    const handleResize = () =>{
       setWidth(window.innerWidth) ;
    }

    useEffect(()=>{
    window.addEventListener("resize",handleResize);

    //cleanup function when component about to unmount
    return()=>{
        window.removeEventListener("resize",handleResize);
    }

    },[])
  return children(width)
}

export default WindowResizeListener
