import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './BannerSlider.css';
import slide1 from '../../ASSETS/demo2.png';
import slide2 from '../../ASSETS/demo1.png';

const BannerSlider = () => {
    const slides = [slide1, slide2];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className='bannerslider'>
            <Slider {...settings} className='bannerslider'>
                {slides.map((image, index) => (
                    <div className='imagecont' key={index}>
                        <img src={image} alt={`Banner ${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default BannerSlider;
