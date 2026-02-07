import React, { useEffect, useState } from "react";
import "./YourOrders.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderSuccessful from "../OrderSuccessful/OrderSuccessful";
import { Cart2 } from "react-bootstrap-icons";
import { APPEnv } from "../config";
import ReturnList from "./ReturnList";

const YourOrders = ({ userid }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [allOrders, setAllOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders"); // State for tab switch
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    id: "",
    message: "",
    data: {},
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
  });

  const orderStatusMap = {
    0: "Open",
    1: "Order Confirmed",
    2: "Payment Received",
    3: "Picked",
    4: "Packed",
    5: "Rider Assigned",
    6: "Out for Delivery",
    7: "Delivered",
    8: "Return",
    9: "Refund",
  };

    const getStatusClass = (status) => {
    switch (status) {
      case 0: return "status-open";
      case 1: return "status-confirmed";
      case 2: return "status-payment-received";
      case 3: return "status-picked";
      case 4: return "status-packed";
      case 5: return "status-rider-assigned";
      case 6: return "status-out-for-delivery";
      case 7: return "status-delivered";
      case 8: return "status-return";
      case 9: return "status-refund";
      default: return "status-unknown";
    }
  };

  const openModal = () => {
    setModalOpen(true);
    window.history.pushState({ modal: true }, 'Order Details');
  };
  // Function to close the modal and handle history state
  const closeModal = () => {
    setModalOpen(false);
    if (window.history.state?.modal) {
      window.history.back(); // Only go back if modal state exists
    }
  };
  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.modal) {
        setModalOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const getSuccessfulOrder = (orderId) => {
    fetch(`${APPEnv.baseUrl}/B2CCustomerOrder/Getbycode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&OrderNo=${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.Status === true && data.Data?.length > 0) {
          const orderData = data.Data[0];
  
          // Ensure items array is not null
          const items = orderData.OrderDetail ?? [];
  
          let total = 0;
          let tax = 0;
          items.forEach((item) => {
            total += (item?.Price ?? 0) * (item?.Qty ?? 0);
            tax += (item?.Tax ?? 0) * (item?.Qty ?? 0);
          });
  
          const shipping = total >= 80 ? 0 : total >= 50 ? 3 : 5;
  
          setOrderDetails({
            isOpen: true,
            id: orderId,
            message: `Order #${orderId}`,
            data: {
              ...orderData,
              CustomerName: orderData.CustomerName ?? "N/A",
              CustomerEmail: orderData.CustomerEmail ?? "N/A",
              CustomerAddress: orderData.CustomerAddress ?? "N/A",
              MobileNo: orderData.MobileNo ?? "N/A",
              PaymentType: orderData.PaymentType ?? "Unknown",
              OrderStatus: orderData.OrderStatus ?? "Pending",
              Remarks: orderData.Remarks ?? "N/A",
            },
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

  const getOrders = () => {
    setLoading(true);
    fetch(
      `${APPEnv.baseUrl}/B2CCustomerOrder/GetHeaderSearch?searchModel.organisationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&searchModel.customerCode=${userid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAllOrders(data.Data);
      })
      .catch(() => {
        toast.error("Failed to fetch orders");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrders();
  }, [userid]);

  return (
    <div className="yourorders">
      <h1 className="mainhead2">My Orders</h1>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          My Order List
        </button>
        <button
          className={`tab-button ${activeTab === "returns" ? "active" : ""}`}
          onClick={() => setActiveTab("returns")}
        >
          Return List
        </button>
      </div>

      {/* Content Switch */}
      {activeTab === "orders" ? (
        <>
          {loading && <p>Loading orders...</p>}
          <table className="table">
            <thead>
              <tr>
                <th className="text-left">Order ID</th>
                <th className="text-left">Order Date</th>
                <th className="text-left">Order Status</th>
                <th className="text-left">Order Total</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {allOrders &&
                allOrders
                  .filter((item) => item.OrderStatus !== 8) // Exclude returns
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.OrderNo}</td>
                      <td>{item.OrderDateString}</td>
                      <td>
                       <p className={getStatusClass(item.OrderStatus)}>
     {orderStatusMap[item.OrderStatus] ?? "Unknown Status"}
   </p>
   </td>          
   <td>S${item.NetTotal?.toFixed(2)}</td>

                      <td>
                        <button className="mainbutton1"
                         onClick={() => {
                                                getSuccessfulOrder(item.OrderNo);
                                                openModal();
                                              }}>
                          <Cart2 size={22} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {isModalOpen && (
        <OrderSuccessful
          closeModal={() => {
            setOrderDetails({ ...orderDetails, isOpen: false });
            closeModal();
          }}
          orderid={orderDetails.id}
          message={orderDetails.message}
          orderdata={orderDetails.data}
          orderitems={orderDetails.items}
          tax={orderDetails.tax}
          subtotal={orderDetails.subtotal}
          shipping={orderDetails.shipping}
        />
      )}
        </>
      ) : (
        <ReturnList />
      )}
    </div>
  );
};

export default YourOrders;

