import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import './Sucess.css';
import { APPEnv } from '../../COMPONENTS/config';

const Failed = () => {
  const [ordersuccessorderid, setordersuccessorderid] = React.useState(null);
  const preorderarray = JSON.parse(localStorage.getItem('preorderarray'));
  //localStorage.removeItem('preorderarray');
 // const [reloadnavbar, setreloadnavbar] = React.useState(false);
  const [placeorderCalled, setPlaceorderCalled] = React.useState(false);
  //const [reloadKey, setReloadKey] = React.useState(0); // Add a reload key
  const paymentId = localStorage.getItem('paymentId');


  const placesuccessorder = () => {
    fetch(APPEnv.baseUrl + '/B2CCustomerOrder/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preorderarray)
    })
    .then(res => res.json())
    .then(data => {
      if (data.Message === 'Sucess' && data.Code === 200) {
        setordersuccessorderid(data.Data);
        const emptyCart = [];
        // localStorage.setItem('cart', JSON.stringify(emptyCart));
        //setreloadnavbar(!reloadnavbar);
       // setReloadKey(prevKey => prevKey + 1); // Increment the reload key
      }
      else {
        // Handle order placement failure
      }
    })
    .catch(err => {
      // Handle order placement failure
    });
  }

  useEffect(() => {
    if (!placeorderCalled) {
      placesuccessorder();
      setPlaceorderCalled(true); // Set the flag to true after calling placeorder
    }
  }, [placeorderCalled]);

  return (
    <div>
      {/* Pass reloadKey as a prop to Navbar */}
      <Navbar   />
      <div className="success-container">
        <h1 className="success-heading" style={{color:'red'}}>Oops! , Order Failed</h1>
        <p className="success-message">Sorry , Your order is not been placed. </p>
        <div className="order-summary">
          {/* Display Order details here */}
        </div>
        <div className="shipping-info">
          {/* Display shipping details here */}
        </div>
        <div className="payment-info">
          {/* Display payment details here */}
        </div>
        <p className="order-number">Your Order Number: {ordersuccessorderid}</p>
        {/* <p className="order-number">Your Payment Id: {paymentId}</p> */}
        <Link to="/" className="continue-shopping-link">
          <button className="continue-shopping-btn">Continue Shopping</button>
        </Link>
      </div>
    </div>
  )
}

export default Failed;