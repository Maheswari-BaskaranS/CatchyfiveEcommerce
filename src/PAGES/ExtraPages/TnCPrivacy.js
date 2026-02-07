import React, { useEffect } from 'react'
import SingleBanner from '../../COMPONENTS/Banners/SingleBanner'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import img1 from '../../COMPONENTS/Banners/img1.png'
import Footer1 from '../../COMPONENTS/Footer/Footer1'
import './Extrapage.css'
import { Link } from 'react-router-dom'
const TnCPrivacy = () => {
 
    return (
        <div className='extrapageout'>
            <Navbar />
            <SingleBanner bannerimage={img1} heading={'About Us'} />

            <div className='extrapagein'>
                <div className='c1'>
                    <h1>Terms & conditions – Privacy Policy:</h1>
                    <ol>
                        <li>
                            <p>
                                <span>Introduction</span>&nbsp;&nbsp;&nbsp;<br></br>

                                Welcome to Catchyfive.com (“Company”, “we”, “our”, “us”)!<br></br>
                                These Terms of Service (“Terms”, “Terms of Service”) govern your use of our website located at www.catchyfive.com & Mobile applications (together or individually “Service”) operated by Catchyfive Pte Ltd.<br></br>
                                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard, and disclose information that results from your use of our web pages.<br></br>
                                Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound of them.<br></br>
                                If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at sales@catchyfive.com so we can try to find a solution. These Terms apply to all visitors, users, and others who wish to access or use Service.<br></br>
                            </p>


                        </li>
                        <br></br>
                        <li>
                            <p>
                                <span>Communications</span>&nbsp;&nbsp;&nbsp;<br></br>

                                By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt-out of receiving any, or all, of these communications from us by following the unsubscribe link or by email to sales@catchyfive.com.<br></br>
                            </p>


                        </li>
                        {/* <div className='images2'>
                            <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F1.png&w=640&q=75'
                                alt='noimg' />

                            <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F2.png&w=640&q=75'
                                alt='noimg' />
                        </div> */}
                        <li>
                            <p>
                                <span>Purchases & Payments.</span>&nbsp;&nbsp;&nbsp;<br></br>

                                If you wish to purchase any product or service made available through Service (“Purchase”), you may be asked to provide certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.<br></br><br></br>
                            </p>

                            <p>You represent and warrant that:</p>
                            <ol type='i'>
                                <li>
                                    <p>
                                        you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that
                                    </p>
                                </li>

                                <li>
                                    <p>
                                        the information you supply to us is true, correct and complete.
                                    </p>
                                </li>
                            </ol>
                            <p>You must accept the following statement provided with a checkbox, before proceeding the payment: <br></br>
                                I agree to the Terms and Conditions and the Refund and Cancellation policy.<br></br>
                                We may employ the use of third-party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.<br></br>
                                We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.<br></br>
                                We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Delivery of orders</span><br></br>
                                The options of Guaranteed Slot-based Delivery are subject to the following Terms & Conditions:<br></br>
                                <ol type='i'>
                                    <li>
                                        <p>
                                            To get your order within the guaranteed delivery time, you need to select the respective slot-based delivery option during checkout.
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            In the Slot-based Delivery option, you need to select the delivery date.
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            We are constantly working to expand our coverage. Please check the availability of guaranteed delivery options for your pin code on the detail page or at check out.
                                        </p>
                                    </li>
                                </ol>
                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Cancellation of orders</span> <br></br>
                                If you need to cancel your order, you can do so within one hour of placing the order. To cancel your order, simply log in to your CatchyFive.sg account and navigate to your order history. From there, you can select the order that you would like to cancel and click on the "Cancel Order" button.
                                <br></br>  <br></br>
                                Once you have cancelled your order, you will receive a confirmation email from us. If you do not receive a confirmation email, please reach out to our customer service team as soon as possible.
                                <br></br>  <br></br>
                                Please note that if you do not cancel your order within one hour of placing it, the order will be placed and processed as normal. At this point, we will be unable to cancel the order or make any changes to it.
                                <br></br>  <br></br>
                                We strive to provide our customers with the best possible service and support, and we are always happy to help with any questions or concerns you may have. Please do not hesitate to reach out to our customer service team if you need assistance with cancelling an order or any other aspect of your shopping experience with us.

                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Return, Refunds & Exchange</span> <br></br>
                                If for any reason you are not satisfied with a product that you have purchased from us, you can return it within one day of the purchase date. To initiate a return, please ensure that you have the original purchase bill and a photo image of the product. This is necessary to verify the purchase and the condition of the product. Please contact our customer service team to request a return and provide the required information.
                                <br></br>  <br></br>
                                Once your return request is approved, you can either bring the product to our physical store or ship it back to us. Please ensure that the product is in its original packaging and in the same condition that it was received. If the product is damaged or not in its original condition, we may be unable to process the return.
                                <br></br>  <br></br>
                                Please note that we are unable to accept returns on certain items, such as perishable goods and personal care items, for hygiene and safety reasons.
                                <br></br>  <br></br>
                                We will process your return as quickly as possible and issue a refund to your original payment method. Please note that it may take several days for the refund to appear in your account, depending on your payment provider.


                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Contests, Sweepstakes, and Promotions</span> <br></br>
                                Any contests, sweepstakes, or other promotions (collectively, “Promotions”) made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.
                                <br></br>  <br></br>
                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Content</span> <br></br>
                                Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material (“Content”). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.<br></br>  <br></br>
                                By posting Content on or through Service, you represent and warrant that:<br></br>
                                i. Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms.
                                ii. The posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.<br></br>
                                You retain all your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third-party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service. You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms.<br></br>
                                Catchyfive.sg has the right but not the obligation to monitor and edit all Content provided by users.<br></br>
                                In addition, Content found on or through this Service is the property of CatchyFive.sg or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.
                                <br></br>
                            </p>
                        </li>
                        {/* <div className='images3'>
                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F1.png&w=640&q=75'
                        alt='noimg' />

                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F2.png&w=640&q=75'
                        alt='noimg' />

                    <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fabout-us%2F1.png&w=640&q=75'
                        alt='noimg' />
                </div> */}
                        <li>
                            <p>
                                <span>Prohibited Uses</span> <br></br>
                                Disseminating any unlawful, harassing, libellous, abusive, threatening, harmful, vulgar, obscene, or otherwise objectionable material<br></br><br></br>
                                Transmitting material that encourages conduct that constitutes a criminal offence or results in civil liability or otherwise breaches any relevant laws, regulations, or code of practice.<br></br><br></br>
                                Gaining unauthorized access to other computer systems.<br></br><br></br>
                                Interfering with any other person's use or enjoyment of the Site.<br></br><br></br>
                                Breaching any applicable laws<br></br><br></br>
                                Interfering or disrupting networks or web sites connected to the Site.<br></br><br></br>
                                Making, transmitting, or storing electronic copies of materials protected by copyright without the permission of the owner.<br></br><br></br>
                                Service is intended only for access and use by adults at least eighteen (18) years old. By accessing or using Service, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of Service.
                                <br></br>
                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Acknowledgment</span> <br></br>
                                By using service or other services provided by us, you acknowledge that you have read these terms of service and agree to be bound by them.
                                <br></br>
                            </p>
                        </li>

                        <li>
                            <p>
                                <span>Privacy policy</span> <br></br>
                                We use data collection devices such as “cookies” on the Site to help analyse our web page flow, measure promotional effectiveness, and promote trust and safety. The term “cookies” means small files placed on your hard drive that assist us in providing our services. <br></br><br></br>
                                Cookies can also help us provide information that is targeted to your interests. You are always free to decline our cookies if your browser permits, although in that case, you may not be able to use certain features on the Site.
                                Additionally, you may encounter “cookies” or other similar devices on certain pages of the Site that are placed by third parties. Catchyfive.com does not control the use of cookies by third parties.<br></br><br></br>
                                Given the nature of internet transactions, Catchyfive.com does not take any responsibility for the transmission of Information including the Information you provide to Catchyfive.com. Any transmission of your Information on the internet is done at your risk. Catchyfive.com does not take any responsibility for you or any third party circumventing the privacy settings or security measures contained on the Site.<br></br><br></br>
                                While Catchyfive.com will use all reasonable efforts to ensure that your information is safe and secure, it offers no representation, warranties, or other assurances that the security measures are adequate, safe, fool proof, or impenetrable. The shopper has the right to request a copy of, amend, and delete personal information collected as well as include the contact that they should reach out to if they would like to do so.<br></br><br></br>
                                You acknowledge that as a registered user you are responsible for maintaining the security of your Account such as your Account login credentials and passwords and that you should not provide these credentials to any third party. If it comes to your knowledge that or if you have reason to believe that your Account credentials have been stolen or been made known to others, you must contact us immediately at sales@catchyfive.com. You acknowledge that you are responsible for all acts done, using your account login credentials. Catchyfive.sg is not responsible if someone else accesses your Account on account of your failure to maintain the security of your Account credentials. You have the right to access, correct, and delete personal information collected. To exercise your rights, you can contact us at sales@catchyfive.com.<br></br><br></br>

                            </p>
                        </li>
                    </ol>
                </div>

                {/* 

                <div className='c1'>

                    <p>We may automatically track certain information about you based upon your behavior on the website. We use this information to do internal research on our users’ demographics, interests, and behavior to better understand, protect and serve our users. This information is compiled and analyzed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on the website or not), which URL you next go to (whether this URL is on the website or not), your computer browser information, your IP address, and other information associated with your interaction with the website. We may also share your Mobile IP/Device IP with third party(ies) and to the best of our knowledge, be-life and representations given to us by these third party(ies) this information is not stored.<br></br><br></br>
                        Our Privacy Policy is incorporated into the Terms and Conditions of Use of the website/app, and is subject to change from time to time without notice. It is strongly recommended that you periodically review our Privacy Policy as posted on the App/Web.
                        <br></br><br></br>
                        Should you have any clarifications regarding this Privacy Policy, please do not hesitate to contact us at  info@borobazar.com .</p>
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
                 */}
                 <div className='c1'>
                    <h2>For  enquiries please contact us at: <span>sales@catchyfive.com</span></h2>
                    <p>For all other inquiries, visit our  <span
                     onClick={() => {
                        window.scrollTo(0, 0)
                     }}
                    >
                        <Link to='/contact'
                            style={{ textDecoration: 'none', color: 'black' }}
                        >Contact Us</Link>
                        </span>  page.</p>
                </div>
            </div>

            <Footer1 />
            <Footer2 />
        </div>
    )
}

export default TnCPrivacy