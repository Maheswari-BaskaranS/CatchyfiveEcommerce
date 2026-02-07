import React, {useState}from 'react'
import { useRecoilState } from 'recoil'
import { updateAddressProvider } from '../../Providers/UpdateAddressProvider'
import './AddNewAddress.css'
import logo from '../../ASSETS/logo.png'
import { toast, ToastContainer } from 'react-toastify'
import { APPEnv } from '../config'

const UpdateAddress = ({ user, address }) => {
  const [shownewaddressform, setShownewaddressform] = useRecoilState(updateAddressProvider)


  const [newaddress, setnewaddress] = React.useState({
    AddressLine1: address.AddressLine1,
    AddressLine2: address.AddressLine2,
    AddressLine3: address.AddressLine3,
    FloorNo: address.FloorNo,
    UnitNo: address.UnitNo,
    IsDefault: true,
  })
   const [signupErrors, setSignupErrors] = useState({});
  const [postalcode, setpostalcode] = React.useState(address.PostalCode)
  const [errorPostalCode, setErrorPostalCode] = React.useState('');
  const [errorFloorNumber, setErrorFloorNumber] = React.useState('');


  const addnewaddress = () => {
    let floorError = '';
    let postalError = '';
    let unitError = '';
    let addressError1 = '';
    let addressError2 = '';
    let addressError3 = '';
    if (!postalcode) {
      postalError = 'Please enter postalcode';
      console.log(postalcode);
    } else if (/^\s*$/.test(postalcode)) {
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
    var checkbox = document.getElementById("defaultcheck");
   
    let temp =
    {
      "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
      "DeliveryId": address.DeliveryId,
      "CustomerId": user.B2CCustomerId,
      "Name": user.B2CCustomerName,
      "AddressLine1": newaddress.AddressLine1,
      "AddressLine2": newaddress.AddressLine2,
      "AddressLine3": newaddress.AddressLine3,
      "FloorNo": newaddress.FloorNo,
      "UnitNo" : newaddress.UnitNo,
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
      setErrorPostalCode('Postal Code is required.');
      return;
    }

    if (!newaddress.AddressLine2) {
      setErrorFloorNumber('Floor and Unit number is required.');
      return;
    }

    // Clear any previous errors
    setErrorPostalCode('');
    setErrorFloorNumber('');

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
          toast.success('Address Added')
          updateuserdata()
          // after 2 seconds, set the state to false
          setTimeout(() => {
            setShownewaddressform(false)
          }, 2000)

        }
        else {
          toast.error('Error Adding Address')
        }
      })

  }


  const updateuserdata = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(user)
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
          <h1>Update Address</h1>
          <div className='formcont'>
            <label htmlFor='postalcode'>Postal Code <span className='mandatory'>*</span>{signupErrors.postal && <span className='error-msg'> - {signupErrors.postal}</span>}</label>
            <div>
              <input type='text' name='postalcode' id='postalcode'
                value={postalcode}
                onChange={(e) => {
                  setpostalcode(e.target.value)
                }}
              />
              <button 
  onClick={async (e) => {
    e.preventDefault();
    if (!postalcode) {
      setErrorPostalCode('Postal Code is required.');
      return;
    }

    // Clear previous errors
    setErrorPostalCode('');
    let url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    const response = await fetch(url);
    const data = await response.json();


    // Check if data.results has at least one element
    if (data.results && data.results.length > 0) {
      let addressLine3 = data.results[0].BUILDING !== 'NIL' ? `${data.results[0].BUILDING}, SINGAPORE ${postalcode}` : `SINGAPORE ${postalcode}`;
      setnewaddress(prevAddress => ({
        ...prevAddress,
        AddressLine1: `${data.results[0].BLK_NO} ${data.results[0].ROAD_NAME}`,
        AddressLine3: addressLine3
      }));
    } 
    else {
      console.log('No results found.');
      // Handle when no results are found
    }
  }}
>Fetch</button>

              {/* <button className='btn'
                onClick={async (e) => {
                  e.preventDefault()
                  let url = `https://developers.onemap.sg/commonapi/search?searchVal=${postalcode}&returnGeom=N&getAddrDetails=Y&pageNum=1`
                  const response = await fetch(url);
                  const data = await response.json();
                  console.log(data.results[0])

                  setnewaddress({
                    ...newaddress,
                    AddressLine3: data.results[0].ADDRESS,
                  })

                }}

              >Fetch</button> */}
            </div>
          </div>
          <div className='formcont'>
            <label htmlFor='addressline1'>Address Line 1 <span className='mandatory'>*</span>{signupErrors.address1 && <span className='error-msg'> - {signupErrors.address1}</span>}</label>
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
          Address Line 2 <span className='mandatory'>*</span>{signupErrors.address2 && <span className='error-msg'> - {signupErrors.address2}</span>} 
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
            <label htmlFor='addressline3'>Address Line 3
            <span className='mandatory'>*</span>{signupErrors.address3 && <span className='error-msg'> - {signupErrors.address3}</span>}
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
            <label>Set as Default</label>
            <input type='checkbox' name='default' id='defaultcheck'
              //  check uncheck on single click
            />
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault()
              addnewaddress()
            }}
          >Save Address</button>
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

export default UpdateAddress