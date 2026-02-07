import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../COMPONENTS/Navbar/Navbar";
import logo from "../../ASSETS/logo.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Typography } from "@mui/material";
import { APPEnv } from "../../COMPONENTS/config";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [verify, setverify] = useState();
  const [otp, setOTP] = useState("");

  const [createDisable, setCreateDisable] = useState(true);
  const [date, setDate] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showVerifySection, setShowVerifySection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPasswordCreate, setCreatePassword] = useState(false);
  const [createPassword, setcreatePassword] = useState("");
  const [postalcode, setpostalcode] = React.useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserdata] = useState([]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [sendDisable, setSendDisabled] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [forgotVerify, setForgotOtpVerify] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [signupdata, setsignupdata] = React.useState({
    OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
    BranchCode: "HO",
    B2CCustomerId: "",
    B2CCustomerName: "",
    EmailId: "",
    Password: "",
    AddressLine1: "",
    AddressLine2: "",
    AddressLine3: "",
    LoyaltyPoints: 0,
    RedeemPoints: 0,
    MobileNo: "",
    CountryId: "0003",
    PostalCode: "",
    IsActive: true,
    IsApproved: true,
    CreatedBy: "",
    CreatedOn: new Date(),
    ChangedBy: "user",
    ChangedOn: new Date(),
    FloorNo: "",
    UnitNo: "",
    Orders: "",
    Address:"",
  });

  const [forgotData, setForgotData] = useState({
    OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
    Email: "",
    OTP: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const handleSignup = async () => {
    let tempdata = {
      ...signupdata,
      Address: signupdata.AddressLine1+signupdata.AddressLine2+signupdata.AddressLine3    };
    let nameError = "";
    let phoneError = "";
    let emailError = "";
    let passwordError = "";
    let postalCodeError = "";
    let floorError = "";
    let addressError = "";
    let unitError = "";
    if (!signupdata.B2CCustomerName) {
      nameError = "Please enter your name";
    } else if (/^\s*$/.test(signupdata.B2CCustomerName)) {
      nameError = "Name cannot be just spaces";
    }

    if (!signupdata.MobileNo) {
      phoneError = "Please enter your phone number";
    } else if (/^\s*$/.test(signupdata.MobileNo)) {
      phoneError = "Phone number cannot be just spaces";
    }

    if (!signupdata.EmailId) {
      emailError = "Please enter your email";
    } else if (!isEmailValid(signupdata.EmailId)) {
      emailError = "Please enter a valid email";
    }

    if (!signupdata.Password) {
      passwordError = "Please enter your password";
    } else if (/^\s*$/.test(signupdata.Password)) {
      passwordError = "Password cannot be just spaces";
    }

    if (!signupdata.PostalCode) {
      postalCodeError = "Please enter your postal code";
    } else if (/^\s*$/.test(signupdata.PostalCode)) {
      postalCodeError = "Postal code cannot be just spaces";
    }
    if (!signupdata.AddressLine2) {
      addressError = "Please enter your address line 2";
      console.log(signupdata.AddressLine2);
    } else if (/^\s*$/.test(signupdata.AddressLine2)) {
      addressError = "Address Line 2 cannot be just spaces";
    }

    if (!signupdata.FloorNo) {
      floorError = "Please enter your Floor No";
      console.log(signupdata.FloorNo);
    } else if (/^\s*$/.test(signupdata.FloorNo)) {
      floorError = "Floor cannot be just spaces";
    }
    if (!signupdata.UnitNo) {
      unitError = "Please enter your Unit No";
      console.log(signupdata.UnitNo);
    } else if (/^\s*$/.test(signupdata.UnitNo)) {
      unitError = "Unit cannot be just spaces";
    }

    setSignupErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
      password: passwordError,
      postalCode: postalCodeError,
      address: addressError,
      floor: floorError,
      unit: unitError,
    });
    console.log(signupErrors.floor);
    if (
      nameError ||
      phoneError ||
      emailError ||
      passwordError ||
      postalCodeError ||
      floorError ||
      addressError ||
      unitError
    ) {
      return;
    }
    // console.log(tempdata)
    fetch(
      APPEnv.baseUrl +
        "/B2CCustomerRegister/GetbyEmail?OrganizationId=" +
        process.env.REACT_APP_BACKEND_ORGANIZATION +
        "&EmailId=" +
        signupdata.EmailId
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.Data[0].EmailId !== null) {
          toast.error("Email already exists");
        } else {
          fetch(APPEnv.baseUrl + "/B2CCustomerRegister/Create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tempdata),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.Code == 200) {
                toast.success("Signup Successfull", {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  //color
                });
                navigate("/login");
                // setshowlogin('0')
              } else {
                toast.error("Signup Failed");
              }
            });
        }
      })
      .catch((error) => {
        return false;
      });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const email = signupdata.EmailId.replace(/@/g, "%40");

    // Check if email is provided
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    const response = await fetch(
      APPEnv.baseUrl +
        "/B2CCustomerRegister/GetbyEmail?OrganizationId=" +
        process.env.REACT_APP_BACKEND_ORGANIZATION +
        "&EmailId=" +
        email,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.Data && data.Data[0].EmailId === null) {
      const apiEndpoint =
        APPEnv.baseUrl +
        "/SendOTP/SendOTP?OrganizationId=" +
        process.env.REACT_APP_BACKEND_ORGANIZATION +
        "&Email=" +
        signupdata.EmailId;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupdata),
      };

      try {
        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("OTP sent successfully:");

        setverify(data.Data);
        setIsOtpSent(true);
        setShowVerifySection(true);
        setOtpSentMessage(true);
        setTimeout(() => {
          setOtpSentMessage(false);
        }, 1000);
        setSendDisabled(true);
        toast.success("OTP has been sent to your email");
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    } else {
      toast.error("Your email is registered already please try login", {
        position: "bottom-right",
        autoClose: 1000,
      });
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
      const response = await fetch(
        APPEnv.baseUrl +
          "/B2CCustomerRegister/GetbyEmail?OrganizationId=" +
          process.env.REACT_APP_BACKEND_ORGANIZATION +
          "&EmailId=" +
          email,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.Data && data.Data[0].EmailId === null) {
        toast.error("Please create an account", {
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        setUserdata(data.Data[0]);
        const apiEndpoint =
          APPEnv.baseUrl +
          "/SendOTP/SendOTP?OrganizationId=" +
          process.env.REACT_APP_BACKEND_ORGANIZATION +
          "&Email=" +
          forgotData.Email;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(forgotData),
        };

        try {
          const response = await fetch(apiEndpoint, options);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          console.log("OTP sent successfully:", data);

          setverify(data.Data);
          setForgotOtpVerify(true);
          setTimeout(() => {
            setOtpSentMessage(false);
          }, 1000);
        } catch (error) {
          console.error("Error sending OTP:", error);
        }
      }
    }
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === verify) {
      console.log("OTP verified successfully.");
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
      console.error("Invalid OTP. Please try again.");
      setOtpError(true); // Set OTP error flag if OTP is invalid
      // TODO: Handle the error or display it to the user
    }
  };

  function getCurrentDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setDate(formattedDate);
  }

  const handleVerifyForgotOtp = async (e) => {
    if (forgotData.OTP === verify) {
      console.log("OTP verified successfully.");
      getCurrentDate();
      setIsVerified(true);
      setOtpError(false); // Reset OTP error flag if OTP is verified successfully
      setForgotOtpVerify(false);
      setCreatePassword(true);
      setSendDisabled(true);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    } else {
      console.error("Invalid OTP. Please try again.");
      toast.error("Please Enter Correct OTP", {
        position: "bottom-right",
        autoClose: 1000,
      });
      setOtpError(true); // Set OTP error flag if OTP is invalid
      // TODO: Handle the error or display it to the user
    }
  };

  const isEmailValid = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
        OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
        B2CCustomerId: userData.B2CCustomerId,
        EmailId: forgotData.Email,
        Password: confirmPassword,
      };

      const apiEndpoint = `${APPEnv.baseUrl}/B2CCustomerRegister/EditProfilePassword`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      try {
        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("OTP sent successfully:");
        toast.success("Password changes successfully", {
          position: "bottom-right",
          autoClose: 1000,
        });
        window.location.href = "/";
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    } else {
      toast.error("Your email is registered already please try login", {
        position: "bottom-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="authpage">
      <Navbar />

      <div className="authcont">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
          alt="noimg"
          style={{
            height: "1100px",
            width: "500px",
            objectFit:"fill"
          }}
        />
        <form className="authform">
          <div className="s1">
            <img src={logo} alt="logo" className="logo" />
            <h1>Sign Up for free!</h1>
            <p>
              Already Registered?
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

          <div className="formgroup">
            <label htmlFor="name">
              Name <span className="mandatory">*</span>{" "}
              {signupErrors.name && (
                <span className="error-msg"> - {signupErrors.name}</span>
              )}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter the Name"
              value={signupdata.B2CCustomerName}
              onChange={(e) => {
                setsignupdata({
                  ...signupdata,
                  B2CCustomerName: e.target.value,
                  CreatedBy: e.target.value,
                  
                });
              }}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="phone">
              Phone <span className="mandatory">*</span>{" "}
              {signupErrors.phone && (
                <span className="error-msg"> - {signupErrors.phone}</span>
              )}
            </label>
            <div className="email-input-container">
              <input
                type="text"
                name="phone"
                id="phone"
                value={signupdata.MobileNo}
                placeholder="Enter the Phone no"
                style={{width:"100%"}}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  if (value.length <= 10) {
                    setsignupdata({ ...signupdata, MobileNo: value });
                  }
                }}
              />
            </div>
          </div>
          <div className="formgroup">
            <label htmlFor="email">
              Email Address <span className="mandatory">*</span>{" "}
              {signupErrors.email && (
                <span className="error-msg"> - {signupErrors.email}</span>
              )}
            </label>
            <div className="email-input-container">
              <input
                type="email"
                name="email"
                id="email"
                value={signupdata.EmailId}
                className="email-input"
                placeholder="Enter the Email"
                style={{width:"100%",marginBottom:"10px"}}
                onChange={(e) => {
                  setsignupdata({ ...signupdata, EmailId: e.target.value });
                }}
              />
              <button
                className="btn send-otp-button"
                disabled={sendDisable || isOtpVerified}
                onClick={handleSendOTP}
              >
                Send OTP
              </button>
            </div>

            {isOtpSent && (
              <ToastContainer position="top-right" autoClose={5000} />
            )}
            {isOtpSent && !isVerified && showVerifySection && (
              <div className="formgroup">
                <label>OTP </label>
                <div className="email-input-container">
                  <input
                    className="email-input"
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <button
                    className="btn send-otp-button"
                    onClick={handleVerifyOTP}
                  >
                    <Typography sx={{ fontSize: "14px" }}>
                      Verify OTP
                    </Typography>
                  </button>
                </div>
              </div>
            )}

            {showSuccessMessage && (
              <p style={{ color: "green" }}>OTP verified successfully!</p>
            )}

            {/* Display invalid OTP message */}
            {otpError && (
              <p style={{ color: "red" }}>Invalid OTP. Please try again.</p>
            )}
          </div>
          <div className="formgroup">
            <label htmlFor="password">
              Password <span className="mandatory">*</span>{" "}
              {signupErrors.password && (
                <span className="error-msg"> - {signupErrors.password}</span>
              )}
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter the Password"
                value={signupdata.Password}
                onChange={(e) => {
                  setsignupdata({ ...signupdata, Password: e.target.value });
                }}
              />
              <span
                onClick={togglePasswordVisibility}
                 className="eye-icon"
              >
                {showPassword ? 
                  // Eye-slash icon from react-bootstrap-icons
                  <Eye color="black"/>
                : 
                  // Eye icon from react-bootstrap-icons
                  <EyeSlash color="black"/>
                }
              </span>
            </div>
            {/* {signupErrors.password && <div className='error-msg'>{signupErrors.password}</div>} */}
          </div>
          <div className="formgroup">
            <label htmlFor="postalcode">
              Postal Code <span className="mandatory">*</span>{" "}
              {signupErrors.postalCode && (
                <span className="error-msg"> - {signupErrors.postalCode}</span>
              )}
            </label>
            <div className="email-input-container">
              <input
                className="email-input"
                type="text"
                name="postalcode"
                id="postalcode"
                placeholder="Enter the Postalcode"
                value={postalcode}
                style={{width:"100%", marginBottom:"10px"}}
                onChange={(e) => {
                  setpostalcode(e.target.value);
                  setsignupdata({ ...signupdata, PostalCode: e.target.value });
                }}
              />

              <button
                className="btn send-otp-button"
                onClick={async (e) => {
                  e.preventDefault();
                  const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

                  const response = await fetch(url);
                  const data = await response.json();

                  if (data.results && data.results.length > 0) {
                    let addressLine3 =
                      data.results[0].BUILDING !== "NIL"
                        ? `${data.results[0].BUILDING}, SINGAPORE ${postalcode}`
                        : `SINGAPORE ${postalcode}`;
                    setsignupdata((prevAddress) => ({
                      ...prevAddress,
                      AddressLine1: `${data.results[0].BLK_NO} ${data.results[0].ROAD_NAME}`,
                      AddressLine3: addressLine3,
                      
                    }));
                  } else {
                    console.log("No results found.");
                    // Handle when no results are found
                  }
                }}
              >
                Fetch
              </button>
            </div>
          </div>

          <div className="formgroup">
            <label htmlFor="addressline1">Address Line 1</label>
            <input
              type="text"
              name="addressline1"
              id="addressline1"
              placeholder="Enter alternative address"
              value={signupdata.AddressLine1}
              onChange={(e) => {
                e.preventDefault();
                setsignupdata({ ...signupdata, AddressLine1: e.target.value });
              }}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="addressline2">
              Address Line 2 <span className="mandatory">*</span>{" "}
              {signupErrors.address && (
                <span className="error-msg"> - {signupErrors.address}</span>
              )}
            </label>
            <input
              type="text"
              name="addressline2"
              id="addressline2"
              value={signupdata.AddressLine2}
              onChange={(e) => {
                e.preventDefault();
                setsignupdata({ ...signupdata, AddressLine2: e.target.value });
              }}
            />
          </div>

          <div className="formgroup">
            <label htmlFor="addressline3">
              Address Line 3 <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="addressline3"
              id="addressline3"
              value={signupdata.AddressLine3}
              onChange={(e) => {
                e.preventDefault();
                setsignupdata({ ...signupdata, AddressLine3: e.target.value });
              }}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="floorno">
              Floor No <span className="mandatory">*</span>
              {signupErrors.floor && (
                <span className="error-msg"> - {signupErrors.floor}</span>
              )}
            </label>
            <input
              type="text"
              name="floorno"
              id="floorno"
              value={signupdata.FloorNo}
              onChange={(e) => {
                e.preventDefault();
                setsignupdata({ ...signupdata, FloorNo: e.target.value });
              }}
            />
          </div>
          <div className="formgroup">
            <label htmlFor="unitno">
              Unit No <span className="mandatory">*</span>
              {signupErrors.unit && (
                <span className="error-msg"> - {signupErrors.unit}</span>
              )}
            </label>
            <input
              type="text"
              name="unitno"
              id="unitno"
              value={signupdata.UnitNo}
              onChange={(e) => {
                e.preventDefault();
                setsignupdata({ ...signupdata, UnitNo: e.target.value });
              }}
            />
          </div>
          <button
            className="btn"
            onClick={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            disabled={createDisable}
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Signup;
