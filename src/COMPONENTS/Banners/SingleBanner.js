import React from 'react'
import './SingleBanner.css'

const SingleBanner = ({bannerimage, heading}) => {
  return (
    <div className='singlebanner'>
        {/* <div className='bannerimgfilter'></div> */}
        <img className='bannerimg' src={bannerimage} alt='noimg' />
    </div>
  )
}

export default SingleBanner