import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SingleBanner from '../../COMPONENTS/Banners/SingleBanner'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import AccountSettings from '../../COMPONENTS/UserProfile/AccountSettings'
import ChangePassword from '../../COMPONENTS/UserProfile/ChangePassword'
import LegalNotice from '../../COMPONENTS/UserProfile/LegalNotice'
import UserAddress from '../../COMPONENTS/UserProfile/UserAddress'
import UserSidebar from '../../COMPONENTS/UserProfile/UserSidebar'
import YourOrders from '../../COMPONENTS/UserProfile/YourOrders'
import Footer1 from '../../COMPONENTS/Footer/Footer1'

import './UserProfile.css'
import { useRecoilState } from 'recoil'
import { orderSuccessfulProvider } from '../../Providers/OrderSuccessfulProvider'
import { toast } from 'react-toastify'
import { authPopupState } from '../../Providers/AuthPopupProvider'
import LoyaltyPoints from '../../COMPONENTS/UserProfile/LoyaltyPoints'
import { APPEnv } from '../../COMPONENTS/config'
const UserProfile = () => {
  const { activepage } = useParams()
  // alert(activepage)
  const [user, setuser] = React.useState({})
const navigate = useNavigate();
  const [isloggedin, setisloggedin] = React.useState(false)
  const [authPopupShow, setAuthPopupShow] = useRecoilState(authPopupState);

  useEffect(() => {
    let user = localStorage.getItem('token')
    user = JSON.parse(user)
    if (user) {
      // fetch(process.env.REACT_APP_BACKEND_URL + '/B2CCustomerRegister/GetbycodeOrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+'&B2CCustomerId=' + user[0].B2CCustomerId, {
        fetch(APPEnv.baseUrl + '/B2CCustomerRegister/Getbycode?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+'&B2CCustomerId=' + user[0].B2CCustomerId, {  
      method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          
          setuser(data.Data)
          localStorage.setItem('token', JSON.stringify(data.Data))
          user = localStorage.getItem("token")
        })
      // setuser(JSON.parse(token))

    }
    else {
      toast.error('Please Login First')
      // setAuthPopupShow(true)
      navigate('/login'); 
    }

  }, [])
 



  return (
    <div className='userprofile'>


      <Navbar />
      <div className='userprofilein'>
        <div className='left'>
          <UserSidebar activepage={activepage} />
        </div>
        <div className='right'>
          {activepage === 'accountsettings' && <AccountSettings user={user} />}
          {activepage === 'yourorders' && <YourOrders userid={user[0]?.B2CCustomerId} EmailId={
            user[0]?.EmailId
          } />}
          {
            activepage === 'loyalty' && <LoyaltyPoints user={user}/>
          }
          {activepage === 'address' && <UserAddress />}
          {/* {activepage === 'legalnotice' && <LegalNotice/>} */}
          {activepage === 'changepassword' && <ChangePassword user={user}
          />}
        </div>
      </div>
      <Footer1 />
    </div>
  )
}

export default UserProfile