import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import img1 from '../../ASSETS/Images/1.png'
import img2 from '../../ASSETS/Images/2.png'
import img3 from '../../ASSETS/Images/3.png'
import img4 from '../../ASSETS/Images/4.png'
import './CategorySidebar.css'
import { useState } from 'react'
import { searchValueProvider } from '../../Providers/SearchValueProvider'
import { useRecoilState } from 'recoil'

const CategorySidebar1 = ({ categories }) => {
    const noimage = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'


    categories = [
        {
            category: {
                "Code": "all",
                "Name": "All Products",
                "CategoryImageFilePath": noimage,
                "subcategories": []
            }
        },
        ...categories
    ]


    const [showsubcategory, setshowsubcategory] = useState(false)
    const [searchvalue, setsearchvalue] = useRecoilState(searchValueProvider)

    return (
        <div className='categorysidebar'>
            <h2>Categories</h2>
            <div className='categorysidebarin'>
                {
                    categories.length > 0 && categories.map((item, index) => {

                        return (
                            <div className='category' key={index}>
                                <div className='s1'>
                                    <img src={item.category.IconImageFilePath
                                        ? item.category.IconImageFilePath
                                        : noimage} alt='categoryimage' />

                                    <Link to={`/home/${item.category.Code}/${item.category.Name}/all`} key={index}
                                        style={{ textDecoration: 'none', color: 'black' }}
                                    >
                                        <h3>{item.category.Name}</h3>
                                    </Link>
                                    {
                                        item.subcategories && item.subcategories.length > 0 ?
                                            <div
                                                className='drop'
                                            >
                                                {
                                                    showsubcategory == item.category.Code ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                                            onClick={() => {
                                                                setshowsubcategory(false)
                                                            }}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                        </svg>

                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                                            onClick={() => {
                                                                setshowsubcategory(item.category.Code)
                                                            }}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                }
                                            </div>
                                            : null
                                    }
                                </div>

                                {
                                    showsubcategory == item.category.Code && <div className='s2'>
                                        {
                                            item.subcategories.map((subitem, index) => {
                                                return (
                                                    <Link to={`/home/${item.category.Code}/${item.category.Name}/${subitem.Code}`} key={index}
                                                        style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                    >
                                                        <div></div>
                                                        <p
                                                            key={index}
                                                        >{subitem.Name}</p>
                                                    </Link>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CategorySidebar1