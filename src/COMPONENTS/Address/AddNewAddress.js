import React from 'react'
import { useRecoilState } from 'recoil'
import { newAddressProvider } from '../../Providers/NewAddressProvider'
import './AddNewAddress.css'
import logo from '../../ASSETS/logo.png'
import { toast, ToastContainer } from 'react-toastify'
import { useState } from 'react'
import { Grid, Paper, Typography, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { APPEnv } from '../config'


const AddNewAddress = ({ user, getaddress, savedaddresses=[] }) => {
  const [shownewaddressform, setShownewaddressform] = useRecoilState(newAddressProvider)


  const [newaddress, setnewaddress] = React.useState({
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    FloorNo:'',
    UnitNo:'',
    IsDefault: true,
  })
 const [signupErrors, setSignupErrors] = useState({});



  const [postalcode, setpostalcode] = useState('');
  const [errorPostalCode, setErrorPostalCode] = useState('');
  const [errorFloorNumber, setErrorFloorNumber] = useState('');
  const [boxLoad , setboxload ] = React.useState(false);

  const addnewaddress = () => {
    let floorError = '';
    let postalError = '';
    let unitError = '';
    let addressError1 = '';
    let addressError2 = '';
    let addressError3 = '';
    if (!postalcode) {
      postalError = 'Please enter postalcode';
      console.log(newaddress.postalcode);
    } else if (/^\s*$/.test(newaddress.postalcode)) {
      postalError = 'PostalCode cannot be just spaces';
    }
    if (!newaddress.AddressLine1) {
      addressError1 = 'Please enter your Address in Line 1';
      console.log(newaddress.AddressLine1);
    } else if (/^\s*$/.test(newaddress.AddressLine1)) {
      addressError1 = 'Address in Line 1 cannot be just spaces';
    }
    if (!newaddress.AddressLine2) {
      addressError2 = 'Please enter your Address in Line 2';
      console.log(newaddress.AddressLine2);
    } else if (/^\s*$/.test(newaddress.AddressLine2)) {
      addressError2 = 'Address in Line 2 cannot be just spaces';
    }
    if (!newaddress.AddressLine3) {
      addressError3 = 'Please enter your Address in Line 3';
      console.log(newaddress.AddressLine3);
    } else if (/^\s*$/.test(newaddress.AddressLine3)) {
      addressError3 = 'Address in Line 3 cannot be just spaces';
    }
    if (!newaddress.FloorNo) {
      floorError = 'Please enter your Floor No';
      console.log(newaddress.FloorNo);
    } else if (/^\s*$/.test(newaddress.FloorNo)) {
      floorError = 'Floor cannot be just spaces';
    }
    if (!newaddress.UnitNo) {
      unitError = 'Please enter your Unit No';
      console.log(newaddress.UnitNo);
    } else if (/^\s*$/.test(newaddress.UnitNo)) {
      unitError = 'Unit cannot be just spaces';
    }

    setSignupErrors({
    
      postal:postalError,
      floor: floorError,
      unit:unitError,
      address1:addressError1,
      address2:addressError2,
      address3:addressError3,
  
    });
    if ( postalError|| floorError ||  unitError || addressError1 || addressError2 || addressError3) {
      return;
    }

    setboxload(true);

    var checkbox = document.getElementById("defaultcheck");
    let temp =
    {
      "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
      "DeliveryId": 0,
      "CustomerId": user.B2CCustomerId,
      "Name": user.B2CCustomerName,
      "AddressLine1": newaddress.AddressLine1,
      "AddressLine2": newaddress.AddressLine2,
      "AddressLine3": newaddress.AddressLine3,
      "FloorNo": newaddress.FloorNo,
      "UnitNo": newaddress.UnitNo,
      "CountryId": "0003",
      "PostalCode": postalcode,
      "Mobile": user.MobileNo,
      "Phone": user.MobileNo,
      "Fax": user.MobileNo,
      "IsDefault": checkbox.checked,
      "IsActive": true,
      "CreatedBy": user.B2CCustomerName,
      "CreatedOn": new Date(),
      "ChangedBy": user.B2CCustomerName,
      "ChangedOn": new Date(),
    }
    if (!postalcode) {
      setboxload(false);
      setErrorPostalCode('Postal Code is required.');
      return;
    }

    if (!newaddress.AddressLine2) {
      setboxload(false);
      setErrorFloorNumber('Floor and Unit number is required.');
      return;
    }

    // Clear any previous errors
    setErrorPostalCode('');
    setErrorFloorNumber('');
    //console.log("savedaddresses",savedaddresses)
    const addresscheck = savedaddresses?.find(item => 
      item.AddressLine1 === newaddress.AddressLine1 && 
      item.AddressLine2 === newaddress.AddressLine2 && 
      item.AddressLine3 === newaddress.AddressLine3 &&
      item.FloorNo === newaddress.FloorNo &&
      item.UnitNo === newaddress.UnitNo 
    );
    if (!addresscheck) {
      fetch(APPEnv.baseUrl + '/B2CCustomerDeliveryAddress/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(temp)
      })
        .then(res => res.json())
        .then(data => {
          if (data.Status === true && data.Code === 200) {
            setboxload(false);
            toast.success('Address Added')
            updateuserdata()
            // after 2 seconds, set the state to false
            setTimeout(() => {
              setShownewaddressform(false)
            }, 2000)

          }
          else {
            setboxload(false);
            toast.error('Error Adding Address')
          }
        })
    } else {
      toast.error('Address Already Exist')
    }
  }


  // const updateuserdata = () => {
  //   let user = localStorage.getItem('token')
  //   user = JSON.parse(user)
  //   // console.log('user customer id',user[0])
  //   fetch(process.env.REACT_APP_BACKEND_URL + '/B2CCustomerRegister/GetbycodeOrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+'&B2CCustomerId=' + user[0].B2CCustomerId, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data)
  //       if (data.Status === true && data.Code === 200) {
  //         localStorage.setItem('token', JSON.stringify(data.Data))
  //         // setShownewaddressform(false)
  //         window.location.reload()
  //       }
  //       else {
  //         toast.error('Error Fetching User Data')
  //       }
  //     })
  // }
  const updateuserdata = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(user)
    // console.log('user customer id',user[0])
    fetch(APPEnv.baseUrl + '/B2CCustomerRegister/Getbycode?OrganizationId=' + process.env.REACT_APP_BACKEND_ORGANIZATION + '&B2CCustomerId=' + user[0].B2CCustomerId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data.Status === true && data.Code === 200) {
          localStorage.setItem('token', JSON.stringify(data.Data));
          window.location.reload();
        } else {
          toast.error('Error Fetching User Data');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch user data');
      });
  
  }



  function toggleCheckbox() {
    var checkbox = document.getElementById("defaultcheck");
    checkbox.checked = !checkbox.checked;

    setnewaddress({
      ...newaddress,
      IsDefault: checkbox.checked
    })

  }


  return (
    <div
      className='add-new-address-out'
    >
      <ToastContainer />
      <div
        className='add-new-address-in'
      >
        <button className='auth-popup__close-btn'
          onClick={() => {
            setShownewaddressform(false)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>


        <form>
          <h1>Add New Address</h1>
          <div className='formcont'>
            {/* <label htmlFor='postalcode'>Postal Code <span className='mandatory'>*</span></label> */}
            <label htmlFor='postalcode'>Postal Code <span className='mandatory'>*</span>{signupErrors.postal && <span className='error-msg'> - {signupErrors.postal}</span>}</label>
            <Grid container direction='row' style={{backgroundColor:'#02B290' }}>
            <Grid item md={6}>
            <input type='text' name='postalcode' id='postalcode'
                value={postalcode}
                onChange={(e) => {
                  setpostalcode(e.target.value)
                  setnewaddress(prev => ({ ...prev, postalcode: e.target.value }));
                }}
              />
            </Grid>
             
                <Grid item md={6}>
                <button 
                className='btn send-otp-button'
  onClick={async (e) => {
                      e.preventDefault();
                      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
                     
                      // Proceed with fetching the address from the API if the postal code doesn't exist
                      const response = await fetch(url);
                      const data = await response.json();

                      if (data.results && data.results.length > 0) {
                        let addressLine3 = data.results[0].BUILDING !== 'NIL' ? `${data.results[0].BUILDING}, SINGAPORE ${postalcode}` : `SINGAPORE ${postalcode}`;
                        setnewaddress(prevAddress => ({
                          ...prevAddress,
                          AddressLine1: `${data.results[0].BLK_NO} ${data.results[0].ROAD_NAME}`,
                          AddressLine3: addressLine3
                        }));
                      } else {
                        console.log('No results found.');
                        // Handle when no results are found
                      }
                    }}
                  >Fetch</button>
                </Grid>
            </Grid>
          </div>
          <div className='formcont'>
            <label htmlFor='addressline1'>Address Line 1 <span className='mandatory'>*</span>{signupErrors.address1 && <span className='error-msg'> - {signupErrors.address1}</span>}

            </label>
            <input type='text' name='addressline1' id='addressline1'
              value={newaddress.AddressLine1}
              onChange={(e) => {
                e.preventDefault()
                setnewaddress({ ...newaddress, AddressLine1: e.target.value })
              }}
            />
          </div>
          <div className='formcont'>
              <label htmlFor='addressline2'>
          Address Line 2  <span className='mandatory'>*</span>{signupErrors.address2 && <span className='error-msg'> - {signupErrors.address2}</span>}
        </label>
                <input type='text' name='addressline2' id='addressline2'
                  value={newaddress.AddressLine2}
                  onChange={(e) => {
                    e.preventDefault()
                    setnewaddress({ ...newaddress, AddressLine2: e.target.value })
                  }}
                />
              </div>
              <div className='formcont'>
              <label htmlFor='addressline3'>
          Address Line 3 <span className='mandatory'>*</span>{signupErrors.address3 && <span className='error-msg'> - {signupErrors.address3}</span>}
        </label>
                <input type='text' name='addressline3' id='addressline3'
                  value={newaddress.AddressLine3}
                  onChange={(e) => {
                    e.preventDefault()
                    setnewaddress({ ...newaddress, AddressLine3: e.target.value })
                  }}
                /> 
              </div>
              <div className='formcont'>
              <label htmlFor='floorno'>
          Floor No <span className='mandatory'>*</span>{signupErrors.floor && <span className='error-msg'> - {signupErrors.floor}</span>}
        </label>
                <input type='text' name='floorno' id='floorno'
                  value={newaddress.FloorNo}
                  onChange={(e) => {
                    e.preventDefault()
                    setnewaddress({ ...newaddress, FloorNo: e.target.value })
                  }}
                />
              </div>
              <div className='formcont'>
              <label htmlFor='unitno'>
          Unit No <span className='mandatory'>*</span>{signupErrors.unit && <span className='error-msg'> - {signupErrors.unit}</span>}
        </label>
                <input type='text' name='unitno' id='unitno'
                  value={newaddress.UnitNo}
                  onChange={(e) => {
                    e.preventDefault()
                    setnewaddress({ ...newaddress, UnitNo: e.target.value })
                  }}
                />
              </div>
        

          <div className='formcont1'>
            <label>Check this to Add this Address for Delivery</label>
            <input type='checkbox' name='default' id='defaultcheck'
              //  check uncheck on single click
            />
          </div>


          <button 
            onClick={(e) => {
              e.preventDefault()

              addnewaddress()
            }}
          > {boxLoad ? <CircularProgress sx={{color:'white'}} /> : "Save Address"}
          </button>
        </form>
        <br />
        <br />
        <br />
        <br />
        <br />

      </div>
    </div>
  )
}

export default AddNewAddress