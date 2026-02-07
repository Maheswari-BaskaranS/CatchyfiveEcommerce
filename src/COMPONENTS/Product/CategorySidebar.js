

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../ASSETS/Images/1.png';
import img2 from '../../ASSETS/Images/2.png';     
import img3 from '../../ASSETS/Images/3.png';
import img4 from '../../ASSETS/Images/4.png';
import './CategorySidebar.css';
import { useState } from 'react';
import noimage from '../../ASSETS/noimage.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Grid, Paper, Typography, Button } from '@mui/material';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const CategorySidebar = ({ categories }) => {
    // const noimage = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'


    categories = [
        {
            category: {
                "Code": "all",
                "Name": "ALL PRODUCTS",
                "CategoryImageFilePath": noimage,
             "Categoryshorturl":"all",
                "subcategories": []
            }
        },
        ...categories
    ]  




    // const [showsubcategory, setshowsubcategory] = useState(false);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    // const handleCategoryClick = (categoryCode) => {
    //     // If the subcategory dropdown is open for the clicked category, close it
    //     if (showsubcategory === categoryCode) {
    //         setshowsubcategory(null);
    //         setSelectedCategory(null);
    //     } else {
    //         setSelectedCategory(categoryCode);
    //         setshowsubcategory(categoryCode);
    //     }
    // };
    

    const [hoveredAccordion, setHoveredAccordion] = useState(null);
    const [showsubcategory, setshowsubcategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    const handleMouseEnterHeader = (index, categoryCode) => {
      setHoveredAccordion(index);
  
      if (showsubcategory === categoryCode) {
        setshowsubcategory(null);
        setSelectedCategory(null);
      }
    };
  
    const handleMouseEnterBody = (index) => {
      setHoveredAccordion(index);
    };
  
    const handleMouseLeave = () => {
      setHoveredAccordion(null);
    };

    const handleCategoryClick  = (category) => {
      <Link  to={`/Home/${category}/all/list`}></Link>
        /* window.location(`/Home/${category}/all`) */
    } 


    return (
        <div className='categorysidebar'>
          <h2>CATEGORIES</h2>
          <div className='categorysidebarin'>
          <div class="accordion" id="accordionExample">
          {categories &&
  categories
    .sort((a, b) => a.category.Name.localeCompare(b.category.Name)) // Sort categories alphabetically
    .map((item, index) => (
      <div
        className={`accordion-item ${
          !item.subcategories || item.subcategories.length === 0
            ? ''
            : 'no-subcategories'
        }`}
        key={index}
      >
        <h2 className="accordion-header p-0" id={`heading${index}`}>
          <Link
            to={`/Home/${item.category.Categoryshorturl}/all/list`}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <button
              className="accordion-button collapsed pt-1 pb-1 pl-2 pr-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${index}`}
              aria-expanded="false"
              aria-controls={`collapse${index}`}
            >
              <Grid container direction="row">
                <Grid item md={4}>
                  <img
                    src={item.category.IconImageFilePath || noimage}
                    alt="e"
                    width="60"
                    height="60"
                  />
                </Grid>
                <Grid
                  className="cta-names"
                  item md={8}
                  sx={{ display: 'flex', alignItems: 'center' }}
                  onClick={(e) => {
                    handleCategoryClick(item.category.Categoryshorturl);
                  }}
                >
                  <Typography className="catName">
                    {item.category.Name}
                  </Typography>
                </Grid>
              </Grid>
            </button>
          </Link>
        </h2>
        {item.subcategories && item.subcategories.length > 0 && (
          <div
            id={`collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${index}`}
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="accordion" id="subaccordionExample">
                {item.subcategories
                  .sort((a, b) => a.Name.localeCompare(b.Name)) // Sort subcategories alphabetically
                  .map((subcategory, subIndex) => (
                    <div
                      className={`accordion-item ${
                        !subcategory.SubCategoriesLevel2Detail ||
                        subcategory.SubCategoriesLevel2Detail.length === 0
                          ? ''
                          : 'no-subcategories'
                      }`}
                      key={subcategory.Code}
                    >
                      <h2
                        className="accordion-header p-0"
                        id={`subheading${subIndex}`}
                      >
                        <Link
                          to={`/Home/${item.category.Categoryshorturl}/${subcategory.Subcatgeoryshorturl}/list`}
                          style={{
                            textDecoration: 'none',
                            color: 'black',
                          }}
                        >
                          <button
                            className="accordion-button collapsed pt-1 pb-1 pl-2 pr-2"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#subcollapse${subcategory.Code}`}
                            aria-expanded="false"
                            aria-controls={`subcollapse${subIndex}`}
                          >
                            <Grid container direction="row">
                              <Grid item md={3}>
                                <img
                                  src={
                                    subcategory.IconImageFilePath || noimage
                                  }
                                  alt="logo"
                                  width="50"
                                  height="50"
                                />
                              </Grid>
                              <Grid
                                item md={9}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {subcategory.Name}
                              </Grid>
                            </Grid>
                          </button>
                        </Link>
                      </h2>
                      {subcategory.SubCategoriesLevel2Detail &&
                        subcategory.SubCategoriesLevel2Detail.length > 0 && (
                          <div
                            id={`subcollapse${subcategory.Code}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`subheading${subcategory.Code}`}
                            data-bs-parent="#subaccordionExample"
                          >
                            <div className="accordion-body">
                              <ul
                                style={{
                                  listStyleType: 'none',
                                  margin: '0',
                                }}
                              >
                                {subcategory.SubCategoriesLevel2Detail
                                  .sort((a, b) =>
                                    a.Name.localeCompare(b.Name)
                                  ) // Sort level 2 subcategories alphabetically
                                  .map((level2, l3Index) => (
                                    <Link
                                      key={l3Index}
                                      to={`/Home/${item.category.Categoryshorturl}/${subcategory.Subcatgeoryshorturl}/${level2.SubCatgeoryL2shorturl}`}
                                      style={{
                                        textDecoration: 'none',
                                        color: 'black',
                                      }}
                                    >
                                      <Grid
                                        container
                                        direction="row"
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        <Grid item md={3}>
                                          <img
                                            src={
                                              level2.SubL2IconImageFilePath ||
                                              noimage
                                            }
                                            alt="logo"
                                            width="50"
                                            height="50"
                                          />
                                        </Grid>
                                        <Grid
                                          item md={9}
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          {level2.Name}
                                        </Grid>
                                      </Grid>
                                    </Link>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    ))}



          </div>

          {/* <div class="accordion" id="accordionExample" onMouseLeave={handleMouseLeave}>
            {categories && categories.length > 0 && categories.map((item, index) => (
              <div class="accordion-item" key={index}>
                <h2
                  class="accordion-header p-0"
                  id={`heading${index}`}
                  onMouseEnter={() => handleMouseEnterHeader(index, item.category.Code)}
                >
                  <button
                    class={`accordion-button ${hoveredAccordion === index ? '' : 'collapsed'} pt-1 pb-1 pl-2 pr-2`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded={hoveredAccordion === index ? 'true' : 'false'}
                    aria-controls={`collapse${index}`}
                  >
                    <Grid container direction='row'>
                        <Grid item md={3}>
                            <img src={item.category.CategoryImageFilePath || noimage} alt="e" width='60' height='60' /> 
                        </Grid>
                        <Grid className="cta-names" item md={9} sx={{display:'flex' , alignItems:'center'}}>
                          <Link to={`/home/${item.category.Categoryshorturl}/all`} style={{ textDecoration: 'none', color: 'black' }}>
                            {item.category.Name}
                          </Link>
                        </Grid>
                    </Grid>
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  class={`accordion-collapse collapse ${hoveredAccordion === index ? 'show' : ''}`}
                  onMouseEnter={() => handleMouseEnterBody(index)}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <ul style={{listStyleType: 'none' , margin:'0'}}>
                          { item.subcategories && item.subcategories.length && item.subcategories.map((subcategory) => (
                              <li style={{padding:' 5px' , color:'#595959' , fontSize:'16px' , cursor:'pointer'}}key={subcategory.Code} >
                                <Grid container direction='row'>
                                  <Grid item md={3}>
                                    <img src={subcategory.IconImageFilePath || noimage} alt="logo" width='50' height='50' />
                                  </Grid>
                                  <Grid item md={9} sx={{display:'flex' , alignItems:'center'}}>
                                    <Link to={`/home/${item.category.Categoryshorturl}/${subcategory.Subcatgeoryshorturl}`} style={{ textDecoration: 'none', color: 'black' }}>
                                      {subcategory.Name}
                                    </Link>
                                  </Grid>
                                </Grid>
                              </li>
                          ))}
                      </ul>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

            {/* {categories.length > 0 && categories.map((item, index) => (
              <div className='category' key={index}>
                <div className='s1' onMouseEnter={() => handleCategoryClick(item.category.Code)}>
                <Link to={`/home/${item.category.Categoryshorturl}/all`} style={{ textDecoration: 'none', color: 'black' }}>
                  <img src={item.category.CategoryImageFilePath || noimage} alt='categoryimage'  onMouseEnter={() => handleCategoryClick(item.category.Code)}/>
                  </Link>
                  <Link to={`/home/${item.category.Categoryshorturl}/all`} style={{ textDecoration: 'none', color: 'black' }}>
                    <h3>{item.category.Name}</h3>
                  </Link>

                  {item.subcategories && item.subcategories.length > 0 && (
                    <div className='drop'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                        onClick={() => {
                            setshowsubcategory(showsubcategory === item.category.Code ? null : item.category.Code);
                        }}
                      >
                        {showsubcategory === item.category.Code ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        )}
                      </svg>
                    </div>
                  )}
                </div>

{showsubcategory === item.category.Code && item.subcategories && Array.isArray(item.subcategories) && (
  <div className='s2'>
    {item.subcategories.map((subitem, subIndex) => (
      <Link
        to={`/home/${item.category.Categoryshorturl}/${subitem.Subcatgeoryshorturl}`}
        key={subIndex}
        style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <img src={subitem.SubCategoryImageFilePath || noimage} alt={`subcategory-image-${subIndex}`} />
      
        <p key={subIndex}>{subitem.Name}</p>
      </Link>
    ))}
  </div>
)}

              </div>
            ))} */}

            
          </div>
        </div>
      );
    };
    

export default CategorySidebar;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './CategorySidebar.css';
// import noimage from '../../ASSETS/noimage.png'
// const CategorySidebar = ({ categories }) => {
//  //const noimage = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg';

//   const augmentedCategories = [
//     {
//       category: {
//         "Code": "all",
//         "Name": "All Products",
//         "CategoryImageFilePath": noimage,
//         "subcategories": []
//       }
//     },
//     ...categories
//   ];

//   const [showSubcategory, setShowSubcategory] = useState(null);

//   const handleCategoryClick = (categoryCode) => {
//     setShowSubcategory((prevCategory) => (prevCategory === categoryCode ? null : categoryCode));
//   };

//   return (
//     <div className='categorysidebar'>
//       <h2>Categories</h2>
//       <div className='categorysidebarin'>
//         {augmentedCategories.length > 0 && augmentedCategories.map((item, index) => (
//           <div className='category' key={index}>
//             <div className='s1' onClick={() => handleCategoryClick(item.category.Code)}>
//               <img src={item.category.CategoryImageFilePath || noimage} alt='categoryimage' />
//               <Link to={`/home/${item.category.Code}/${item.category.Name}/all`} style={{ textDecoration: 'none', color: 'black' }}>
//                 <h3>{item.category.Name}</h3>
//               </Link>
//               {item.subcategories && item.subcategories.length > 0 && (
//                 <div className='drop'>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                     onClick={() => {
//                       setShowSubcategory(showSubcategory === item.category.Code ? null : item.category.Code);
//                     }}
//                   >
//                     {showSubcategory === item.category.Code ? (
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
//                     ) : (
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//                     )}
//                   </svg>
//                 </div>
//               )}
//             </div>
//             {showSubcategory === item.category.Code && (
//               <div className='s2'>
//                 {item.subcategories.map((subitem, index) => (
//                   <Link
//                     to={`/home/${item.category.Code}/${item.category.Name}/${subitem.Code}`}
//                     key={index}
//                     style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: '10px' }}
//                   >
//                     <div></div>
//                     <p key={index}>{subitem.Name}</p>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategorySidebar;

