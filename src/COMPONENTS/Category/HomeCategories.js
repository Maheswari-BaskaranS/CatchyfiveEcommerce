import React from 'react'
import './HomeCategories.css'
import img1 from '../../ASSETS/Images/1.png'
import img2 from '../../ASSETS/Images/2.png'
import img3 from '../../ASSETS/Images/3.png'
import img4 from '../../ASSETS/Images/4.png'
import { Link } from 'react-router-dom';

const HomeCategories = () => {

  const handleCategoryClick  = (category) => {
    window.location.href = `/Home/${category}/all`
  }


  return (
    <></>
    // <div className='homecategories'>
    //   <div className='container image-hover-effect' onClick={(e) => {handleCategoryClick('DISHWASHING')}}>
    //     <img className="image-hover-effect" src={img1} alt='img1' />
    //     <div className='content'>
    //       <h1>
    //         Spring Cleaning for home appliance
    //       </h1>
    //       <p>Get your clean on supplies</p>
    //     </div>
    //   </div>
    //   <div className='container image-hover-effect' onClick={(e) => {handleCategoryClick('DAIRY')}}>
    //     <img className="image-hover-effect" src={img2} alt='img2' />
    //     <div className='content'>
    //       <h1>
    //         Washing item with discount product
    //       </h1>
    //       <p>Get your clean on supplies</p>
    //     </div>
    //   </div>
    //   <div className='container image-hover-effect' onClick={(e) => {handleCategoryClick('Veg_&_Fruits')}}>
    //     <img className="image-hover-effect" src={img3} alt='img3' />
    //     <div className='content'>
    //       <h1>
    //         Vegetables at your doorstep
    //       </h1>
    //       <p> Shop vegetables now</p>
    //     </div>
    //   </div>
    //   <div className='container image-hover-effect' onClick={(e) => {handleCategoryClick('Frozen_Non-Veg')}}>
    //     <img className="image-hover-effect" src={img4} alt='img4' />
    //      <div className='content'>
    //       <h1>
    //        Fresh quality meat item with discount
    //       </h1>
    //       <p> Shop vegetables now</p>
    //     </div>
    //   </div>
    // </div>
  )
}

export default HomeCategories