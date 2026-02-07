import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import './AccountSettings.css'
import { APPEnv } from '../config'

const AccountSettings = ({ user }) => {

  const [userdata, setuserdata] = React.useState({})

  const editprofile = () => {
    fetch(APPEnv.baseUrl + '/B2CCustomerRegister/EditProfile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userdata),
      })
      .then(res => res.json())
      .then(data => {
        if (data.Code === 200) {
          // window.location.reload()
          toast.success('Profile Updated Successfully')
          updateuserdata()
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        else {
          toast.error('Something Went Wrong')
        }
      })
      .catch(err => {
        toast.error('Something Went Wrong')
      })
  }

  const updateuserdata = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(user)
    fetch(APPEnv.baseUrl + '/B2CCustomerRegister/Getbycode?OrganizationId=' + process.env.REACT_APP_BACKEND_ORGANIZATION + '&B2CCustomerId=' + user.B2CCustomerId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // if (data.Status === true && data.Code === 200) {
        //   localStorage.setItem('token', JSON.stringify(data.Data))
        //   // getaddress()
        // }
        // else {
        //   toast.error('Error Fetching User Data')
        // }
      })
  }

  useEffect(() => {
    setuserdata(user[0])
  }, [user])


  return (
    <div className='accountsettings'>
      <h1 className='mainhead2'>Personal Information</h1>
      <div className='form'>
        <div className='form-group'>
          <label htmlFor='name'>Your Name <span>*</span></label>
          <input type='text' name='name' id='name'
            value={userdata?.B2CCustomerName}
            onChange={(e) => setuserdata({ ...userdata, B2CCustomerName: e.target.value })}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='phone'>Phone/Mobile <span>*</span></label>
          <input type='text' name='phone' id='phone'
            value={userdata?.MobileNo}
            onChange={(e) => setuserdata({ ...userdata, MobileNo: e.target.value })}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='email'>Email <span>*</span></label>
          <input style={{
            backgroundColor: "#f0f0f0",
            color: "#888",
            border: "1px solid #ccc",
            cursor: "not-allowed"
          }} type='email' name='email' id='email'
            value={userdata?.EmailId}
            //onChange={(e) => setuserdata({...userdata, EmailId: e.target.value})}
            readOnly
          />
        </div>

      </div>

      <button
        onClick={editprofile}
      >Save Changes</button>
    </div>
  )
}

export default AccountSettings