import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './AccountSettings.css';
import { APPEnv } from '../config';

const ChangePassword = ({ user }) => {
  const [userdata, setuserdata] = React.useState({});

  const editpassword = () => {
    let token = localStorage.getItem('token');
    const user = token ? JSON.parse(token) : null;

    if (!user || !user[0]?.B2CCustomerId) {
      toast.error('User session is invalid. Please log in again.');
      return;
    }

    fetch(
      APPEnv.baseUrl + '/B2CCustomerRegister/EditProfilePassword',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
          B2CCustomerId: user[0].B2CCustomerId,
          EmailId: userdata.EmailId,
          Password: userdata.Password,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.Code === 200) {
          toast.success('Password Updated Successfully');
          setuserdata((prev) => ({ ...prev, Password: userdata.Password })); // Immediate state update
          updateuserdata(); // Fetch updated data
         
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(data.Message || 'Something Went Wrong');
        }
      })
      .catch(() => {
        toast.error('An error occurred while updating the password.');
      });
  };

  const updateuserdata = () => {
    let token = localStorage.getItem('token');
    const user = token ? JSON.parse(token) : null;

    if (!user || !user[0]?.B2CCustomerId) {
      toast.error('User session is invalid. Please log in again.');
      return;
    }

    fetch(
      APPEnv.baseUrl +
        '/B2CCustomerRegister/Getbycode?OrganizationId=' +
        process.env.REACT_APP_BACKEND_ORGANIZATION +
        '&B2CCustomerId=' +
        user[0].B2CCustomerId +
        `&timestamp=${new Date().getTime()}`, // Prevent caching
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.Code === 200 && data.Data) {
          setuserdata(data.Data);
        } else {
          toast.error(data.Message || 'Failed to fetch user data');
        }
      })
      .catch(() => {
        toast.error('An error occurred while fetching user data.');
      });
  };

  useEffect(() => {
    if (user && user[0]) {
      setuserdata(user[0]);
    }
  }, [user]);

  useEffect(() => {
    const handleFocus = () => {
      updateuserdata(); // Update on tab focus
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="accountsettings">
      <h1 className="mainhead2">Change Password</h1>
      <div className="form">
        <div className="form-group">
          <label htmlFor="password">
            Current Password<span>*</span>
          </label>
          <input
            type="text"
            name="password"
            id="password"
            value={userdata?.Password }
            onChange={(e) =>
              setuserdata({ ...userdata, Password: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            style={{
              backgroundColor: '#f0f0f0',
              color: '#888',
              border: '1px solid #ccc',
              cursor: 'not-allowed',
            }}
            type="email"
            name="email"
            id="email"
            value={userdata?.EmailId }
            readOnly
          />
        </div>
      </div>

      <button onClick={editpassword}>Save Changes</button>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default ChangePassword;
