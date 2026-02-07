import React , {useState, useEffect} from 'react'
import noimage from '../../ASSETS/noimage.png'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'
import './Wishlist.css';
import 'react-multi-carousel/lib/styles.css';
import { cartQuantity } from '../../Providers/CartQuantity'
import { wishQuantity } from '../../Providers/WishListQuantityProvider'
import { Grid, Paper, Typography, Button , TextField } from '@mui/material';

import { APPEnv } from '../config'
import { useDispatch, useSelector } from 'react-redux'
import {updateWishlistCount,removeFromWishlist,setWishlistCount, setWishlistItems} from '../../Store/wishlistSlice'
import { setCartCount, setCartItems } from '../../Store/shoppingCartSlice';

const WishListItem = ({ item, getwishlist, setwhishlist}) => {
  const dispatch = useDispatch();
    const [showdelete, setshowdelete] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  const [wishlistdataquantity, setwishlistdataquantity] = useRecoilState(wishQuantity)
 
  const wishlistItems = useSelector(state => state.wishlist.items || []);
  useEffect(() => {
      console.log("Updated Wishlist in Redux:", wishlistItems);
  }, [wishlistItems]);
  
  const [productData , setProductdata] = useState(null);
  const [popCount, setPopCount] = useState(1);
  const [count, setCount] = useState(1)
  const [pagenumber, setpagenumber] = useState(1);
  const pageSize = 25;


  const getcartitems = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let qty = cart.reduce((sum, item) => sum + item.quantity, 0);

    // ✅ Update Redux store if needed
    dispatch(setCartCount(qty)); 
    dispatch(setCartItems(cart))
};

  const getProductById = async (code) => {

    fetch(APPEnv.baseUrl + '/Product/GetAllWithImageV2?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&ProductCode='+code+`&pageNo=${pagenumber}&pageSize=${pageSize}`, {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.Code == 200) {
                setProductdata(data.Result[0])
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }


  const [PopProducts, setproducts] = useState([]);


  const getProducts = () => {
    fetch(APPEnv.baseUrl + '/Product/GetAllWithImageV2?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+`&pageNo=${pagenumber}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            setproducts(data.Result)
        })
  }

  const handleOpen = (code) => {
    getProductById(code);
    getProducts();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    dispatch(setWishlistItems(savedWishlist));
    dispatch(setWishlistCount(savedWishlist.length));
}, [dispatch, wishlistdataquantity]); // <- Add dependency



const removewishlist = async () => {
    let user = JSON.parse(localStorage.getItem('token'));
    if (!user) return;

    let updatedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    updatedWishlist = updatedWishlist.filter(wishItem => wishItem.ProductCode !== item.ProductCode);

    // ✅ Update Redux before modifying localStorage
    dispatch(setWishlistItems(updatedWishlist)); 
    dispatch(setWishlistCount(updatedWishlist.length));
    dispatch(removeFromWishlist(item.ProductCode));

    // ✅ Update localStorage after Redux update
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    localStorage.setItem("wishlistCount", JSON.stringify(updatedWishlist.length));

    try {
    const response = await fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/Remove?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}&ProductCode=${item.ProductCode}&UserName=${user[0].B2CCustomerName}`);
        const data = await response.json();

        if (data.Code === 200) {
            // ✅ Ensure UI updates properly when last item is removed
            setwhishlist(updatedWishlist);
            getwishlist();
        } else {
            toast.error("Failed to remove item from wishlist");
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


const addtocart = async () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let user = JSON.parse(localStorage.getItem('token'));

    if (!user || !user[0]?.B2CCustomerId) {
        toast.error('User not found, please log in', { position: "bottom-right", autoClose: 1000 });
        return;
    }

    let existingItem = cart.find(cartItem => cartItem.data.ProductCode === item.ProductCode);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ data: item, quantity: 1 });
    }

    // ✅ Update Local Storage for Cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // ✅ Remove item from wishlist immediately in localStorage
    let updatedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    updatedWishlist = updatedWishlist.filter(wishItem => wishItem.ProductCode !== item.ProductCode);

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    localStorage.setItem("wishlistCount", JSON.stringify(updatedWishlist.length));

    // ✅ Dispatch Redux updates before setting state
    dispatch(setWishlistItems(updatedWishlist)); 
    dispatch(setWishlistCount(updatedWishlist.length));
    dispatch(removeFromWishlist(item.ProductCode));

    // ✅ Force state update
    setwhishlist([...updatedWishlist]); 

    try {
        const response = await fetch(APPEnv.baseUrl + '/CartDetails/CreateCartDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
                CartCode: item.CartCode || "",
                CustomerCode: user[0].B2CCustomerId,
                Qty: existingItem ? existingItem.quantity : 1, 
                Price: item.Price || "",
                SellingCost: item.SellingCost,
                CreatedUser: user[0].B2CCustomerName || "",
                ModifiedUser: user[0].B2CCustomerName || "",
                ProductCode: item.ProductCode,
                ProductName: item.ProductName,
                IsActive: true,
                ProductImage: item.ProductImage || "",
                Createdon: item.Createdon || "",
                Modifiedon: item.Modifiedon || "",
                ChangedOnString: item.ChangedOnString || "",
                CreatedOnString: item.CreatedOnString || "",
            }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.Code === 200) {
            toast.success('Added to Cart');
            
            // ✅ Handle case when wishlist is empty
            if (updatedWishlist.length === 0) {
                localStorage.removeItem("wishlist");
                localStorage.setItem("wishlistCount", "0");
                dispatch(setWishlistCount(0));

                // ✅ Ensure UI updates properly when last item is removed
                setwhishlist([]); // Empty state to force UI update
            } else {
                localStorage.setItem("wishlistCount", JSON.stringify(updatedWishlist.length));
                dispatch(setWishlistCount(updatedWishlist.length));
            }

            getcartitems();
            getwishlist();
            removewishlist();
        } else {
            throw new Error(responseData.Message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Could not add to cart');
    }
};


    return (
        <>

        <div
            className='wishlistitem'
        >
            <div className='s1'
                onMouseEnter={() => setshowdelete(true)}
                onMouseLeave={() => setshowdelete(false)}
            >
                <img src={item.ProductImageFileName !== 'NoImage.jpg' ? item.ProductImagePath : noimage} alt='no image'
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noimage
                    }}
                />
                {
                    showdelete &&
                    <div className='removeitem'>
                        <button
                            onClick={removewishlist}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                }
            </div>
            <div className='s2'>
                <Typography sx={{padding:'0px 10px'}}  onClick={(e) => {handleOpen(item.ProductCode)}}>{item.ProductName}</Typography>
            </div>
            <div className='s3'>
                <p className='amount'>S$ {item.SellingCost?.toFixed(2)}</p>
                <div className='cartout'
                    onClick={addtocart}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </>
    )
}

export default WishListItem