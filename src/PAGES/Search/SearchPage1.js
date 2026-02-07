import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import Search_Product_Sidebar from '../../COMPONENTS/Product/Search_Product_Sidebar'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import { APPEnv } from '../../COMPONENTS/config'

const SearchPage1 = () => {
    const { categoryid, categoryname,subcategory} = useParams()
    const [products, setProducts] = React.useState([])
    const [productsfiltered, setProductsfiltered] = React.useState([])
    const [categories, setCategories] = React.useState([])
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 25;


    const getProducts = () => {
      if (categoryid && categoryid !== 'all') {
        if(subcategory == 'all'){
          fetch(APPEnv.baseUrl + `/Product/GetAllWithImageV2?OrganizationId=`+process.env.REACT_APP_BACKEND_ORGANIZATION+`&Category=${categoryid}&pageNo=${pageNumber}&pageSize=${pageSize}`, {
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
          fetch(APPEnv.baseUrl + `/Product/GetAllWithImageV2?OrganizationId=`+process.env.REACT_APP_BACKEND_ORGANIZATION+`&Category=${categoryid}&SubCategory=${subcategory}&pageNo=${pageNumber}&pageSize=${pageSize}`, {
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
        fetch(APPEnv.baseUrl + '/Product/GetAllWithImageV2?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+`&pageNo=${pageNumber}&pageSize=${pageSize}`, {
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
  

    const getCategories = async () => {
        try {
            const response = await fetch(`${APPEnv.baseUrl}/Category/GetAllWithSubcategory?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const categoriesData = await response.json();
            let alldata = [];

            for (const category of categoriesData.Data) {

                let obj = {
                    category: category,
                    subcategories: category.SubCategoryDetail
                };

                alldata.push(obj);
            }

            setCategories(alldata);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    useEffect(() => {
        getProducts()
        getCategories()
    }, [ categoryid, categoryname,subcategory])


    return (
        <div>
            <Navbar />
            <div style={{
                height: '20px',
            }}></div>
            <Search_Product_Sidebar products={products?products:[]} categories={categories} categoryname={categoryname}/>

            <Footer2/>
        </div>
    )
}

export default SearchPage1