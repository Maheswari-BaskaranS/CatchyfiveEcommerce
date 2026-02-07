// // src/components/Carousel.js
// import React, { useEffect, useState } from 'react';
// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';
// import './slider.css'; 
// import { APPEnv } from '../config';

// const MyCarousel = () => {
//   const [data, setData] = useState([]);
//   const [load , setLoad] = useState(true);



//   const getbannerdata = () => {
//     fetch(APPEnv.baseUrl + '/B2CBannerImage/GetAll?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             setData (data.Data)
//         })
// }

// React.useEffect(() => {
//     getbannerdata()
// }, [])

//   const responsive = {
//     desktop: {
//       breakpoint: { max: 3000, min: 1024 },
//       items: 1,
//     },
//     tablet: {
//       breakpoint: { max: 1024, min: 464 },
//       items: 1,
//     },
//     mobile: {
//       breakpoint: { max: 464, min: 0 },
//       items: 1,
//     },
//   };

//   const carouselSettings = {
//     responsive,
//     autoPlay: true,
//     autoPlaySpeed: 4000,
//     infinite: true,
//   };

//   return (
//     <Carousel {...carouselSettings}>
//       {data.length > 0 && data.map((item, index) => (
//         <div key={index} className="carousel-item">
//           <img 
//             className="responsive-image" 
//             src={item.BannerImageFilePath} 
//             alt={`Banner ${index}`} 
//           />
//         </div>
//       ))}
//     </Carousel>
//   );
// };

// export default MyCarousel;

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './slider.css';
import slide1 from '../../ASSETS/Slide1.png';
import slide2 from '../../ASSETS/Slide2.png';

const MyCarousel = () => {
    const slides = [slide1, slide2];

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    const carouselSettings = {
        responsive,
        autoPlay: true,
        autoPlaySpeed: 4000,
        infinite: true,
    };

    return (
        <Carousel {...carouselSettings}>
            {slides.map((image, index) => (
                <div key={index} className="carousel-item">
                    <img className="responsive-image" src={image} alt={`Banner ${index}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default MyCarousel;
