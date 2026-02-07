import React, { useState } from 'react'
import SingleBanner from '../../COMPONENTS/Banners/SingleBanner'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import img1 from '../../COMPONENTS/Banners/img1.png'
import Footer1 from '../../COMPONENTS/Footer/Footer1'
import { toast } from 'react-toastify'
import './Extrapage.css'
import { APPEnv } from '../../COMPONENTS/config'


const Offers = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleContact = () => {
        if (!name || !email || !phone || !message ) {
            toast.error('Please fill in all fields and click on submit', {
                position: "top-right",
                autoClose: 1000,
            });
            return;
        }

        fetch(APPEnv.baseUrl + '/B2CContactEnquiry/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
                "ContactEntryId": "string",
                "ContactPersonName": name,
                "MobileNo": phone,
                "EmailId": email,
                "Subject": "Contact Enquiry",
                "RequestMessage": message,
                "CreatedBy": "string",
                "CreatedOn": new Date().toISOString()
            }),
        })
        .then(res => res.json())
        .then(responseData => {
            if (responseData.Code === 200) {
                toast.success('Message Sent', {
                    position: "top-right",
                    autoClose: 1000,
                });
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
            }
        })
        .catch(err => {
            toast.error('Message could not be sent', {
                position: "top-right",
                autoClose: 1000,
            });
        });
    }


    return (
        <div className='extrapageout'>
            <Navbar />
            <SingleBanner bannerimage={img1} heading={'Contact Us'} />
            <div className='contactformout'>
            <div className='c1'style={{textAlign:"center"}}>
                    <h1>No Offers Available Right Now</h1>
<p>Stay tuned — exciting offers are coming soon!</p>

                    </div>
            </div>

            <div className='c2'>
    <div className='c2in'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '50px', height: '50px' }}>  
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <div>
            <h1>Office Location</h1>
            <p>252 Choa Chu Kang ave 2, #01-304, 680252</p>
        </div>
    </div>

    <div className='c2in'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '40px', height: '40px' }}>  
            <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
        </svg>
        <div>
            <h1>Send Mail</h1>
            <p>sales@catchyfive.com</p>
        </div>
    </div>

    <div className='c2in'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '40px', height: '40px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
        </svg>
        <div>
            <h1>Call us anytime</h1>
            <p>+65 92349314</p>
        </div>
    </div>
</div>


            {/* Embed Google Map */}
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.123456789012!2d103.1234567!3d1.2345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1234567890ab%3A0xcdef1234567890ab!2s252%20Choa%20Chu%20Kang%20Ave%202%2C%20%2301-304%2C%20Singapore%20680252!5e0!3m2!1sen!2ssg!4v1679916662671!5m2!1sen!2ssg"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>

            
            <Footer1 />
            <Footer2 />
        </div>
    )
}

export default Offers;
