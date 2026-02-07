import React, { useEffect, useState } from 'react'
import AllProduct from './AllProduct'
import CategorySidebar from './CategorySidebar'
import './Product_Sidebar.css'
import topScroll from  "../../ASSETS/top-scroll.svg"
const Product_Sidebar = ({categories,categoryname, data}) => {
  const [visible, setVisible] = useState(false);
  const size = 1000
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > size){
      setVisible(true)
    } 
    else if (scrolled <= size){
      setVisible(false)
    }
  };
  useEffect(()=>{
    window.addEventListener('scroll', toggleVisible);
  }, [])

  return (
    <div className='product_sidebar'>
   {/*  <CategorySidebar categories={categories} className="product_sidebar1"/> */}
    <AllProduct categoryname={categoryname} className="product_sidebar2" categories={categories} data={data}  />
    { visible ?  <div className='scrollToTop' onClick={()=>{  window.scrollTo(0, size-500); }} >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
    </svg>
    </div  >  : "" }    
   
    
    </div>
    )
  }
  
  export default Product_Sidebar