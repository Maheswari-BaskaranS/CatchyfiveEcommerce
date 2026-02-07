import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'
import AddNewAddress from '../../COMPONENTS/Address/AddNewAddress'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import { newAddressProvider } from '../../Providers/NewAddressProvider'
import './Checkout.css'
import OrderSuccessful from '../../COMPONENTS/OrderSuccessful/OrderSuccessful'
import { orderSuccessfulProvider } from '../../Providers/OrderSuccessfulProvider'
import CardFormPopup from '../../COMPONENTS/Payment/CardFormPopup'
import { cardDetailsPopupState } from '../../Providers/CardDetailsPopupProvider'
import noimage from '../../ASSETS/noimage.png'
import { cartPopupState } from '../../Providers/CartPopupProvider'
import { loadStripe } from '@stripe/stripe-js';
import CircularProgress from '@mui/material/CircularProgress';
import { APPEnv } from '../../COMPONENTS/config'
// import { useNavigate } from 'react-router-dom'

const Checkout = () => {

  // ////////////////// right container //////////////////////////////////////////


  const stripePromise = loadStripe('pk_test_51N00U8FFReMpJzWzSL2lAHaCnQneRLTpZFtzIhnDdAyqNci4iSEJXrKCehecCCTrfWwBdgneBPXKh5KYSNtdgMUJ00k1doHzNY'); 

  const [redeem, setRedeem] = useState(0); 
  const [cartdata, setcartdata] = React.useState([])
  const [subtotal, setsubtotal] = React.useState(0)
  const [shippingcost, setshippingcost] = React.useState(0)
  const [tax, settax] = React.useState(0)
  const [redeemAmount, setRedeemAmount] = useState('');
  const [discountedAmt, setDiscountedAmt] = useState(0);
  const [boxLoad , setboxload ] = React.useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [redeemed, setRedeemed] = useState(false);

  const [netTotal, setNetTotal] = useState(0); // Initial net total
const [users, setusers] = useState([])
const [redUser, setRedUser] = useState([])
const [redeemValue,setRedeemValue]=useState([])
// console.log("users",users)

useEffect(() => {
  setNetTotal(subtotal + shippingcost); // Recalculate when subtotal or shipping cost changes
  setRedUser(users[0]?.LoyaltyPoints != null ? users[0]?.LoyaltyPoints : 0);
}, [subtotal, shippingcost, users]);

// console.log("netTotal",netTotal)
// console.log("subtotal",subtotal)
// console.log("discounted amt",discountedAmt);

// console.log("shippingcost",shippingcost)

  const navigate = useNavigate();
  const getcartdata = async () => {
    let cart = JSON.parse(localStorage.getItem('cart'))
    if (cart !== null) {
      setcartdata(cart)
      let total = 0
      cart.forEach(item => {
        total += item.data.SellingCost * item.quantity
      })
      setsubtotal(total)

      if (total >= 80) {
        setshippingcost(0); 
      } else if (total >= 50 && total <= 79) {
        setshippingcost(3); 
      } else if (total < 50) {
        setshippingcost(5);
      }
    }
    else {
      setcartdata([])
    }
  }

  const fetchUserData = async () => {
    let user = localStorage.getItem('token');
    let value = JSON.parse(user);
  
    if (value) {
      try {
        const response = await fetch(
          APPEnv.baseUrl + 
          '/B2CCustomerRegister/Getbycode?OrganizationId=' + 
          process.env.REACT_APP_BACKEND_ORGANIZATION + 
          '&B2CCustomerId=' + value[0].B2CCustomerId,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        const data = await response.json();
        setusers(data.Data);
        localStorage.setItem('token', JSON.stringify(data.Data));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      // toast.error('Please Login First')
    }
  };

  const handleRedeem = (redeemedAmount) => {
    let points = parseInt(redeemedAmount, 10);
  
    // console.log("Redeemed Amount:", points);
    // console.log("Net Total Before Redemption:", netTotal);
  
    if (isNaN(points) || points < 10) {
      toast.error("You must redeem at least 10 points.");
      return;
    }
  
    if (points > (users?.[0]?.LoyaltyPoints || 0)) {
      toast.error("You cannot redeem more points than available.");
      return;
    }
  
    if (points > netTotal * 10) { // Since 10 points = $1
      toast.error("You cannot redeem more than the total Points.");
      return;
    }
  
    const rem = redUser - points;
    const discountAmount = points / 10; // Convert points to dollars
    const newTotal = netTotal - discountAmount;
  
    toast.success(`You redeemed ${points} points. Discount: $${discountAmount}. New total: $${Math.floor(newTotal)}.`);
  setRedeemValue(points);
    setNetTotal(newTotal);
    setDiscountedAmt(discountAmount)
    setRedeemAmount("");
    setRedUser(rem);
    setRedeemed(true);
  };
  

  React.useEffect(() => {
    getcartdata()
  }, [])
  // //////////////////////////////////////////////////////////////////////////////////////
  const [activesection, setactivesection] = React.useState(1);
  const [selectedaddress, setselectedaddress] = React.useState({});
  
  const validateAddress = () => {
    if (Object.keys(selectedaddress).length > 0) { 
      setactivesection(2);
    } else {
      toast.error('Please select an address', {
        position: "bottom-right",
        autoClose: 1000,
      });
    }
  }
  
  const [deliverydate, setdeliverydate] = React.useState(new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  const [user, setuser] = React.useState({})
  const checklogin = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(localStorage.getItem('token'))


    if (user && user[0].B2CCustomerId) {
      setuser(user[0])
      getaddress(user[0])
      return true
    }
    else {
      toast.error('Please Login First')
      return false
    }
  }

  const [savedaddresses, setsavedaddresses] = React.useState([]);

const getaddress = (userdata) => {
  // console.log("userdata", userdata);

  // Extract the default address from userdata.Address array
  const defaultAddress = userdata.Address?.find(item => item.IsDefault) || {};

  let mainaddress = {
    AddressLine1: defaultAddress.AddressLine1 || "",
    AddressLine2: defaultAddress.AddressLine2 || "",
    AddressLine3: defaultAddress.AddressLine3 || "",
    FloorNo: defaultAddress.FloorNo || "",
    UnitNo: defaultAddress.UnitNo || "",
    DeliveryId: defaultAddress.DeliveryId || "",
    EmailId: userdata.EmailId || "",
  };

  setsavedaddresses([mainaddress]); // Only store the default address
};


  React.useEffect(() => {
    checklogin()
  }, [])





  // /////////////////////////////// add address ////////////////////////////////////////// 
  const [shownewaddressform, setShownewaddressform] = useRecoilState(newAddressProvider)
  // const navigate = useNavigate();
  // remove address
  const removeaddress = (DeliveryId) => {
    console.log("removeaddress called with:", DeliveryId);
    if (!DeliveryId) {
      console.error("Error: DeliveryId is undefined!");
      return;
    }
  
    let temp = APPEnv.baseUrl + `/B2CCustomerDeliveryAddress/Remove?OrganizationId=`+ process.env.REACT_APP_BACKEND_ORGANIZATION+`&CustomerId=${user.B2CCustomerId}&DeliveryId=${DeliveryId}&UserName=${user.EmailId}`
    console.log("API URL:", temp);

    fetch(temp, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log("API Response:", data);
        if (data.Message == 'Sucess') {
          toast.success('Address Removed')
          getaddress(user)
        }
        else {
          toast.error('Failed to remove address');
        }
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        toast.error('Something went wrong');
      });
  }
  // //////////////////////////////////////////////////////////////////////////////////////
  const [paymentmethod, setpaymentmethod] = React.useState('STRIPE')
  const [TaxValue, setTaxValue] = useState();


  useEffect(() => {
    const fetchTax = async () => {
  
    try {
      const response = await fetch(APPEnv.baseUrl + '/Tax/Getbycode?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&TaxCode=3', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      // console.log("data", data.Data[0]);
      setTaxValue(data.Data[0]);
  
    } catch (error) {
      console.error('Error getting Values:', error);
      toast.error("Error getting");
    }
  };
    fetchTax();
  },[])


  const [ordersuccessorderid, setordersuccessorderid] = React.useState(null)

  const placeorder = () => {
    if (isOrdering) return; // Prevent duplicate execution
    setIsOrdering(true);

    setboxload(true);
    if (selectedaddress.AddressLine1 == '' && selectedaddress.AddressLine2 == '' && selectedaddress.AddressLine3 == '' && selectedaddress.FloorNo == '', selectedaddress. UnitNo == '') {
      toast.error('Please Select Address')
      setboxload(false);
      return
    }
    else if (paymentmethod == '') {
      toast.error('Please Select Payment Method')
      setboxload(false);
      return
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
// console.log("user",user)

const temp = {
  OrgId: Number(process.env.REACT_APP_BACKEND_ORGANIZATION),
  BrachCode: "HO",
  OrderNo: "", // Default empty Order Number
  ReceiptNo: "", // Default empty Receipt Number
  MobileNo: user?.MobileNo || "0000000000", // Fallback to a placeholder
  EmailId: user?.EmailId || "",
  OrderDate: formattedDate,
  CustomerId: user?.B2CCustomerId || "0000",
  CustomerName: user?.B2CCustomerName || "Default Name",
  CustomerAddress: [
    selectedaddress?.AddressLine1,
    selectedaddress?.AddressLine2,
    selectedaddress?.AddressLine3,
    selectedaddress?.FloorNo,
    selectedaddress?.UnitNo,
  ]
    .filter(Boolean)
    .join(" "),
  LoyaltyPoints: Math.round((subtotal + shippingcost) / 10) || 0,

  RedeemPoints: redeemValue ? parseInt(redeemValue, 10) : 0,
  LoyaltyPoint: Math.round((subtotal + shippingcost) / 10) || 0,

  RedeemPoint: redeemValue ? parseInt(redeemValue, 10) : 0,
  OrderStatus: paymentmethod === "STRIPE" ? 2 : 1, // Make status dynamic
  PostalCode: selectedaddress?.AddressLine3?.match(/\d+/)?.[0] || "000000",
  TaxCode: TaxValue?.TaxCode || "3",
  TaxType: TaxValue?.TaxType || "",
  TaxPerc: TaxValue?.TaxPercentage || 0,
  CurrencyCode: "SGD",
  CurrencyRate: 1,
  Total: subtotal || 0,
  BillDiscount: 0,
  BalanceAmount: 0,
  BillDiscountPerc: 0,
  SubTotal: subtotal || 0,
  Tax: TaxValue?.Tax || 0,
  NetTotal: netTotal || 0,
  PaymentType: paymentmethod || "CASH",
  PaidAmount: netTotal || 0,
  Remarks: "",
  IsActive: true,
  CreatedBy: user?.B2CCustomerName || "Default User",
  CreatedOn: formattedDate,
  ChangedBy: user?.B2CCustomerName || "Default User",
  ChangedOn: formattedDate,
  Status: 1,
  CustomerShipToId: user?.B2CCustomerId || "0000",
  CustomerShipToAddress: [
    selectedaddress?.AddressLine1,
    selectedaddress?.AddressLine2,
    selectedaddress?.AddressLine3,
    selectedaddress?.FloorNo,
    selectedaddress?.UnitNo,
  ]
    .filter(Boolean)
    .join(" "),
  Latitude: selectedaddress?.Latitude || 1.3521, // Default to Singapore latitude
  Longitude: selectedaddress?.Longitude || 103.8198, // Default to Singapore longitude
  Signatureimage: "",
  Cameraimage: "",
  OrderDateString: formattedDate,
  CreatedFrom: user?.B2CCustomerName,
  CustomerEmail: user?.EmailId || "default@example.com",
  OrderDetail: cartdata.map((item, index) => ({
    OrgId: Number(process.env.REACT_APP_BACKEND_ORGANIZATION),
    OrderNo: "",
    SlNo: index + 1,
    ProductCode: item.data?.ProductCode || "P0000",
    ProductName: item.data?.ProductName || "Unknown Product",
    Qty: item?.quantity || 1,
    Price: item.data?.SellingCost || 0,
    Foc: 0,
    Total: (item.data?.SellingCost || 0) * (item?.quantity || 1),
    ItemDiscount: 0,
    ItemDiscountPerc: 0,
    SubTotal: (item.data?.SellingCost || 0) * (item?.quantity || 1),
    Tax: ((item.data?.TaxPerc || 0) / 100) * ((item.data?.SellingCost || 0) * (item?.quantity || 1)),
    NetTotal: ((item.data?.TaxPerc || 0) / 100) * ((item.data?.SellingCost || 0) * (item?.quantity || 1)) +
      ((item.data?.SellingCost || 0) * (item?.quantity || 1)),
    TaxCode: item.data?.TaxCode || "TAX001",
    TaxType: item.data?.TaxType || "GST",
    TaxPerc: item.data?.TaxPerc || 0,
    Remarks: item.data?.ProductName || "",
    CreatedBy: user?.B2CCustomerName || "Default User",
    CreatedOn: formattedDate,
    ChangedBy: user?.B2CCustomerName || "Default User",
    ChangedOn: formattedDate,
    Weight: item.data?.Weight || 0,
  IsPerishable: true,
  })),
  DeliveryAmount: shippingcost || 0,
  DeliveryDate: deliverydate,
  OrderDeliveryDate: deliverydate,
  PaymodeCode: "",
  PaymodeName: paymentmethod,
  InvoiceNo: "",
  ReferenceNo: "",
};




    fetch(APPEnv.baseUrl + '/B2CCustomerOrder/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(temp)
    })
      .then(res => res.json())
      .then(data => {
        if (data.Message == 'Sucess' && data.Code == 200) {
          setIsOrdering(false);
          setboxload(false);
          toast.success('Order Placed Successfully')
          setordersuccessorderid(data.Data)
          setordersuccessmessage('Order Placed Successfully')
      localStorage.setItem('orderSuccessId', data.Data);
          getsuccessfulorder(data.Data)
         // setodersuccesscont(true)
         navigate('/success')
          localStorage.removeItem('cart');
        }
        else {
          toast.error('Order Not Yet Placed')
          setIsOrdering(false);
          setboxload(false);
        }
      })
      .catch(err => {
        toast.error('Order Not Placed')
        setboxload(false);
      })
  }

  const savepreorderobjtoLS = async () => {
    if (selectedaddress.AddressLine1 == '' && selectedaddress.AddressLine2 == '' && selectedaddress.AddressLine3 == '' && selectedaddress.FloorNo == '' && selectedaddress.UnitNo == '') {
      toast.error('Please Select Address')
      return false
    }
    else if (paymentmethod == '') {
      toast.error('Please Select Payment Method')
      return false
    }
    else {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const temp = {
        OrgId: Number(process.env.REACT_APP_BACKEND_ORGANIZATION),
        BrachCode: "HO",
        OrderNo: "",
        ReceiptNo: "",
        MobileNo: user?.MobileNo || "N/A",
        EmailId: user?.EmailId || "N/A",
        OrderDate: formattedDate,
        CustomerId: user?.B2CCustomerId || "0000",
        CustomerName: user?.B2CCustomerName || "Unknown",
        CustomerAddress: [
          selectedaddress?.AddressLine1,
          selectedaddress?.AddressLine2,
          selectedaddress?.AddressLine3,
          selectedaddress?.FloorNo,
          selectedaddress?.UnitNo,
        ]
          .filter(Boolean)
          .join(" "),
        LoyaltyPoints: Math.round((subtotal + shippingcost) / 10) || 0,
        RedeemPoints: redeemValue ? parseInt(redeemValue, 10) : 0,
        LoyaltyPoint: Math.round((subtotal + shippingcost) / 10) || 0,
        RedeemPoint: redeemValue ? parseInt(redeemValue, 10) : 0,
        OrderStatus: paymentmethod === "STRIPE" ? 2 : 1,
        PostalCode: selectedaddress?.AddressLine3?.match(/\d+/)?.[0] || "000000",
        TaxCode: TaxValue?.TaxCode || "N/A",
        TaxType: TaxValue?.TaxType || "N/A",
        TaxPerc: TaxValue?.TaxPercentage || 0,
        CurrencyCode: "SGD",
        CurrencyRate: 1,
        Total: subtotal || 0,
        BillDiscount: 0,
        BalanceAmount: 0,
        BillDiscountPerc: 0,
        SubTotal: subtotal || 0,
        Tax: TaxValue?.Tax || 0,
        NetTotal: netTotal || 0,
        PaymentType: paymentmethod || "Unknown",
        PaidAmount: netTotal || 0,
        Remarks: "",
        IsActive: true,
        CreatedBy: user?.B2CCustomerName || "System",
        CreatedOn: formattedDate,
        ChangedBy: user?.B2CCustomerName || "System",
        ChangedOn: formattedDate,
        Status: 1,
        CustomerShipToId: user?.B2CCustomerId || "0000",
        CustomerShipToAddress: [
          selectedaddress?.AddressLine1,
          selectedaddress?.AddressLine2,
          selectedaddress?.AddressLine3,
          selectedaddress?.FloorNo,
          selectedaddress?.UnitNo,
        ]
          .filter(Boolean)
          .join(" "),
        Latitude: selectedaddress?.Latitude || 0,
        Longitude: selectedaddress?.Longitude || 0,
        Signatureimage: "",
        Cameraimage: "",
        OrderDateString: formattedDate,
        CreatedFrom: user?.B2CCustomerName,
        CustomerEmail: user?.EmailId || "N/A",
        OrderDetail: cartdata.map((item, index) => {
          const quantity = item?.quantity || 1;
          const price = item?.data?.SellingCost || 0;
          const taxPerc = item?.data?.TaxPerc || 0;
          const taxAmount = (taxPerc / 100) * (price * quantity);
          const netTotal = taxAmount + price * quantity;
      
          return {
            OrgId: Number(process.env.REACT_APP_BACKEND_ORGANIZATION),
            OrderNo: "",
            SlNo: index + 1,
            ProductCode: item?.data?.ProductCode || "0000",
            ProductName: item?.data?.ProductName || "Unknown",
            Qty: quantity,
            Price: price,
            Foc: 0,
            Total: price * quantity,
            ItemDiscount: 0,
            ItemDiscountPerc: 0,
            SubTotal: price * quantity,
            Tax: taxAmount,
            NetTotal: netTotal,
            TaxCode: item?.data?.TaxCode || "N/A",
            TaxType: item?.data?.TaxType || "N/A",
            TaxPerc: taxPerc,
            Remarks: "",
            CreatedBy: user?.B2CCustomerName || "System",
            CreatedOn: formattedDate,
            ChangedBy: user?.B2CCustomerName || "System",
            ChangedOn: formattedDate,
            Weight: item?.data?.Weight || 0,
           
            IsPerishable: true,
          };
        }),
        DeliveryAmount: shippingcost || 0,
        DeliveryDate: deliverydate,
        OrderDeliveryDate: deliverydate,
        PaymodeCode: "N/A",
        PaymodeName: paymentmethod || "Unknown",
        InvoiceNo: "",
        ReferenceNo: "",
        ShippingCost: shippingcost || 0,
        DiscountCost: discountedAmt || 0,
      };

      await localStorage.setItem('preorderarray', JSON.stringify(temp))
     
    }
  }

  const makePayment = async (preorderData) => {
    setboxload(true);
    const data = [{
      products: preorderData
    }];
  
    try {
      const response = await fetch('https://catchyfivepayment.appxes-erp.in/create-checkout-session', {
      // const response = await fetch('http://localhost:3001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const session = await response.json();
  
      localStorage.setItem('paymentId', session.id);
  
      const stripe = await stripePromise; // Await the promise here
  
      if (session.sessionId) {
        stripe.redirectToCheckout({ sessionId: session.sessionId });
      } else {
        setboxload(false);
        toast.error('Some error occurred, please try again later');
      }
  
    } catch (error) {
      setboxload(false);
      console.error('Error creating Stripe session:', error);
      toast.error("Error creating");
    }
  };
  
  



  // payment integration
  const makePayme = async(preorderData)=>{
    const stripe = await loadStripe("pk_test_51N00U8FFReMpJzWzSL2lAHaCnQneRLTpZFtzIhnDdAyqNci4iSEJXrKCehecCCTrfWwBdgneBPXKh5KYSNtdgMUJ00k1doHzNY");

    const body = {
        products:preorderData
    }
    const headers = {
        "Content-Type":"application/json"
    }
    const response = await fetch("https://paymentserver-vpjj.onrender.com/api/create-checkout-session",{
        method:"POST",
        headers:headers,
        body:JSON.stringify(body)
    });

    const session = await response.json();

    localStorage.setItem('paymentId', session.id);

    const result = stripe.redirectToCheckout({
        sessionId:session.id
    });

    if(result.error){
        console.log(result.error);
    }
}



  // order successcontainer
  const [odersuccesscont, setodersuccesscont] = useRecoilState(orderSuccessfulProvider)
  const [ordersuccessmessage, setordersuccessmessage] = React.useState('Order Placed Successfully')
  const [ordersuccessdata, setordersuccessdata] = React.useState({})
  const [ordersuccessdataitems, setordersuccessdataitems] = React.useState([])

  const getsuccessfulorder = (ordrid) => {
    fetch(APPEnv.baseUrl + '/B2CCustomerOrder/Getbycode?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&OrderNo=' + ordrid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.Status === true && data.Data) {
          setordersuccessdata(data.Data[0])
          setordersuccessdataitems(data.Data[0].OrderDetail)


          let total = 0
          let tax = 0
          data.Data[0].OrderDetail.forEach(item => {
            total += item.Price * item.Qty
            tax += item.Tax * item.Qty
          })
          setsubtotal(total)
          settax(tax)
          
        }
        else {
          toast.error('Error in getting order details')
        }
      })
      .catch((error) => {
        toast.error('Error in getting order details')
      })
  }

  useEffect(()=>{
    fetchUserData()
    // console.log("-------------",fetchUserData())
  },[])

  const [cardDetailsPopup, setcardDetailsPopup] = useRecoilState(cardDetailsPopupState)
  const [cartPopupShow, setCartPopupShow] = useRecoilState(cartPopupState);

  const isOrderDisabled = 
  !paymentmethod || 
  !selectedaddress?.AddressLine1 || 
  !selectedaddress?.FloorNo || 
  !selectedaddress?.UnitNo || 
  !selectedaddress?.AddressLine3 || 
  !deliverydate;

  
useEffect(() => {
  localStorage.setItem('paymentmethod', paymentmethod);
}, [paymentmethod]);

  
  return (
    <div className='checkoutpage'>

      {
        odersuccesscont && <OrderSuccessful netTotal={netTotal} orderid={ordersuccessorderid} message={ordersuccessmessage} redirectto={'home'}
          orderdata={ordersuccessdata} orderitems={ordersuccessdataitems} tax={tax} subtotal={subtotal} shipping={shippingcost}

        />
      }
      <Navbar />
      
      {
        shownewaddressform && <AddNewAddress user={user} getaddress={getaddress} />
      }
      <div className='checkoutpage__container'>
        <div className='checkoutpage__container__left'>
          {
            activesection === 1 ?
              <div className='s1'>
                <div className='s1__head'>
                  <span>1</span>
                  <h3>Delivery Address</h3>
                  <p style={{color:"red"}}>*</p>
                </div>
                <div className='s1__body'>
               
                  {
                    savedaddresses.length > 0 &&
                    savedaddresses.map((item, index) => {
                     // console.log("Saved Addresses:", savedaddresses);

                      return (
                        <div className={
                          selectedaddress.AddressLine1 == item.AddressLine1 &&
                            selectedaddress.AddressLine2 == item.AddressLine2 &&
                            selectedaddress.AddressLine3 == item.AddressLine3 &&
                            selectedaddress.FloorNo == item.FloorNo &&
                            selectedaddress.DeliveryId == item.DeliveryId &&
                            selectedaddress.UnitNo == item.UnitNo &&
                            selectedaddress.EmailId == item.EmailId ? 'addresscontainer active' : 'addresscontainer'
                        } key={index}
                          onClick={() => {
                            //console.log("Selected Address:", item);
                            setselectedaddress(item)
                          }
                          }
                        >
                          <p>
                            {
                              item.AddressLine1 && <span>{item.AddressLine1}, </span>
                            }
                            {
                              item.AddressLine2 && <span>{item.AddressLine2}, </span>
                            }
                            {
                              item.AddressLine3 && <span>{item.AddressLine3}, </span>
                            }
                            {
                              item.FloorNo && <span>{item.FloorNo} Floor, </span>
                            }
                            {
                              item.UnitNo && <span>{item.UnitNo} Unit</span>
                            }
                          </p>
                        {/*   <button className='delbtn'
                            onClick={() => {
                              console.log("Deleting Address with DeliveryId:", item.DeliveryId);
                              removeaddress(item.DeliveryId)}
                            }
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button> */}
                        </div>
                      )
                    })
                  }
                  <div className='addresscontainer'
                    onClick={() => {
                      // if(user != null || user != {} || user != undefined){
                      //   setShownewaddressform(true)
                      // } 
                      // else{
                      //   toast.error('Please Login First')
                      // }
                      if (user.B2CCustomerId == null) {
                        toast.error('Please Login First')
                      }
                      else {
                        setShownewaddressform(true)
                      }
                    }}
                  >
                    <h2><span>+</span> Add Address</h2>
                  </div>
                </div>
                <div className='s1__footer'
                  onClick={() =>validateAddress()}
                >
                  <button>Next Step</button>
                </div>
              </div>
              :
              <div className='s11'
                onClick={() => setactivesection(1)}
              >
                <div className='s1__head'>
                  <span>1</span>
                  <h3>Delivery Address</h3>
                  <p style={{color:"red"}}>*</p>
                </div>

              </div>
          }
          {
            activesection === 2 ?
              <div className='s1'

              >
                <div className='s1__head'>
                  <span>2</span>
                  <h3>Select Delivery Date</h3>
                  <p style={{color:"red"}}>*</p>
                </div>
                <div className='s1__body'>
                  <input type='date' className='date_cont'
                    min={new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

                    value={deliverydate}
                    onChange={(e) => {
                      setdeliverydate(e.target.value)
                    }}
                  />

                </div>
                <div className='s1__footer'
                  onClick={() => setactivesection(3)}
                >
                  <button>Next Step</button>
                </div>
              </div>
              :
              <div className='s11'
                onClick={() => setactivesection(2)}
              >
                <div className='s1__head'>
                  <span>2</span>
                  <h3>Select Delivery Date</h3>
                  <p style={{color:"red"}}>*</p>
                </div>
              </div>
          }
          {
            activesection === 3 ?
              <div className='s1'>
                <div className='s1__head'>
                  <span>3</span>
                  <h3>Payment Option</h3>
                  <p style={{color:"red"}}>*</p>
                </div>
                <div className='s12__body'>
                  {/* <div className='addresscontainer disabled' */}
                  <div className={paymentmethod == 'STRIPE' ? 'addresscontainer active' : 'addresscontainer'}
                    onClick={() => {
                      // toast.error('This Payment method is Not Available')
                      setpaymentmethod('STRIPE')
                    }}
                  >
                    <h3>Pay via Stripe</h3>
                    <img src='https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg' />
                  </div>
                  <div className={paymentmethod == 'COD' ? 'addresscontainer active' : 'addresscontainer'}
                    onClick={() => setpaymentmethod('COD')}
                  >
                    <h3>Cash On Delivery</h3>
                    
                     <img src='data:image/png;base64,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' alt='paypal' />
                  </div> 
                </div>
                {/* <div className='s1__footer'>
                  <button
                    onClick={() => setactivesection}
                  >Next Step</button>
                </div> */}
              </div>
              :
              <div className='s11'
                onClick={() => setactivesection(3)}
              >
                <div className='s1__head'>
                  <span>3</span>
                  <h3>Payment Option</h3>
                  <p style={{color:"red"}}>*</p>
                </div>
              </div>
          }
        </div>

        <div className='checkoutpage__container__right'>
          <table>
            <thead>
              <tr>
                <th>Qty</th>
                <th>Product</th>
                <th className='price'>Amount</th>
              </tr>
            </thead>

            <tbody>
              {
                cartdata.map((item, index) => {
                  return (
                    <tr key={index}
                    style={{cursor:'pointer'}
                    }
                      onClick={() => {
                        setCartPopupShow(true)
                      }}
                    >
                      <td className='quantity'>
                        <span>
                          {item.quantity}
                        </span>
                      </td>
                      <td>
                        <div className='imgandname'>
                          {
                            item.data.ProductImagePath == null || item.data.ProductImagePath == '' 

                              ? <img src={noimage} alt='noimage' />
                              :
                              <img src={item.data.ProductImagePath} alt='noimg' loading='eager' />
                          }
                          <p>{item.data.ProductName}</p>
                        </div>
                      </td>

                      <td className='price'>
                        S${(item.data.SellingCost * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>

          <div className='subtotal'>
            <h1>Sub Total</h1>
            <h2>S${subtotal.toFixed(2)}</h2>
          </div>
          <div className='subtotal'>
            <h1>Shipping</h1>
            <h2>S${shippingcost.toFixed(2)}</h2>
          </div>
          <div className='subtotal'>
            <h1>Net Total</h1>
            <h2> S${(subtotal+shippingcost).toFixed(2)}  </h2>
          </div>
         
          {redeemed && (
      <div className='subtotal'>
        <h1>Net Total After Redeem</h1>
        <h2>S${netTotal.toFixed(2)} </h2>
      </div>
    )}
          <div className='subtotal'>
            <h1>Loyalty Points Earned in this order</h1>
            <h2>{Math.floor((subtotal + shippingcost) / 10) || 0}</h2>
   
          </div>
          <div>
    <div className="subtotal">
      <h1>Rewards Earned</h1>
      <h2>{redUser}</h2>
    </div>

    <div className="subtotal">
      <input
        type="number"
        min="10"
        max={redUser || 0}
        value={redeemAmount}
        onChange={(e) => {
          let value = parseInt(e.target.value, 10) || "";

          if (value > (redUser || 0)) {
            value = redUser || 0;
          }

          setRedeemAmount(value);
        }}
        placeholder="Enter points to redeem"
        style={{
          width: "500px",
          marginRight: "10px",
          borderRadius: "5px",
        }}
        disabled={redUser < 10} 
      />

      <button
        onClick={() => {
          const points = parseInt(redeemAmount, 10);
          if (points >= 10 && points <= (redUser || 0)) {
            handleRedeem(points);
          } else {
            toast.error("Enter valid redeemable points (min 10).");
          }
        }}
        disabled={redUser < 10} // Disable button if less than 10 points
        title={redUser < 10 ? "Redemption is available only after accumulating 10 points." : ""}
      >
        Redeem Points
      </button>
    </div>
  </div>
  
          {
            
              paymentmethod !== '' &&
              selectedaddress.AddressLine1 !== '' && 
              selectedaddress.FloorNo !== '' && 
              selectedaddress.UnitNo !== '' && 
              selectedaddress.AddressLine3 !== ''&& 
              deliverydate !== ''
                ?
              <div className='subtotal'
                onClick={() => { 
                  if (user.B2CCustomerId == null) {
                    toast.error('Please Login First')
                  }
                  else if (selectedaddress.AddressLine1 == undefined && selectedaddress.AddressLine2 == undefined && selectedaddress.AddressLine3 == undefined && selectedaddress.FloorNo == undefined && selectedaddress.UnitNo == undefined) {
                    toast.error('Please select a delivery address')
                  }

                  else if (paymentmethod == ''||null||undefined) {
                    toast.error('Please select a payment method')
                  }

                  else if (deliverydate == ''||null||undefined) {
                    toast.error('Please select a delivery date')
                  }

                  else if (paymentmethod == 'STRIPE') {
                    savepreorderobjtoLS()
                    const preorderarray = JSON.parse(localStorage.getItem('preorderarray'));
                    if (!preorderarray) {
                      toast.error('Preorder data not found');
                      return;
                    }
                    makePayment(preorderarray)
                  }

                  else if (paymentmethod == 'COD') {
                    
                    placeorder()

                  }

                  else {
                    toast.error('Something went wrong')
                  }
                }
                }
              >
                
                <button disabled={isOrderDisabled}
                title={isOrderDisabled ? "Please select a payment method, delivery address and delivery date to Order" : ""}>
                  {boxLoad ? <CircularProgress sx={{color:'white'}} /> : "Order Now"}
                  </button>
              </div>
              :
              <div className='subtotal disabled'
                onClick={() => {
                  toast.error('Please select a payment method, delivery address and delivery date')
                }}
              >
                <button 
                disabled={isOrderDisabled}
                title={isOrderDisabled ? "Please select a payment method, delivery address and delivery date to Order" : ""}
                >
                        {boxLoad ? <CircularProgress sx={{color:'white'}} /> : "Order Now"}
                </button>
              </div>
          }
        </div>
      </div>
      <Footer2 />
    </div>
  )
}

export default Checkout