import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import './AuthPage.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { APPEnv } from '../../COMPONENTS/config';
import logo from '../../ASSETS/logo.png'
const ForgotPassword = () => {
  const [signupErrors, setSignupErrors] = useState({});
   const [date, setDate] = useState("");
   const navigate = useNavigate();
     const [showLoginPassword, setShowLoginPassword] = useState(false);
   const [createPassword, setcreatePassword] = useState("");
   const [otpSentMessage, setOtpSentMessage] = useState(false);
   const [userData, setUserdata] = useState([]);
   const [verify, setverify] = useState();
    const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCreate, setCreatePassword] = useState(false);
    const [forgotVerify, setForgotOtpVerify] = useState(false);
   const [otpError, setOtpError] = useState(false);
   const [emailErr, setEmailErr] = useState(false);
   const [moveChange, setMoveChange] = useState(true);
     const [confirmPassword, setconfirmPassword] = useState("");
   const [showPassword2, setShowPassword2] = useState(false);
   

      useEffect(() => {
        setMoveChange(createPassword !== confirmPassword);
      }, [createPassword, confirmPassword]);

      const handlePasswordchange = async (e) => {
        e.preventDefault(); // Prevent default behavior
        
        if (moveChange) { // If passwords do not match
          toast.error("Passwords do not match!", {
            position: "bottom-right",
            autoClose: 1000,
          });
          return;
        }
      
        const data = {
          OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
          B2CCustomerId: userData?.B2CCustomerId, // Ensure userData exists
          EmailId: forgotData?.Email || "", // Prevent undefined
          Password: createPassword,
        };
      
        const apiEndpoint = `${APPEnv.baseUrl}/B2CCustomerRegister/EditProfilePassword`;
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
      
        console.log("Sending API request:", data);
        try {
          const response = await fetch(apiEndpoint, options);
          console.log("API Response Status:", response.status);
      
          if (!response.ok) {
            console.error("API Error Response:", await response.text());
            throw new Error("Network response was not ok");
          }
      
          const result = await response.json();
          console.log("API Success Response:", result);
          
          toast.success("Password changed successfully", {
            position: "top-right",
            autoClose: 3000,
          });
      
          setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
          console.error("Error changing password:", error);
          toast.error(`Failed to change password: ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      };
      
  
  
   const [forgotData, setForgotData] = useState({
       "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
       Email: "",
       OTP: "",
     })
     const [isVerified, setIsVerified] = useState(false);
      
        const [showSuccessMessage, setShowSuccessMessage] = useState(false);
      
        const togglePasswordVisibility = () => {
          setShowPassword(!showPassword);
        };
        const togglePasswordVisibility2 = () => {
          setShowPassword2(!showPassword2);
        };
        const toggleLoginPasswordVisibility = () => {
          setShowLoginPassword(!showLoginPassword);
        };
      
     const [sendDisable, setSendDisabled] = useState(false);
    function getCurrentDate() {
      const today = new Date();
  
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
  
      const formattedDate = `${day}-${month}-${year}`;
  
      setDate(formattedDate);
    }

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
    toast.success("OTP sent successfully")
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
      
  
    const handleVerifyForgotOtp = async (e) => {
      if (forgotData.OTP === verify) {
        console.log('OTP verified successfully.');
        toast.success('OTP verified successfully.')
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
    return (
    <div className='authpage'>
      <Navbar />

      <div className='authcont'>
      <img src='https://borobazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Flogin.png&w=1920&q=75'
                            alt='login' className='login__img' />
        {/* <img src='https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80' alt='noimg' /> */}
        <form className='authform'>
              <div className='s1'>
                <img src={logo} alt='logo' className='logo' />
                <h1>Forgot Password</h1>
                <p>Already Registered?
                <a
                style={{
                  cursor: "pointer",
                  color: "#02b290",
                  textDecoration: "underline",
                  marginLeft:"5px"
                }}
                onClick={() => navigate("/login")}
              >
                Sign In Now
              </a>
                </p>
              </div>
              <div className='formgroup'>
                <label htmlFor='email'>Email Address{signupErrors.email && <span className='error-msg'> - {signupErrors.email}</span>} <span className='mandatory'>*</span></label>
                <div className="email-input-container">
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='email-input'
                    placeholder='Enter the Email'
                    style={{ width: "100%" , marginBottom:"10px"}}
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
                  <div className='formgroup'>
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
                    <div className='formgroup'>
                      <label htmlFor='createpassword'>Create Password{signupErrors.password && <span className='error-msg'> - {signupErrors.password}</span>} <span className='mandatory'>*</span></label>
                      <div  className="password-container">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name='createpassword'
                          id='createpassword'
                          placeholder='Create Password'
                          required
                          value={createPassword}
                          onChange={(e) => {
                            setcreatePassword(e.target.value)
                          }}
                        />
                        <span
                          onClick={togglePasswordVisibility}
                         className="eye-icon"
                        >
                          {showPassword ? 
                            <Eye color='black'/>
                           : 
                            <EyeSlash color='black' />
                          }
                        </span>
                      </div>
                    </div>
                    <div className='formgroup'>
                      <label htmlFor='confirmpassword'>Confirm Password{signupErrors.password && <span className='error-msg'> - {signupErrors.password}</span>} <span className='mandatory'>*</span></label>
                      <div className="password-container">
                        <input
                          type={showPassword2 ? 'text' : 'password'}
                          name='confirmpassword'
                          id='confirmpassword'
                          placeholder='Confirm Password'
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                         
                            setconfirmPassword(e.target.value)
                          }}
                        />
                        <span
                          onClick={togglePasswordVisibility2}
                        className="eye-icon"
                        >
                          {showPassword2 ? 
                            <Eye color='white'/>
                           : 
                            <EyeSlash color='white'/>
                          }
                        </span>
                      </div>
                    </div>
                    {moveChange && <div style={{ color: 'red' }}><span>Passwords do not match</span></div>}

                  </>
                )}

              </div>
              {forgotVerify && (
                <button className='buttons'
                  onClick={(e) => {
                    e.preventDefault()
                    handleVerifyForgotOtp()
                  }}
                >Submit
                </button>
              )}
              {showPasswordCreate && (
                <button className='buttons'
                  disabled={moveChange}
                  onClick={(e) => {
                    handlePasswordchange(e)
                  }}
                >Submit
                </button>
              )}
            </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000}/>
    </div>
  )
}

export default ForgotPassword