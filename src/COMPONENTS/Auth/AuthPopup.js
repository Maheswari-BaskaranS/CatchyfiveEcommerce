import React, { useEffect, useState } from 'react'
import './AuthPopup.css'
import Switch from "react-switch";
import logo from '../../ASSETS/logo.png'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { authPopupState } from '../../Providers/AuthPopupProvider';
import { loginState } from '../../Providers/LoginProvider';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { APPEnv } from '../config';

const AuthPopup = () => {
  const [authPopupShow, setAuthPopupShow] = useRecoilState(authPopupState);
  const [checked, setChecked] = React.useState(false);
  const [loggedIn, setLoggedIn] = useRecoilState(loginState);
  const [loginErrors, setLoginErrors] = useState({})
  const [otp, setOTP] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verify, setverify] = useState();
  const [showVerifySection, setShowVerifySection] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [forgotVerify, setForgotOtpVerify] = useState(false);
  const [showPasswordCreate, setCreatePassword] = useState(false);
  const [createPassword, setcreatePassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [existMailerr, setExistingMailerr] = useState(false);
  const [sendDisable, setSendDisabled] = useState(false);
  const [userData, setUserdata] = useState([]);
  const [date, setDate] = useState("");
  const [createDisable, setCreateDisable] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification status

  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
  }
  const [signupErrors, setSignupErrors] = useState({});
  const [newaddress, setnewaddress] = React.useState({
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    IsDefault: true,
  })
  const [postalcode, setpostalcode] = React.useState('')


  const [logindata, setlogindata] = React.useState({})
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };


  const handleLogin = async () => {

    let emailError = '';
    let passwordError = '';

    if (!logindata.Username) {
      emailError = 'Please enter your email';
    } else if (!isEmailValid(logindata.Username)) {
      emailError = 'Please enter a valid email';
    }
    console.log("email", logindata.EmailId);

    if (!logindata.Password) {
      passwordError = 'Please enter your password';
    }
    // } else if (!isPasswordValid(logindata.Password)) {
    //   passwordError =
    //     'Please enter a valid password';
    // }

    setLoginErrors({
      username: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }
    // Proceed with the API call
    fetch(APPEnv.baseUrl + '/B2CCustomerRegister/CustomerLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
        "UserName": logindata.Username,
        "Password": logindata.Password,
        "BranchCode": "HO",
        "TranType": "string",
        "Module": "string"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Code === 200 && data.Message === "Sucess") {
          // Rest of your success logic...
          localStorage.setItem('token', JSON.stringify(data.Data))
          //                 // save password in local storage
          localStorage.setItem('password', JSON.stringify(logindata.Password))
          updateuserdata()
          setLoggedIn(true)
          toast.success('Login Successfull',
            {
              position: "top-right",
              autoClose: 1000,
            }
          )

          setTimeout(() => {
            setAuthPopupShow(false)
            // window.location.reload()
          }, 2000);
          window.location.reload();
        } else {
          toast.error('Login Failed');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        toast.error('An error occurred during login.');
      });

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


  const [showlogin, setshowlogin] = React.useState('0')



  // signup
  const [signupdata, setsignupdata] = React.useState({
    "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
    "BranchCode": "HO",
    "B2CCustomerId": "",
    B2CCustomerName: "",
    EmailId: "",
    Password: "",
    AddressLine1: "",
    AddressLine2: "",
    AddressLine3: "",
    LoyaltyPoints: "0",
    RedeemPoints: "0",
    MobileNo: "",
    CountryId: "0003",
    PostalCode: "",
    IsActive: true,
    IsApproved: true,
    CreatedBy: "user",
    CreatedOn: new Date(),
    ChangedBy: "user",
    ChangedOn: new Date(),
    FloorNo: "",
    UnitNo: "",
    // Orders: [],
    // Address: [
    //   {}
    // ]
  })

  const [forgotData, setForgotData] = useState({
    "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
    Email: "",
    OTP: "",
  })

  const getdatafrompostalcode = async () => {


    let url = `https://developers.onemap.sg/commonapi/search?searchVal=${signupdata.PostalCode}&returnGeom=N&getAddrDetails=Y&pageNum=1`
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.results[0])

    setsignupdata({
      ...signupdata,
      // AddressLine1: data.results[0].BLK_NO,
      // AddressLine2: data.results[0].BUILDING,
      AddressLine3: data.results[0].ADDRESS,
    })
  }

  const handleSignup = async () => {


    let tempdata = {
      ...signupdata,
    }
    let nameError = '';
    let phoneError = '';
    let emailError = '';
    let passwordError = '';
    let postalCodeError = '';
    let floorError = '';
    let addressError = '';
    let unitError = '';
    if (!signupdata.B2CCustomerName) {
      nameError = 'Please enter your name';
    } else if (/^\s*$/.test(signupdata.B2CCustomerName)) {
      nameError = 'Name cannot be just spaces';
    }

    if (!signupdata.MobileNo) {
      phoneError = 'Please enter your phone number';
    } else if (/^\s*$/.test(signupdata.MobileNo)) {
      phoneError = 'Phone number cannot be just spaces';
    }

    if (!signupdata.EmailId) {
      emailError = 'Please enter your email';
    } else if (!isEmailValid(signupdata.EmailId)) {
      emailError = 'Please enter a valid email';
    }

    if (!signupdata.Password) {
      passwordError = 'Please enter your password';
    } else if (/^\s*$/.test(signupdata.Password)) {
      passwordError = 'Password cannot be just spaces';
    }

    if (!signupdata.PostalCode) {
      postalCodeError = 'Please enter your postal code';
    } else if (/^\s*$/.test(signupdata.PostalCode)) {
      postalCodeError = 'Postal code cannot be just spaces';
    }
    if (!signupdata.AddressLine2) {
      addressError = 'Please enter your address line 2';
      console.log(signupdata.AddressLine2);
    } else if (/^\s*$/.test(signupdata.AddressLine2)) {
      addressError = 'Address Line 2 cannot be just spaces';
    }

    if (!signupdata.FloorNo) {
      floorError = 'Please enter your Floor No';
      console.log(signupdata.FloorNo);
    } else if (/^\s*$/.test(signupdata.FloorNo)) {
      floorError = 'Floor cannot be just spaces';
    }
    if (!signupdata.UnitNo) {
      unitError = 'Please enter your Unit No';
      console.log(signupdata.UnitNo);
    } else if (/^\s*$/.test(signupdata.UnitNo)) {
      unitError = 'Unit cannot be just spaces';
    }


    setSignupErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
      password: passwordError,
      postalCode: postalCodeError,
      address: addressError,
      floor: floorError,
      unit:unitError

    });
    console.log(signupErrors.floor);
    if (nameError || phoneError || emailError || passwordError || postalCodeError || floorError || addressError || unitError) {
      return;
    }
    // console.log(tempdata)
    fetch(APPEnv.baseUrl + '/B2CCustomerRegister/GetbyEmail?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION +'&EmailId=' + signupdata.EmailId)
      .then((response) => response.json())
      .then((data) => {
        if (data.Data[0].EmailId !== null) {
          toast.error("Email already exists")
        }
        else {

          fetch(APPEnv.baseUrl + '/B2CCustomerRegister/Create',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(tempdata),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.Code == 200) {
                toast.success('Signup Successfull',
                  {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    //color
                  }
                )

                setshowlogin('0')
              }
              else {
                toast.error('Signup Failed')
              }
            })
        }
      })
      .catch((error) => {
        return false
      })


  }
  const handleOTPChange = (event) => {
    setOTP(event.target.value);

  };
  const [otpSentMessage, setOtpSentMessage] = useState(false);
  const handleSendOTP = async (e) => {
    e.preventDefault();
    const email = signupdata.EmailId.replace(/@/g, "%40");

    // Check if email is provided
    if (!email) {
      alert('Please enter your email address.');
      return;
    }


    const response = await fetch(APPEnv.baseUrl+'/B2CCustomerRegister/GetbyEmail?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&EmailId='+email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data && data.Data && data.Data[0].EmailId === null) {
      const apiEndpoint = APPEnv.baseUrl+'/SendOTP/SendOTP?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&Email='+signupdata.EmailId;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupdata),
      };

      try {
        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('OTP sent successfully:');

        setverify(data.Data);
        setIsOtpSent(true);
        setShowVerifySection(true);
        setOtpSentMessage(true);
        setTimeout(() => {
          setOtpSentMessage(false);
        }, 1000);
        setSendDisabled(true);
        toast.success('OTP has been sent to your email');


      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      toast.error('Your email is registered already please try login', {
        position: "bottom-right",
        autoClose: 1000,
      })
    }
  };


  const [emailErr, setEmailErr] = useState(false);

  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    const email = forgotData.Email.replace(/@/g, "%40");

    // Check if email is provided
    if (!email) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
      const response = await fetch(APPEnv.baseUrl+'/B2CCustomerRegister/GetbyEmail?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&EmailId='+email, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.Data && data.Data[0].EmailId === null) {
        toast.error('Please create an account', {
          position: "bottom-right",
          autoClose: 1000,
        })
      } else {

        setUserdata(data.Data[0])
        const apiEndpoint = APPEnv.baseUrl+'/SendOTP/SendOTP?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&Email='+forgotData.Email;
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(forgotData),
        };

        try {
          const response = await fetch(apiEndpoint, options);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          console.log('OTP sent successfully:', data);

          setverify(data.Data);
          setForgotOtpVerify(true);
          setTimeout(() => {
            setOtpSentMessage(false);
          }, 1000);


        } catch (error) {
          console.error('Error sending OTP:', error);
        }
      }
    }
  };


  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === verify) {
      console.log('OTP verified successfully.');
      setIsVerified(true);
      setOtpError(false); // Reset OTP error flag if OTP is verified successfully
      setCreateDisable(false);
      // Show success message for 5 seconds
      setShowSuccessMessage(true);
      setIsOtpVerified(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    } else {
      console.error('Invalid OTP. Please try again.');
      setOtpError(true); // Set OTP error flag if OTP is invalid
      // TODO: Handle the error or display it to the user
    }
  };


  function getCurrentDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setDate(formattedDate);
  }



  const handleVerifyForgotOtp = async (e) => {
    if (forgotData.OTP === verify) {
      console.log('OTP verified successfully.');
      getCurrentDate()
      setIsVerified(true);
      setOtpError(false); // Reset OTP error flag if OTP is verified successfully
      setForgotOtpVerify(false);
      setCreatePassword(true)
      setSendDisabled(true);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    } else {
      console.error('Invalid OTP. Please try again.');
      toast.error('Please Enter Correct OTP', {
        position: "bottom-right",
        autoClose: 1000,
      })
      setOtpError(true); // Set OTP error flag if OTP is invalid
      // TODO: Handle the error or display it to the user
    }
  }

  const isEmailValid = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Regular expression for password validation
    // This regex requires at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const [moveChange, setMoveChange] = useState(true);

  useEffect(() => {
    if (createPassword === confirmPassword) {
      setMoveChange(false);
    } else {
      setMoveChange(true);
    }
  }, [createPassword, confirmPassword]);


  const handlePasswordchange = async () => {


    if (!moveChange) {

      const data = {
        "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
        "B2CCustomerId": userData.B2CCustomerId,
        "EmailId": forgotData.Email,
        "Password": confirmPassword
      }


      const apiEndpoint = `${APPEnv.baseUrl}/B2CCustomerRegister/EditProfilePassword`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      try {
        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('OTP sent successfully:');
        toast.success('Password changes successfully', {
          position: "bottom-right",
          autoClose: 1000,
        })
        window.location.href = "/";
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      toast.error('Your email is registered already please try login', {
        position: "bottom-right",
        autoClose: 1000,
      })
    }

  }

  return (
    <div
      className='auth-popup'
    >
      <div className='auth-popup__content'>
        <button className='auth-popup__close-btn'
          onClick={() => {
            // if(loggedIn){
            setAuthPopupShow(false)
            // }
            // else{
            //     toast.error('Please Login First')
            //     setAuthPopupShow(true)
            // }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {
          showlogin == '0' &&
          <div className='login'>
            <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Flogin.png&w=1920&q=75'
              alt='login' className='login__img' />
            <form >
              <div className='s1'>
                <img src={logo} alt='logo' className='logo' />
                <h1>Welcome Back!</h1>
                <p>Don't have an account?
                  <a
                    onClick={() => {
                      setshowlogin('1')
                    }}
                  >Create Account</a>
                </p>
              </div>
              <div className='formcont'>
                <label htmlFor='email'>Email Address <span className="mandatory">*</span></label>
                <input type='email' name='email' id='email' placeholder='Enter the Email'
                  onChange={(e) => {
                    setlogindata({ ...logindata, Username: e.target.value })
                    setLoginErrors({ ...loginErrors, username: '' });
                  }}

                />
                {loginErrors.username && <div className='error-msg'>{loginErrors.username}</div>}
              </div>
              {/* <div className='formcont'>
                                <label htmlFor='password'>Password <span className="mandatory">*</span></label>
                                <input type='password' name='password' id='password' placeholder='Enter your password'
                                    onChange={(e) => {
                                        setlogindata({ ...logindata, Password: e.target.value })
                                        setLoginErrors({ ...loginErrors, password: '' });
                                    }}
                                /> {loginErrors.password && <div className="error-msg">{loginErrors.password}</div>}
                            </div> */}

              <div className='formcont'>
                <label htmlFor='password'>
                  Password <span className="mandatory">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    name='password'
                    id='password'
                    placeholder='Enter the Password'
                    value={logindata.Password}
                    onChange={(e) => {
                      setlogindata({ ...logindata, Password: e.target.value });
                      setLoginErrors({ ...loginErrors, password: '' });
                    }}
                  />
                  <span
                    onClick={toggleLoginPasswordVisibility}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  >
                    {showLoginPassword ? (
                      <Eye />
                    ) : (
                      <EyeSlash />
                    )}
                  </span>
                </div>
                {loginErrors.password && <div className="error-msg">{loginErrors.password}</div>}
              </div>
              <div className='formcont1'>
                <a
                  onClick={() => {
                    setshowlogin('2')
                  }} style={{ cursor: 'pointer', color: 'var(--col1)' }}
                >Forgot Password ?</a>
              </div>

              <button className='btn'
                onClick={(e) => {
                  e.preventDefault()
                  handleLogin()
                }}
              >Sign In</button>
            </form>
          </div>
        }
        {
          showlogin == '2' &&
          <div className='login'>
            <div className='login__img'>
              <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Flogin.png&w=1920&q=75'
                alt='login' />
            </div>
            <form>
              <div className='s1'>
                <img src={logo} alt='logo' className='logo' />
                <h1>Forgot Password</h1>
                <p>Already Registered?
                  <a
                    onClick={() => {
                      setshowlogin('0')
                    }}
                  >Sign In Now</a>
                </p>
              </div>
              <div className='formcont'>
                <label htmlFor='email'>Email Address{signupErrors.email && <span className='error-msg'> - {signupErrors.email}</span>} <span className='mandatory'>*</span></label>
                <div className="email-input-container">
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='email-input'
                    placeholder='Enter the Email'
                    onChange={(e) => {
                      setForgotData({ ...forgotData, Email: e.target.value });
                    }}
                  />
                  <button className='btn send-otp-button' disabled={sendDisable} onClick={handleForgotSendOTP}>
                    Verify
                  </button>
                </div>
                <div style={{ color: 'red', display: emailErr ? 'flex' : 'none' }}><span>please enter email to send otp</span></div>
                {forgotVerify && (
                  <div className='formcont'>
                    <label htmlFor='VerifyOtp'>Otp <span className="mandatory">*</span></label>
                    <input type='text' name='verifyOtp' id='verifyOtp'
                      value={forgotData.OTP}
                      onChange={(e) => {
                        e.preventDefault()
                        setForgotData({ ...forgotData, OTP: e.target.value })
                      }}
                    />
                  </div>
                )}
                {showPasswordCreate && (
                  <>
                    <div className='formcont'>
                      <label htmlFor='createpassword'>Create Password{signupErrors.password && <span className='error-msg'> - {signupErrors.password}</span>} <span className='mandatory'>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name='createpassword'
                          id='createpassword'
                          placeholder='Create Password'
                          required
                          value={forgotData.createPassword}
                          onChange={(e) => {
                            e.preventDefault()
                            setcreatePassword(e.target.value)
                          }}
                        />
                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                          }}
                        >
                          {showPassword ? (
                            <Eye />
                          ) : (
                            <EyeSlash />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className='formcont'>
                      <label htmlFor='confirmpassword'>Confirm Password{signupErrors.password && <span className='error-msg'> - {signupErrors.password}</span>} <span className='mandatory'>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword2 ? 'text' : 'password'}
                          name='confirmpassword'
                          id='confirmpassword'
                          placeholder='Confirm Password'
                          required
                          value={forgotData.confirmPassword}
                          onChange={(e) => {
                            e.preventDefault()
                            setconfirmPassword(e.target.value)
                          }}
                        />
                        <span
                          onClick={togglePasswordVisibility2}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                          }}
                        >
                          {showPassword2 ? (
                            <Eye />
                          ) : (
                            <EyeSlash />
                          )}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: 'red', display: moveChange ? "flex" : "none" }}><span>Password is not matching</span></div>
                  </>
                )}

              </div>
              {forgotVerify && (
                <button className='btn'
                  onClick={(e) => {
                    e.preventDefault()
                    handleVerifyForgotOtp()
                  }}
                >Submit
                </button>
              )}
              {showPasswordCreate && (
                <button className='btn'
                  disabled={moveChange}
                  onClick={(e) => {
                    handlePasswordchange()
                  }}
                >Submit
                </button>
              )}
            </form>
          </div>
        }
        {
          // signup
          showlogin == '1' &&
          <div className='login'>
            <div className='login__img'>
              <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Flogin.png&w=1920&q=75'
                alt='login' />
            </div>
            <form>
              <div className='s1'>
                <img src={logo} alt='logo' className='logo' />
                <h1>Sign Up for free!</h1>
                <p>Already Registered?
                  <a
                    onClick={() => {
                      setshowlogin('0')
                    }}
                  >Sign In Now</a>
                </p>
              </div>
              <div className='formcont'>
              <label htmlFor='name'>
          Name <span className='mandatory'>*</span> {signupErrors.name && <span className='error-msg'> - {signupErrors.name}</span>}
        </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  placeholder='Enter the Name'
                  value={signupdata.B2CCustomerName} 
                  onChange={(e) => {
                    setsignupdata({ ...signupdata, B2CCustomerName: e.target.value });
                  }}
                />
              </div>
              <div className='formcont'>
              <label htmlFor='phone'>
          Phone <span className='mandatory'>*</span> {signupErrors.phone && <span className='error-msg'> - {signupErrors.phone}</span>}
        </label>
                <div className="email-input-container">
                  <input
                    type='text'
                    name='phone'
                    id='phone'
                    value={signupdata.MobileNo} 
                    placeholder='Enter the Phone no'
                    onChange={(e) => {
                      setsignupdata({ ...signupdata, MobileNo: e.target.value });
                    }}
                  />
 </div>
              </div>
              <div className='formcont'>
              <label htmlFor='email'>
          Email Address <span className='mandatory'>*</span> {signupErrors.email && <span className='error-msg'> - {signupErrors.email}</span>}
        </label>
                 <div className="email-input-container">
                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={signupdata.EmailId} 
                    className='email-input'
                    placeholder='Enter the Email'
                    onChange={(e) => {
                      setsignupdata({ ...signupdata, EmailId: e.target.value });
                    }}
                  />
                  <button className='btn send-otp-button' disabled={sendDisable || isOtpVerified} onClick={handleSendOTP}>
                    Send OTP
                  </button>

                </div>

                {isOtpSent && (
                  <ToastContainer position="top-right" autoClose={5000} />
                )}
                {isOtpSent && !isVerified && showVerifySection && (
                  <div className='formcont'>
                    <label>
                      OTP </label>
                    <div className="email-input-container">
                      <input
                        className='email-input'
                        type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
                      <button className='btn send-otp-button' onClick={handleVerifyOTP}>
                        <Typography sx={{ fontSize: '14px' }}>Verify OTP</Typography>
                      </button>
                    </div>
                  </div>

                )}

                {showSuccessMessage && (
                  <p style={{ color: 'green' }}>OTP verified successfully!</p>
                )}

                {/* Display invalid OTP message */}
                {otpError && (
                  <p style={{ color: 'red' }}>Invalid OTP. Please try again.</p>
                )}
              </div>
              <div className='formcont'>
              <label htmlFor='password'>
          Password <span className='mandatory'>*</span> {signupErrors.password && <span className='error-msg'> - {signupErrors.password}</span>}
        </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    id='password'
                    placeholder='Enter the Password'
                    value={signupdata.Password}
                    onChange={(e) => {
                      setsignupdata({ ...signupdata, Password: e.target.value });
                    }}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? (
                      // Eye-slash icon from react-bootstrap-icons
                      <Eye />
                    ) : (
                      // Eye icon from react-bootstrap-icons
                      <EyeSlash />
                    )}
                  </span>
                </div>
                {/* {signupErrors.password && <div className='error-msg'>{signupErrors.password}</div>} */}
              </div>
              <div className='formcont'>
              <label htmlFor='postalcode'>
          Postal Code <span className='mandatory'>*</span> {signupErrors.postalCode && <span className='error-msg'> - {signupErrors.postalCode}</span>}
        </label>
                <div className="email-input-container">
                  <input
                    className='email-input'
                    type='text'
                    name='postalcode'
                    id='postalcode'
                    placeholder='Enter the Postalcode'
                    value={postalcode}
                    onChange={(e) => {
                      setpostalcode(e.target.value);
                      setsignupdata({ ...signupdata, PostalCode: e.target.value });
                    }}
                  />

                  <button
                    className='btn send-otp-button'
                    onClick={async (e) => {
                      e.preventDefault();
                      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

                      const response = await fetch(url);
                      const data = await response.json();

                      if (data.results && data.results.length > 0) {
                        let addressLine3 = data.results[0].BUILDING !== 'NIL' ? `${data.results[0].BUILDING}, SINGAPORE ${postalcode}` : `SINGAPORE ${postalcode}`;
                        setsignupdata(prevAddress => ({
                          ...prevAddress,
                          AddressLine1: `${data.results[0].BLK_NO} ${data.results[0].ROAD_NAME}`,
                          AddressLine3: addressLine3
                        }));
                      } else {
                        console.log('No results found.');
                        // Handle when no results are found
                      }
                    }}
                  >
                    Fetch
                  </button>
                </div>
              </div>

              <div className='formcont'>
                <label htmlFor='addressline1'>Address Line 1</label>
                <input type='text' name='addressline1' id='addressline1' placeholder='Enter alternative address'
                  value={signupdata.AddressLine1}
                  onChange={(e) => {
                    e.preventDefault()
                    setsignupdata({ ...signupdata, AddressLine1: e.target.value })
                  }}
                />
              </div>
              <div className='formcont'>
              <label htmlFor='addressline2'>
          Address Line 2 <span className='mandatory'>*</span> {signupErrors.address && <span className='error-msg'> - {signupErrors.address}</span>}
        </label>
                <input type='text' name='addressline2' id='addressline2'
                  value={signupdata.AddressLine2}
                  onChange={(e) => {
                    e.preventDefault()
                    setsignupdata({ ...signupdata, AddressLine2: e.target.value })
                  }}
                />
              </div>

              <div className='formcont'>
              <label htmlFor='addressline3'>
          Address Line 3 <span className='mandatory'>*</span>
        </label>
                <input type='text' name='addressline3' id='addressline3'
                  value={signupdata.AddressLine3}
                  onChange={(e) => {
                    e.preventDefault()
                    setsignupdata({ ...signupdata, AddressLine3: e.target.value })
                  }}
                />
              </div>
              <div className='formcont'>
              <label htmlFor='floorno'>
          Floor No <span className='mandatory'>*</span>{signupErrors.floor && <span className='error-msg'> - {signupErrors.floor}</span>}
        </label>
                <input type='text' name='floorno' id='floorno'
                  value={signupdata.FloorNo}
                  onChange={(e) => {
                    e.preventDefault()
                    setsignupdata({ ...signupdata, FloorNo: e.target.value })
                  }}
                />
              </div>
              <div className='formcont'>
              <label htmlFor='unitno'>
          Unit No <span className='mandatory'>*</span>{signupErrors.unit && <span className='error-msg'> - {signupErrors.unit}</span>}
        </label>
                <input type='text' name='unitno' id='unitno'
                  value={signupdata.UnitNo}
                  onChange={(e) => {
                    e.preventDefault()
                    setsignupdata({ ...signupdata, UnitNo: e.target.value })
                  }}
                />
              </div>

              <button className='btn'
                onClick={(e) => {
                  e.preventDefault()
                  handleSignup()
                }}
                disabled={createDisable} 
              >Sign Up</button>
                 </form>
          </div>
        }
      </div>
      <ToastContainer position="top-right" autoClose={5000}/>
    </div>
  )
}

export default AuthPopup