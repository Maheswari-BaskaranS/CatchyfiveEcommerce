import React from 'react'
import './OrderSuccessful.css'
import { useRecoilState } from 'recoil'
import { orderSuccessfulProvider } from '../../Providers/OrderSuccessfulProvider'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OrderSuccessful = ({ orderid, message, orderdata , orderitems , tax ,subtotal ,shipping, closeModal}) => {

  const [odersuccesscont, setodersuccesscont] = useRecoilState(orderSuccessfulProvider)
  const [user, setuser] = useState({})
  const navigate = useNavigate()

  const checklogin = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(localStorage.getItem('token'))


    if (user && user[0].B2CCustomerId) {
      setuser(user[0])
      return true
    }
    else {
      toast.error('Please Login First')
      return false
    }
  }

  useEffect(() => {
    checklogin()
  }, [orderid])

  const handleReturnClick = () => {
    const returnableItems = orderitems.filter(item => item.IsReturn === null); // Get items where IsReturn is null
  
    navigate('/return-products', { state: { orderdata, orderitems: returnableItems } }); 
  };
  

  const isReturnDisabled = () => {
    if (!orderdata?.OrderDateString) return true;
  
    // Check if all items have IsReturn set to true
    const allReturned = orderitems.every(item => item.IsReturn === true);
    if (allReturned) return true;
  
    const orderDateParts = orderdata.OrderDateString.split("/");
    const orderDate = new Date(`${orderDateParts[2]}-${orderDateParts[1]}-${orderDateParts[0]}`);
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    orderDate.setHours(0, 0, 0, 0);
  
    const timeDiff = currentDate - orderDate;
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
  
    return Math.floor(dayDiff) > 3;
  };
  
  

  const converttofloat = (value) => {
    value = value.toFixed(2)
    // check if value has decimal
    if (!value.includes('.00')) {
        return parseFloat(value)
    }
    else {
        return parseFloat(value) + 0.001
    }
}

  return (
    <div
      className="OrderSuccessful"
    >
   


      <div className='confirmationcont'>
      <button 
  className='auth-popup__close-btn'
  onClick={() => {
    setodersuccesscont(false);
    closeModal();
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>


       <div className='c1'>
    {/* Success Tick */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
    <h2>{message}</h2>
  </div>

        <div className="order-summary">
  <h2>Order Summary</h2>
  <button onClick={handleReturnClick} disabled={isReturnDisabled()}>Return</button>
</div> 

        <div className='c2'>
    
          <div>
            <p>Order Number</p>
            <p>{orderdata.OrderNo}</p>
          </div>

          <div>
            <p>Order Date</p>
            <p>{orderdata.OrderDateString}</p>
          </div>

          <div>
            <p>Name</p>
            <p>{orderdata.CustomerName
            }</p>
          </div>

          <div>
            <p>Email</p>
            <p>
              {
                user.EmailId
              }
            </p>
          </div>

          <div>
            <p>Payment Method</p>
            <p>{orderdata.PaymentType}</p>
          </div>

          <div>
            <p>Shipping Address</p>
            <p>{orderdata.CustomerShipToAddress
            }</p>
          </div>

          <div>
            <p>Net Total</p>
            <p>S$ {orderdata?.NetTotal !== undefined ? orderdata.NetTotal.toFixed(2) : "0.00"}
            </p>
          </div>

          

        </div>
        <div className='c3'>
          <table>
            <thead>
              <tr>
                <th>Sno.</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Applied Return</th> {/* New column */}
              </tr>
            </thead>

            <tbody>

              {

                orderitems && orderitems.map((item, index) => {
                  //console.log(orderitems,"1111111111111111111111")

                  return (
                    <tr key={index}>
                      <td>
                        <p>{index + 1}</p>
                      </td>
                      <td>
                        <p>{item.ProductName}</p>
                      </td>
                      <td>
                        <p>S$ {item.Price ? item.Price.toFixed(2) : 0.00}</p>
                      </td>
                      {/* <td>
                      <p>{item.IsReturn ? item.ReturnQty : item.Qty}</p>
                      </td> */}
                       <td>
                      <p>{item.Qty}</p>
                      </td>
{/* 
                      <td>
           
            <p>S$ {((item.Price) * (item.IsReturn ? item.ReturnQty : item.Qty)).toFixed(2)}</p>
          </td> */}
          
                      <td>
           
            <p>S$ {((item.Price) * (item.Qty)).toFixed(2)}</p>
          </td>
                      <td>
          <p>{item.IsReturn ? "Yes" : "No"}</p>
        </td>
                    </tr>
                   
                  )
                })
              }
            </tbody>
          </table>

          <div className='right' style={{fontFamily:"sans-serif"}}>
            <div>
              <p>Subtotal</p>
              <p>S$ {converttofloat(subtotal).toFixed(2)}</p>
            </div>

            <div>
              <p>Shipping</p>
              <p>S$ {converttofloat(shipping).toFixed(2)}</p>
            </div>

            <div>
              <p>Tax</p>
              <p>S$ {tax.toFixed(2)}</p>
            </div>
            <div>
            <p>Discount</p>
            <p>S$ {(orderdata.RedeemPoints / 10).toFixed(2)}</p>
            </div>

            <div>
              <p>Total</p>
              <p>S$  {orderdata?.NetTotal !== undefined ? orderdata.NetTotal.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessful