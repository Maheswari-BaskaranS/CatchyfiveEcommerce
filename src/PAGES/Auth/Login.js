import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import logo from '../../ASSETS/logo.png'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { APPEnv } from '../../COMPONENTS/config';
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import './AuthPage.css'
import { loginState } from '../../Providers/LoginProvider';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { setWishlistCount, setWishlistItems } from '../../Store/wishlistSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useRecoilState(loginState);
  const [loginErrors, setLoginErrors] = useState({})
  const [logindata, setlogindata] = React.useState({})
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showlogin, setshowlogin] = React.useState('0')
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };




  const isEmailValid = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateuserdata = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(user)
    // console.log('user customer id',user[0])
    fetch(APPEnv.baseUrl + '/B2CCustomerRegister/Getbycode?OrganizationId=' + process.env.REACT_APP_BACKEND_ORGANIZATION + '&B2CCustomerId=' + user.B2CCustomerId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.Status === true && data.Code === 200) {
          localStorage.setItem('token', JSON.stringify(data.Data))
          // getaddress()
        }
        else {
          toast.error('Error Fetching User Data')
        }
      })
  }


  // const handleLogin = async () => {
  //   let emailError = '';
  //   let passwordError = '';
  
  //   if (!logindata.Username) {
  //     emailError = 'Please enter your email';
  //   } else if (!isEmailValid(logindata.Username)) {
  //     emailError = 'Please enter a valid email';
  //   }
  
  //   if (!logindata.Password) {
  //     passwordError = 'Please enter your password';
  //   }
  
  //   setLoginErrors({
  //     username: emailError,
  //     password: passwordError,
  //   });
  
  //   if (emailError || passwordError) {
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(APPEnv.baseUrl + '/B2CCustomerRegister/CustomerLogin', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
  //         "UserName": logindata.Username,
  //         "Password": logindata.Password,
  //         "BranchCode": "HO",
  //         "TranType": "string",
  //         "Module": "string"
  //       }),
  //     });
  //     console.log("Raw response:", response);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();
  
  //     if (data.Code === 200 && data.Message === "Sucess") {
  //       const userData = data.Data;
  //       localStorage.setItem('token', JSON.stringify(userData));
  //       localStorage.setItem('password', JSON.stringify(logindata.Password));
  //       let user = JSON.parse(localStorage.getItem('token'));
  //       if (!user) return;
  //       // ✅ Fetch Wishlist Data for Logged-in User
  //       const wishlistResponse = await fetch(
  //         APPEnv.baseUrl + `/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}`
  //       );
  
  //       const wishlistData = await wishlistResponse.json();
  
  //       if (wishlistData.Code === 200) {
  //         // ✅ Store Wishlist in Redux
  //         dispatch(setWishlistItems(wishlistData.Data));
  //         dispatch(setWishlistCount(wishlistData.Data.length));
  
  //         // ✅ Store Wishlist in LocalStorage for Persistence
  //         localStorage.setItem("wishlist", JSON.stringify(wishlistData.Data));
  //         localStorage.setItem("wishlistCount", JSON.stringify(wishlistData.Data.length));
  //       } else {
  //         // If wishlist is empty, reset Redux and LocalStorage
  //         dispatch(setWishlistItems([]));
  //         dispatch(setWishlistCount(0));
  //         localStorage.removeItem("wishlist");
  //         localStorage.setItem("wishlistCount", "0");
  //       }
  
  //       updateuserdata();
  //       setLoggedIn(true);
  //       toast.success('Login Successful', {
  //         position: "top-right",
  //         autoClose: 1000,
  //       });
  //       navigate('/')
  //     } else {
  //       toast.error('Login Failed');
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     toast.error('An error occurred during login.');
  //   }
  // };
  
  const handleLogin = async () => {
    let emailError = '';
    let passwordError = '';
  
    if (!logindata.Username) {
      emailError = 'Please enter your email';
    } else if (!isEmailValid(logindata.Username)) {
      emailError = 'Please enter a valid email';
    }
  
    if (!logindata.Password) {
      passwordError = 'Please enter your password';
    }
  
    setLoginErrors({
      username: emailError,
      password: passwordError,
    });
  
    if (emailError || passwordError) {
      return;
    }
  
    try {
      const response = await fetch(APPEnv.baseUrl + '/B2CCustomerRegister/CustomerLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
          "UserName": logindata.Username,
          "Password": logindata.Password,
          "BranchCode": "HO",
          "TranType": "string",
          "Module": "string"
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.Code === 200 && data.Message === "Sucess") {
        const userData = data.Data;
        localStorage.setItem('token', JSON.stringify(userData));
        localStorage.setItem('password', JSON.stringify(logindata.Password));
  
        let user = JSON.parse(localStorage.getItem('token'));
        if (!user) {
          toast.error('User data not found after login');
          return;
        }
  
        // ✅ Fetch Wishlist Data for Logged-in User
        // const wishlistResponse = await fetch(
        //   APPEnv.baseUrl + `/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user?.B2CCustomerId}`
        // );
  
        // const wishlistData = await wishlistResponse.json();
  
        // // ✅ Handle Wishlist Data Properly
        // if (wishlistData.Code === 200 && Array.isArray(wishlistData.Data)) {
        //   dispatch(setWishlistItems(wishlistData.Data));
        //   dispatch(setWishlistCount(wishlistData.Data.length));
  
        //   localStorage.setItem("wishlist", JSON.stringify(wishlistData.Data));
        //   localStorage.setItem("wishlistCount", JSON.stringify(wishlistData.Data.length));
        // } else {
        //   console.warn("Wishlist data is empty or invalid:", wishlistData);
  
        //   dispatch(setWishlistItems([]));
        //   dispatch(setWishlistCount(0));
  
        //   localStorage.removeItem("wishlist");
        //   localStorage.setItem("wishlistCount", "0");
        // }
  
        updateuserdata();
        setLoggedIn(true);
        toast.success('Login Successful', {
          position: "top-right",
          autoClose: 1000,
        });
        navigate('/');
      } else {
        toast.error('Login Failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login.');
    }
  };
  

  return (
    <div className='authpage'>
      <Navbar />

      <div className='authcont'>
        <img src='https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80' alt='noimg' />
        <form className='authform'>
          <div className='s1'>
            <img src={logo} alt='logo' className='logo' />
            <h1>Welcome Back!</h1>
            <p>Don't have an account?
              <a
                style={{ cursor: 'pointer', color: '#02b290', textDecoration: 'underline',marginLeft:"5px" }}
                onClick={() => navigate('/signup')}
              >Create Account</a>
            </p> 
          </div>
          <h1>Login</h1>
          <div className='formgroup'>
            <label htmlFor='email'>Email Address <span className="mandatory">*</span></label>
            <input type='email' name='email' id='email' placeholder='Enter the Email'
              onChange={(e) => {
                setlogindata({ ...logindata, Username: e.target.value })
                setLoginErrors({ ...loginErrors, username: '' });
              }} />
            {loginErrors.username && <div className='error-msg'>{loginErrors.username}</div>}
          </div>
          <div className='formgroup'>
          <label htmlFor='password'>Password <span className="mandatory">*</span></label>
<div className="password-container">
  <input 
    type={showLoginPassword ? 'text' : 'password'}
    name='password'
    id='password'
    placeholder='Enter your password'
    onChange={(e) => {
      setlogindata({ ...logindata, Password: e.target.value });
      setLoginErrors({ ...loginErrors, password: '' });
    }}
    
  />
  
  <span
    onClick={toggleLoginPasswordVisibility}
    className="eye-icon"
  >
   {showLoginPassword ? <Eye color='black' /> : <EyeSlash color='black' />}
  </span>
</div>

            {loginErrors.password && <div className="error-msg">{loginErrors.password}</div>}
          </div>

          <Link to='/forgotpassword' style={{ textDecoration: 'none', width: '100%' }}>
            <p>Forgot Password?</p>
          </Link>

          {/*  <Link to='/' style={{textDecoration:'none', width:'100%'}}>
                        <button type='submit'>Login</button>
                    </Link> */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              handleLogin()
            }}
          >Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>

        </form>
      </div>
    </div>
  )
}

export default Login