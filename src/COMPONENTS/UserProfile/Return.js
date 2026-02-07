import Navbar from '../Navbar/Navbar';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Return.css';
import { toast } from 'react-toastify'
import { APPEnv } from '../config';

const Return = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderdata, orderitems } = location.state; // Get order data and items passed from the previous page
  // console.log("ooooooooooo",orderdata);
  // console.log("99999999999999",orderitems)

  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const perishableCategories = ['Vegetable', 'Fruit'];

  // Function to check refund eligibility
  const checkRefundEligibility = () => {
    if (!orderdata?.OrderDateString) return;

    // Split the order date assuming format is dd/mm/yyyy
    const [day, month, year] = orderdata.OrderDateString.split('/').map(Number);

    // Ensure correct date format (YYYY, MM (0-based), DD)
    const orderDate = new Date(year, month - 1, day); // month is 0-based in JS

    const currentDate = new Date();

    const eligible = orderitems.map((item) => {
        const isPerishable = perishableCategories.includes(item.Category);
        const refundDays = isPerishable ? 1 : 3;

        // Calculate refund end date
        const refundEndDate = new Date(orderDate);
        refundEndDate.setDate(orderDate.getDate() + refundDays);

        return {
            ...item,
            isRefundable: currentDate <= refundEndDate,
            refundEndDate: refundEndDate.toLocaleDateString('en-GB'), // Formats as dd/mm/yyyy
        };
    });

    setEligibleProducts(eligible);
};

// const pay = localStorage.getItem('paymentmethod') 

  // Handle checkbox selection
  const handleCheckboxChange = (item) => {
    setSelectedProducts((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      }
      return [...prev, item];
    });
  };

  useEffect(() => {
    checkRefundEligibility(); // Run this when the page loads
  }, [orderdata, orderitems]);
console.log("eligibleProducts",eligibleProducts)
  const returnorder = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
const returnDetails = selectedProducts.map((item) => ({
  OrgId: item?.OrgId,
  BranchCode: orderdata?.BrachCode,
  TranNo: "",
  SLNo: item?.SlNo,
  ProductCode: item?.ProductCode,
  ProductName: item?.ProductName,
  Qty: item?.Qty,
  IsPerishable: item?.IsPerishable,
  Price: item?.Price,
  Total: item?.Total,
  Subtotal: item?.SubTotal,
  Tax: item?.Tax,
  NetTotal: item?.NetTotal,
  CreateDate: item?.CreatedOn,
  CreateUser: item?.CreatedBy,
  Modifydate: item?.ChangedOn,
  ModifyUser: item?.ChangedBy,
  id: 0
}));

// 🔢 Sum up Subtotal, Tax, and NetTotal from ReturnDetail
const totalSubTotal = returnDetails.reduce((sum, item) => sum + (Number(item.Subtotal) || 0), 0);
const totalTax = returnDetails.reduce((sum, item) => sum + (Number(item.Tax) || 0), 0);
const totalNetTotal = returnDetails.reduce((sum, item) => sum + (Number(item.NetTotal) || 0), 0);

const temp = {
  OrgId: Number(process.env.REACT_APP_BACKEND_ORGANIZATION),
  BranchCode: orderdata?.BrachCode,
  TranDateString: "",
  TranNo: "",
  TranDate: "",
  OrderNo: orderdata?.OrderNo,
  CustomerCode: orderdata?.CustomerId,
  CustomerName: orderdata?.CustomerName,
  SubTotal: totalSubTotal,
  NetTotal: totalNetTotal,
  Tax: totalTax,
  ReturnStatus: 0,
  OrderStatus: 8,
  CreatedBy: orderdata?.CustomerName || "Default User",
  CreatedOn: formattedDate,
  Modifydate: orderdata?.CustomerName || "Default User",
  ModifyUser: formattedDate,
  id: 0,
  ReturnDetail: returnDetails
};

      fetch(APPEnv.baseUrl + '/B2CReturn/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(temp)
    })
      .then(res => res.json())
      .then(data => {
        if (data.Message == 'Sucess' && data.Code == 200) {
          toast.success('Order Returned Successfully')
          navigate('/user/yourorders', { state: { selectedProducts } });
        }
        else {
          toast.error('Order Not Yet Returned')
        }
      })
      .catch(err => {
        toast.error('Order Not Returned')
      })

  }

  return (
    <div>
      <Navbar />
      <div className="Return-container">
        <h2 className="header">Return Eligibility</h2>

        <table className="return-table">
  <thead style={{backgroundColor:"#dddbdb"}}>
    <tr >
      <th></th>
      <th>Product</th>
      <th>Order Date</th>
      <th>Quantity</th>
      <th>Refund Until</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {eligibleProducts.map((item, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(item)}
          />
        </td>
        <td>{item.ProductName}</td>
        <td>{orderdata.OrderDateString}</td>
        <td>
          <input
            type="number"
            min="1"
            style={{width:"100px"}}
            max={orderitems.find(prod => prod.ProductCode === item.ProductCode)?.Qty || item.Qty} 
            value={item.Qty}
            onChange={(e) => {
              const orderedQty = orderitems.find(prod => prod.ProductCode === item.ProductCode)?.Qty || item.Qty;
              const qty = Math.min(Math.max(1, Number(e.target.value)), orderedQty);
              const updatedTotal = qty * item.Price;
              // Update eligibleProducts
              setEligibleProducts((prev) =>
                prev.map((prod) =>
                  prod.ProductCode === item.ProductCode ? { ...prod, Qty: qty, Total: updatedTotal  } : prod
                )
              );

              // Update selectedProducts if the product is already selected
              setSelectedProducts((prev) =>
                prev.map((prod) =>
                  prod.ProductCode === item.ProductCode ? { ...prod, Qty: qty, Total: updatedTotal } : prod
                )
              );
            }}
          />
        </td>
        <td>{item.refundEndDate}</td>
        <td>S${item.Price?.toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>

        <div className="button">
  <button onClick={() => navigate('/user/yourorders')}>Cancel</button>
  <button
    onClick={() => returnorder()}
    disabled={selectedProducts.length === 0}
    title={selectedProducts.length === 0 ? "Please select products to proceed" : ""}
  >
    Proceed with Return
  </button>
</div>

      </div>
    </div>
  );
};

export default Return;
