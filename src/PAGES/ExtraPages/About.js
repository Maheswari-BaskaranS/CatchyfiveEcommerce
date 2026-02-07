import React from 'react'
import SingleBanner from '../../COMPONENTS/Banners/SingleBanner'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import img1 from '../../COMPONENTS/Banners/img1.png'
import Footer1 from '../../COMPONENTS/Footer/Footer1'
import './Extrapage.css'
const About = () => {
    return (
        <div className='extrapageout'>
            <Navbar />
            <SingleBanner bannerimage={img1} heading={'About Us'} />

            <div className='extrapagein'>
                <div className='c1'>
                    <h1>About Us</h1>
                    <p>
                        Welcome to CatchyFive.sg, a brand-new online grocery store that is proud to serve the Singaporean community with high-quality, affordable groceries.
                        <br></br>
                        <br></br>
                        Established in 2023, we are a subsidiary of Jaya Ambiga Trading, a well-established grocery and supermarket chain that has been serving customers since 2007. Our roots in the industry run deep, and we have built a reputation for providing exceptional customer service and high-quality products. <br></br>
                        <br></br>
                        At CatchyFive.sg, we are committed to providing our customers with the very best. We work closely with local and international suppliers to ensure that our products are of the highest quality, and we are constantly updating our inventory to meet the evolving needs of our customers. Whether you are looking for fresh produce, pantry staples, or specialty items, we have everything you need to make delicious and nutritious meals at home. <br></br>
                        <br></br>
                        We are proud to be a part of the Singaporean community, and we are committed to giving back in any way we can. That is why we offer competitive prices on all our products, and we are constantly looking for ways to make grocery shopping more accessible and affordable for everyone. <br></br>
                        <br></br>
                        Thank you for choosing CatchyFive.sg. We look forward to serving you and your family for many years to come.

                    </p>
                </div>

                {/* <div className='images2'>
                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F1.png&w=640&q=75'
                        alt='noimg' />

                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F2.png&w=640&q=75'
                        alt='noimg' />
                </div>

                <div className='c1'>

                    <p>We may automatically track certain information about you based upon your behavior on the website. We use this information to do internal research on our users’ demographics, interests, and behavior to better understand, protect and serve our users. This information is compiled and analyzed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on the website or not), which URL you next go to (whether this URL is on the website or not), your computer browser information, your IP address, and other information associated with your interaction with the website. We may also share your Mobile IP/Device IP with third party(ies) and to the best of our knowledge, be-life and representations given to us by these third party(ies) this information is not stored.<br></br><br></br>
                        Our Privacy Policy is incorporated into the Terms and Conditions of Use of the website/app, and is subject to change from time to time without notice. It is strongly recommended that you periodically review our Privacy Policy as posted on the App/Web.
                        <br></br><br></br>
                        Should you have any clarifications regarding this Privacy Policy, please do not hesitate to contact us at  info@borobazar.com .</p>
                </div>

                <div className='images3'>
                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F1.png&w=640&q=75'
                        alt='noimg' />

                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F2.png&w=640&q=75'
                        alt='noimg' />

                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F1.png&w=640&q=75'
                        alt='noimg' />
                </div>

                <div className='c1'>
                    <p>We may automatically track certain information about you based upon your behavior on the website. We use this information to do internal research on our users’ demographics, interests, and behavior to better understand, protect and serve our users. This information is compiled and analyzed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on the website or not), which URL you next go to (whether this URL is on the website or not), your computer browser information, your IP address, and other information associated with your interaction with the website. We may also share your Mobile IP/Device IP with third party(ies) and to the best of our knowledge, be-life and representations given to us by these third party(ies) this information is not stored.<br></br><br></br>
                        Our Privacy Policy is incorporated into the Terms and Conditions of Use of the website/app, and is subject to change from time to time without notice. It is strongly recommended that you periodically review our Privacy Policy as posted on the App/Web.
                        <br></br><br></br>
                        Should you have any clarifications regarding this Privacy Policy, please do not hesitate to contact us at  info@borobazar.com .</p>
                </div>

                <SingleBanner bannerimage={img1} heading={'About Us'} />


                <div className='c1'>
                    <h1>Be safe, be secure!!</h1>
                    <p>We may automatically track certain information about you based upon your behavior on the website. We use this information to do internal research on our users’ demographics, interests, and behavior to better understand, protect and serve our users. This information is compiled and analyzed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on the website or not), which URL you next go to (whether this URL is on the website or not), your computer browser information, your IP address, and other information associated with your interaction with the website. We may also share your Mobile IP/Device IP with third party(ies) and to the best of our knowledge, be-life and representations given to us by these third party(ies) this information is not stored.<br></br><br></br>
                        Our Privacy Policy is incorporated into the Terms and Conditions of Use of the website/app, and is subject to change from time to time without notice. It is strongly recommended that you periodically review our Privacy Policy as posted on the App/Web.
                        <br></br><br></br>
                        Should you have any clarifications regarding this Privacy Policy, please do not hesitate to contact us at  info@borobazar.com .</p>
                </div>
                <div className='c1'>
                    <h2>For media enquiries please contact us at: <span>press@borobazar.com</span>.</h2>
                    <p>For all other inquiries, visit our  <span>Contact Us</span>  page.</p>
                </div> */}
            </div>

            <Footer1 />
            <Footer2 />
        </div>
    )
}

export default About