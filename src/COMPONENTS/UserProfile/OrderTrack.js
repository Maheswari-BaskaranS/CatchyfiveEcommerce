import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderSuccessful from '../OrderSuccessful/OrderSuccessful';
import img1 from '../../ASSETS/veges.png';
import './OrderTrack.css';
import { APPEnv } from '../config';

const OrderTrack = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    id: '',
    message: '',
    data: {},
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
  });
  const location = useLocation();
  const { orderId } = location.state || {}; // Get the orderId passed from YourOrders

  const getOrderDetails = (orderId) => {
    fetch(`${APPEnv.baseUrl}/B2CCustomerOrder/Getbycode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&OrderNo=${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.Status === true && data.Data) {
          const orderData = data.Data[0];
          const items = orderData.OrderDetail;

          let total = 0;
          let tax = 0;

          items.forEach((item) => {
            total += item.Price * item.Qty;
            tax += item.Tax * item.Qty;
          });

          const shipping = total >= 80 ? 0 : total >= 50 ? 3 : 5;

          setOrderDetails({
            isOpen: true,
            id: orderId,
            message: `Order #${orderId}`,
            data: orderData,
            items,
            subtotal: total,
            tax,
            shipping,
          });
        } else {
          toast.error('Error fetching order details');
        }
      })
      .catch(() => {
        toast.error('Error fetching order details');
      });
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container">
      <h4>Order Tracking</h4>
      <button onClick={openModal} className="btn btn-primary">
        Open Order Details
      </button>

      {isModalOpen && (
        <OrderSuccessful
          closeModal={closeModal}
          orderid={orderDetails.id}
          message={orderDetails.message}
          orderdata={orderDetails.data}
          orderitems={orderDetails.items}
          tax={orderDetails.tax}
          subtotal={orderDetails.subtotal}
          shipping={orderDetails.shipping}
        />
      )}

      <ul className="timeline list-none text-[0.813rem] text-defaulttextcolor">
        <li>
          <div className="timeline-time text-end">
            <span className="date">TODAY</span>
            <span className="time inline-block">12:24</span>
          </div>
          <div className="timeline-icon">
            <a href="#" aria-label="anchor"></a>
          </div>
          <div className="timeline-body">
            <div className="flex items-start timeline-main-content flex-wrap mt-0">
              <div className="avatar avatar-md online me-3 avatar-rounded md:mt-0 mt-6">
                <img alt="avatar" src={img1} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <div className="sm:mt-0 mt-2">
                    <p className="mb-0 text-[.875rem] font-semibold">Zack Slayer</p>
                    <p className="mb-0 text-[#8c9097] dark:text-white/50">
                      Social network accounts are at risk check your{' '}
                      <span className="badge bg-success/10 text-success font-semibold mx-1">login</span> details
                    </p>
                  </div>
                  <div className="ms-auto">
                    <span className="ltr:float-right rtl:float-left badge !bg-light text-[#8c9097] dark:text-white/50 timeline-badge whitespace-nowrap">
                      15,Sep 2021
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OrderTrack;
