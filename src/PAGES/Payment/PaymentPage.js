import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import './PaymentPage.css';
import OrderSuccessful from '../../COMPONENTS/OrderSuccessful/OrderSuccessful';
 import { useRecoilState } from 'recoil';
 import { orderSuccessfulProvider } from '../../Providers/OrderSuccessfulProvider';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51N00U8FFReMpJzWzSL2lAHaCnQneRLTpZFtzIhnDdAyqNci4iSEJXrKCehecCCTrfWwBdgneBPXKh5KYSNtdgMUJ00k1doHzNY");
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const successMessage = () => {
  return (
    <div className="success-msg">
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </svg>
      <div className="title">Payment Successful</div>
    </div>
  )
}

// const cart = () => {
//   return (<React.Fragment>
//     <h4 className="d-flex justify-content-between align-items-center mb-3">
//       <span className="text-muted">Your cart</span>
//       <span className="badge bg-secondary badge-pill">3</span>
//     </h4>
//     <ul className="list-group mb-3">
//       <li className="list-group-item d-flex justify-content-between lh-condensed">
//         <div>
//           <h6 className="my-0">Product name</h6>
//           <small className="text-muted">Brief description</small>
//         </div>
//         <span className="text-muted">₹1200</span>
//       </li>
//       <li className="list-group-item d-flex justify-content-between lh-condensed">
//         <div>
//           <h6 className="my-0">Second product</h6>
//           <small className="text-muted">Brief description</small>
//         </div>
//         <span className="text-muted">₹800</span>
//       </li>
//       <li className="list-group-item d-flex justify-content-between lh-condensed">
//         <div>
//           <h6 className="my-0">Third item</h6>
//           <small className="text-muted">Brief description</small>
//         </div>
//         <span className="text-muted">₹500</span>
//       </li>
//       <li className="list-group-item d-flex justify-content-between bg-light">
//         <div className="text-success">
//           <h6 className="my-0">Promo code</h6>
//           <small>EXAMPLECODE</small>
//         </div>
//         <span className="text-success">-₹500</span>
//       </li>
//       <li className="list-group-item d-flex justify-content-between">
//         <span>Total (INR)</span>
//         <strong>₹2000</strong>
//       </li>
//     </ul>
//   </React.Fragment>)
// }

function PaymentPage() {
    // const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [cartdata, setcartdata] = useState([]);
  const [subtotal, setsubtotal] = React.useState(0)
  const [shippingcost, setshippingcost] = React.useState(0)
  const [tax, settax] = React.useState(0)
    const getcartdata = async () => {
    let cart = JSON.parse(localStorage.getItem('cart'))
    if (cart !== null) {
      setcartdata(cart)
      let total = 0
      cart.forEach(item => {
        total += item.data.SellingCost * item.quantity
      })
      setsubtotal(total)
    }
    else {
      setcartdata([])
    }
  }

  React.useEffect(() => {
    getcartdata()
  }, [])

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [ordersuccessorderid, setordersuccessorderid] = React.useState(null)
  const [odersuccesscont, setodersuccesscont] = useRecoilState(orderSuccessfulProvider)
  const [ordersuccessmessage, setordersuccessmessage] = React.useState('Order Placed Successfully')
   const [ordersuccessdata, setordersuccessdata] = React.useState({})
  const [ordersuccessdataitems, setordersuccessdataitems] = React.useState([])


  return (
    <div className="paymentpage_container">
    {
     odersuccesscont && <OrderSuccessful orderid={ordersuccessorderid} message={ordersuccessmessage} redirectto={'home'}
     orderdata={ordersuccessdata} ordearitems={ordersuccessdataitems} tax={tax} subtotal={subtotal} shipping={shippingcost}
    />
   }
      {
      paymentCompleted ? successMessage() : <React.Fragment>
       
        <div className="col-md-7 order-md-1"
        style={{ border: '1px solid #e5e5e5', padding: '20px' , backgroundColor: 'white'}}
        >
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={subtotal + shippingcost} setPaymentCompleted={setPaymentCompleted}
          setordersuccessorderid={setordersuccessorderid} setordersuccessdata={setordersuccessdata} setordersuccessdataitems={setordersuccessdataitems}
            setordersuccessmessage={setordersuccessmessage} setodersuccesscont={setodersuccesscont}
            
/>

          </Elements>
        </div>
      </React.Fragment>}
    </div>
    // <div className="container">
    //   <div className="py-5 text-center">
    //     {/* <h4>Stripe Integration - <a href="https://www.cluemediator.com/" target="_blank">Clue Mediator</a></h4> */}
    //   </div>
    
    

     

    // </div>
  );
}

export default PaymentPage;