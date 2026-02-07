import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { cartPopupState } from '../../Providers/CartPopupProvider';
import { cartReloadState } from '../../Providers/CartReload';
import './Cart.css'
import CartItem from './CartItem';
import { APPEnv } from '../config';
import { useDispatch } from 'react-redux';
import { setCartCount, setCartItems } from '../../Store/shoppingCartSlice';

const Cart = () => {
    
    const dispatch = useDispatch();
    const [cartPopupShow, setCartPopupShow] = useRecoilState(cartPopupState);
    const [cartdata, setcartdata] = React.useState([])
    const [subtotal, setsubtotal] = React.useState(0)
    const [freeDelivery, setfreeDelivery] = useState(80)
    const getcartdata = async () => {
        let user = JSON.parse(localStorage.getItem('token'));
        if (!user) return;
    
        try {
            const response = await fetch(
                `${APPEnv.baseUrl}/CartDetails/Getbycode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&Code=${user[0].B2CCustomerId}`
            );
            const data = await response.json();
    
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let updatedCart = [];
            let total = 0;
    
            if (cart.length > 0) {
                cart.forEach(item => {
                    let matchingProduct = data.Data.find(
                        cartItem => cartItem?.ProductCode === item?.data?.ProductCode && cartItem.Qty > 0
                    );
    
                    if (matchingProduct) {
                        updatedCart.push(item);
                        total += item.data.SellingCost * item.quantity;
                    }
                });
            }
    
            // Update state & Redux
            setcartdata(updatedCart);
            setsubtotal(total);
            dispatch(setCartItems(updatedCart)); // Update Redux store
            dispatch(setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0))); // Sync count with Redux
            localStorage.setItem("cartdataredux", JSON.stringify(updatedCart)); // Update localStorage
            localStorage.setItem("cartCount", updatedCart.reduce((acc, item) => acc + item.quantity, 0)); // Sync count in localStorage
        } catch (error) {
            console.error(error);
        }
    };
    

    React.useEffect(() => {
        getcartdata()
    }, [])

    return (
        <div className='cartcontainerout'>
            <div className='cartcontainerin'>
                <div className='c11'>
                    <h1>Shopping Cart</h1>
                    <button className='cart-popup__close-btn'
                        onClick={() => {
                            setCartPopupShow(false)
                        }}
                    >
                        <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="w-6 h-6"
  //onClick={() => window.location.reload()} 
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

                    </button>
                </div>


                {
                    cartdata.length === 0 ?
                        <div className='emptycart'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>

                            <h1>Your cart is empty</h1>
                            <p>Please add product to your cart list</p>
                        </div>
                        :
                        <div className='cartitems'>
                            {
                                cartdata.map((item, index) => {
                                    // console.log(" item", item);
                                    return (
                                        <CartItem itemdata={item}
                                            getcartdata={getcartdata}
                                        />
                                    )
                                })
                            }
                        </div>
                }


                <div className='c3'>
                    <span>Get free delivery for orders above S${freeDelivery}</span>
                    <div className='c31'>
                        <h1>Subtotal:</h1>
                        <h1>S$ {subtotal.toFixed(2)}</h1>
                    </div>
                    <p>Final price and discounts will be determined at the time of payment processing.</p>

                    {
                        cartdata.length === 0 ?
                            <button className='checkoutbtn1'>Proceed To Checkout</button>
                            :

                            // <button className='checkoutbtn'
                            //     onClick={() => {
                            //         setCartPopupShow(false)
                            //         // go to checkout page
                            //         window.location.href = '/checkout'
                            //     }}
                            // >Proceed To Checkout</button>

                            <Link to="/checkout">
                                <button
                                    className='checkoutbtn'
                                    onClick={() => {
                                    setCartPopupShow(false);
                                    // Any additional logic you want to execute before navigating
                                    }}
                                >
                                    Proceed To Checkout
                                </button>
                            </Link>

                    }
                </div>
            </div>
        </div>
    )
}

export default Cart