import React from 'react'

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductCard from './ProductCard';
import './ProductsSlider.css'

import Slider from 'react-slick';
const ProductsSlider = ({ products, categoryname }) => {
    // Ensure products is always an array to prevent map errors
    const safeProducts = Array.isArray(products) ? products : [];
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 8
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            }
          ],
      };


    return (
        <div className='productsliderout' >
            <h1>{categoryname}</h1>

            {/* <Carousel responsive={responsive} 
            autoPlay={true}
            autoPlaySpeed={3000}
            swipeable={true}
            draggable={true}
            >
                {safeProducts.map((item,index)=>{
                    return (
                        <ProductCard data={item} key={index} />
                    )
                })}
            </Carousel> */}

            {/* create your own slider */}
            <Slider {...settings}>
                {safeProducts.map((item,index)=>{
                    return (
                        <ProductCard data={item} key={index} />
                    )
                })}
            </Slider>
            {/* <div className='productslider'>
               
                {safeProducts.map((item,index)=>{
                    return (
                        <ProductCard data={item} key={index} />
                    )
                })}
    

            </div> */}
        </div >
    )
}

export default ProductsSlider