import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { useDispatch } from 'react-redux';
import { setWishlistCount, setWishlistItems } from '../../Store/wishlistSlice';
import { wishPopupState } from '../../Providers/WishPopupProvider';
import './Wishlist.css'
import WishListItem from './WishListItem';
import { toast } from 'react-toastify';
import { APPEnv } from '../config';

const Wishlist = () => {
    const [wishlistpopupshow, setwishlistpopupshow] = useRecoilState(wishPopupState);
    const [subtotal, setsubtotal] = React.useState(0)
    const [freeDelivery, setfreeDelivery] = useState(300)
    const [whishlist, setwhishlist] = useState([]);
    const [pagenumber, setpagenumber] = useState(1);
    const pageSize = 25;

    const dispatch = useDispatch();

 const getwishlist = async () => {
    let user = JSON.parse(localStorage.getItem('token'));
    if (!user) return;

    try {
        const response = await fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}`);
        const data = await response.json();

        if (data.Data && data.Data.length > 0) {
            setwhishlist(data.Data);   // ✅ use API data directly
            dispatch(setWishlistCount(data.Data.length));
            localStorage.setItem("wishlistCount", data.Data.length);
        } else {
            setwhishlist([]);
            dispatch(setWishlistCount(0));
            localStorage.setItem("wishlistCount", 0);
        }
    } catch (error) {
        console.error(error);
    }
};

    
    // Load wishlist count from localStorage on app start
    useEffect(() => {
        const savedCount = localStorage.getItem("wishlistCount");
        if (savedCount) {
            dispatch(setWishlistCount(parseInt(savedCount, 10))); 
        }
        getwishlist();
    }, []);
    


    return (
        <div className='cartcontainerout'>
            <div className='cartcontainerin'>
                <div className='c11'>
                    <h1>Your Wishlist</h1>
                    <button className='cart-popup__close-btn'
                        onClick={() => {
                            setwishlistpopupshow(false)
                            //  window.location.reload()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>


                {
                    whishlist.length === 0 ?
                        <div className='emptycart'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>

                            <h1>Your wishlist is empty</h1>
                            <p>Please add product to your Wishlist</p>
                        </div>
                        :
                        <div className='cartitems'>
                      {
                                whishlist.map((item, index) => {

                                    return (
                                        <WishListItem key={index} item={item} getwishlist={getwishlist} setwhishlist={setwhishlist}/>
                                    )
                                })
                            }
                        </div>
                }

            </div>
        </div>
    )
}



export default Wishlist