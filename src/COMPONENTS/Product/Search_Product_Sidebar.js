import React from 'react'
import AllProduct from './AllProduct'
import CategorySidebar1 from './CategorySidebar1'
import CategorySidebar from "./CategorySidebar"
import './Product_Sidebar.css'
import HomeCategories from '../../COMPONENTS/Category/HomeCategories'
const Search_Product_Sidebar = ({products,categories,categoryname}) => {
  return (
    <div className='product_sidebar'>
        {/* <CategorySidebar1 categories={categories}/> */}
        {/* <CategorySidebar categories={categories} className="product_sidebar1"/> */}
        <AllProduct products={products} categoryname={categoryname} categories={categories}/>
        
    </div>
  )
}


export default Search_Product_Sidebar