import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import img1 from '../../ASSETS/Products/1.png'
import img2 from '../../ASSETS/Products/2.png'
import img3 from '../../ASSETS/Products/3.png'
import img4 from '../../ASSETS/Products/4.png'
import './AllProduct.css'
import CategoryTopbar from './CategoryTopbar';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { APPEnv } from '../config'

import { useSelector } from 'react-redux'


const AllProduct = ({categoryname, categories, data }) => {
  const whishlist = useSelector((state) => state.whishlist.whishlistItems || []);
    // const { categoryid, categoryname,subcategory } = useParams()
    const [products, setProducts] = useState([])
    const [sortby, setSortby] = useState('lowtohigh')
    const [pagenumber, setpagenumber] = useState(1)
    const { categoryid, subcategory  } = data ||{};
    const pageSize = 25;
    
    const getProducts = () => {
        if (categoryid && categoryid !== 'all') {
          if(subcategory == 'all'){
            fetch(APPEnv.baseUrl + `/Product/GetAllWithImageV2?OrganizationId=`+ process.env.REACT_APP_BACKEND_ORGANIZATION+`&Category=${categoryid}&pageNo=${pagenumber}&pageSize=${pageSize}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            })
              .then(response => response.json())
              .then(data => {
                setProducts(data.Result)
              })
          }
          else{
            fetch(APPEnv.baseUrl + `/Product/GetAllWithImageV2?OrganizationId=`+ process.env.REACT_APP_BACKEND_ORGANIZATION+`&Category=${categoryid}&SubCategory=${subcategory}&pageNo=${pagenumber}&pageSize=${pageSize}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            })
              .then(response => response.json())
              .then(data => {
                setProducts(data.Result)
              })
          }
        } 
        
    
        else {
          fetch(APPEnv.baseUrl + '/Product/GetAllWithImageV2?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+`&pageNo=${pagenumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(response => response.json())
            .then(data => {
              console.log("dattaaaaa",data)
              setProducts(data.Result)
            })
        }
      }
    


    useEffect(() => {
        setpagenumber(pagenumber + 1)
        // getProducts(pagenumber)
    }, [products])
    const checkifinwhishlist = (code) => {}


    return (
        <div className='allproducts'>
            <div className='header'>
                {
                    products && products.length > 0 && categoryname ?
                        <h1>{categoryname}</h1>
                        :
                        <h1>{
                            products.length != 1 ? `${products?.length || 0} Products Found`
                                :
                                `${products?.length || 0} Product Found For`
                        }</h1>
                }
                <Grid container direction='row'>
                  <Grid item >
                    <div className='sortby d-f'>
                        <span>Sort by : </span>
                        <select

                            value={sortby}
                            onChange={(e) => setSortby(e.target.value)}

                        >
                            <option value='lowtohigh'>Low to High</option>
                            <option value='hightolow'>High to Low</option>
                            <option value='newestfirst'>Newest First</option>
                        </select>
                    </div>
                  </Grid>
                  <Grid item>
                    <CategoryTopbar categories={categories}/>
                  </Grid>
                </Grid>


            </div>
            {     products && products.length > 0 ?  
             <div className='products'>
             {
                products 
                 .map((item) => {
                     return (
                         <ProductCard data={item} key={item.Code} wishlist={
                             checkifinwhishlist(item.Code)
                         } />
                         // <p>{JSON.stringify(item)}</p>
                     )
                 })
                     
                     
             }
         </div>
             : 
            <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                width: '100%',
            }}
        >

            <h1 >No Products Found</h1>
        </div>
            }
           
        </div>
    )
}

export default AllProduct
