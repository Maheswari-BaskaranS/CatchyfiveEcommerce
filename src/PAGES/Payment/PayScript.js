const API_ENDPOINT = 'http://localhost:4000';
const STRIPE_SECRET_KEY = 'sk_test_51N00U8FFReMpJzWzW0k62c5BgKrjWNJaFnu3DHoO8PUOKie0XyHlJBwVKQaLPsORqJ9udcg2RDWNlbqExcrDxecF00uNWboKYU'; 

export const stripePaymentMethodHandler = async (data, cb) => {
  const { amount, result } = data;
  if (result.error) {
    // show error in payment form
    cb(result);
  } else {
    const paymentResponse = await stripePayment({
      payment_method_id: result.paymentMethod.id,
      name: result.paymentMethod.billing_details.name,
      email: result.paymentMethod.billing_details.email,
      amount: amount,
      // amount:100,
      // currency:"SGD"

    });
    
    newFunction(paymentResponse);
    cb(paymentResponse);

  }

  function newFunction(paymentResponse) {
   
  }
}

// place backend API call for payment
// const stripePayment = async data => {
//   console.log(data);
  // const res = await fetch('https://api.stripe.com/v1/payment_intents', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded',
  //   'Authorization': `Bearer ${STRIPE_SECRET_KEY}` 

  // },
  //   body: JSON.stringify(data),
  // })
  // return await res.json();
  const stripePayment = async data => {
  try {
    const am=data.amount;
   const round=Math.round(am*100);
    const body = new URLSearchParams({
      'amount':round,
      'currency': 'usd',
      
    });

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY }`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  
  } catch (err) {
    throw new Error(err.toString());
  }
};