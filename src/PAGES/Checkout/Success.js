import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../COMPONENTS/Navbar/Navbar';
import './Sucess.css';
import { useRecoilState } from 'recoil';
import { cartQuantity } from '../../Providers/CartQuantity';
import { toast } from 'react-toastify';
import { APPEnv } from '../../COMPONENTS/config';
import { setCartCount, setCartItems } from '../../Store/shoppingCartSlice';
import { useDispatch } from 'react-redux';

const Sucess = () => {
  const dispatch = useDispatch();
  const [ordersuccessorderid, setordersuccessorderid] = useState(null);
  const [cartqty, setcartqty] = useRecoilState(cartQuantity);
  const hasPlacedOrder = useRef(false);

  // ✅ Recover preorderarray if missing
  if (!localStorage.getItem('preorderarray') && sessionStorage.getItem('preorderarray')) {
    localStorage.setItem('preorderarray', sessionStorage.getItem('preorderarray'));
  }

  const preorderarray = JSON.parse(localStorage.getItem('preorderarray')) || [];

  const RemoveCartDetails = () => {
    let user = JSON.parse(localStorage.getItem('token'));
    if (!user || !user[0]?.B2CCustomerId) {
      console.error("User token or CustomerId is missing.");
      return;
    }
  
    const apiUrl = `${APPEnv.baseUrl}/CartDetails/RemoveByCustomerCode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&Customercode=${user[0].B2CCustomerId}`;
  
    fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.Message === 'Sucess' && data.Code === 200) {
          toast.success("Cart Removed Successfully");
          
          // ✅ Clear cart count in Recoil
          setcartqty(0);
          dispatch(setCartCount(0));
           dispatch(setCartItems([])); 
          
          // ✅ Remove cart count from localStorage
          localStorage.removeItem("cartCount");
          localStorage.removeItem("cart")
        } else {
          console.error("API Response Error:", data);
        }
      })
      .catch(err => {
        console.error("Fetch Error:", err);
      });
  };
  

  const placesuccessorder = () => {
    if (hasPlacedOrder.current) {
      console.log("Order already placed, skipping...");
      return;
    }

    hasPlacedOrder.current = true;

    const existingOrderId = localStorage.getItem('orderSuccessId');
    if (existingOrderId) {
      console.log("Existing Order ID found:", existingOrderId);
      setordersuccessorderid(existingOrderId);
      localStorage.removeItem('orderSuccessId');
      return;
    }

    console.log("🔍 Checking preorderarray:", preorderarray);
    if (!preorderarray || preorderarray.length === 0) {
      console.error("❌ No order data found in preorderarray.");
      toast.error("Order data is missing.");
      hasPlacedOrder.current = false;
      return;
    }

    console.log("🚀 Placing order with data:", preorderarray);

    fetch(`${APPEnv.baseUrl}/B2CCustomerOrder/Create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preorderarray),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Order API Response:", data);

        if (data.Message === 'Sucess' && data.Code === 200) {
          const newOrderId = data.Data;
          setordersuccessorderid(newOrderId);
          localStorage.setItem('orderSuccessId', newOrderId);
          localStorage.setItem('cart', JSON.stringify([]));
          RemoveCartDetails();

          setTimeout(() => {
            localStorage.removeItem('orderSuccessId');
            console.log("Order ID removed from local storage");
          }, 2000);
        } else {
          console.error("❌ Order creation failed:", data);
          toast.error("Order placement failed.");
          hasPlacedOrder.current = false;
        }
      })
      .catch(err => {
        console.error("❌ Fetch Error:", err);
        toast.error("Order placement failed.");
        hasPlacedOrder.current = false;
      });
  };

  useEffect(() => {
    console.log("useEffect triggered. hasPlacedOrder:", hasPlacedOrder.current);

    if (!preorderarray || preorderarray.length === 0) {
      console.warn("⚠️ preorderarray is missing in useEffect.");
      return;
    }

    placesuccessorder();
    setcartqty(0);
  }, []);

  useEffect(() => {
    if (ordersuccessorderid) {
        dispatch(setCartCount(0));
    }
}, [ordersuccessorderid]);

  return (
    <div>
      <Navbar />
      <div className="success-container">
        <h1 className="success-heading">Thank You for Your Order!</h1>
        <p className="success-message">Your order has been successfully placed.</p>
        
        {ordersuccessorderid ? (
          <p className="order-number">Your Order Number: {ordersuccessorderid}</p>
        ) : (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Fetching your order details...</p>
          </div>
        )}

        <Link to="/" className="continue-shopping-link">
          <button className="continue-shopping-btn">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
};

export default Sucess;
