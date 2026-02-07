import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {  addToWishlist, removeFromWishlist,setWishlistCount,setWishlistItems } from '../../Store/wishlistSlice';
import {updateQuantity,removeFromCart, addToCart}from '../../Store/shoppingCartSlice'
import { toast, ToastContainer } from 'react-toastify'
import { Grid, Paper, Typography, Button , TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import 'react-multi-carousel/lib/styles.css';
import Slider from 'react-slick';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import './ProductCard.css'
import noimage from '../../ASSETS/noimage.png'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../ASSETS/loaderGif.gif'
import { APPEnv } from '../config';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:'8px',
  p: 4,
  zIndex:9999,
  minHeight: '85vh !important',
};


const CustomPrevArrow = (props) => (
  <div className="custom-arrow custom-prev" onClick={props.onClick}>
    <ArrowBackIosNewIcon />
  </div>
);

const CustomNextArrow = (props) => (
  <div className="custom-arrow custom-next" onClick={props.onClick}>
    <ArrowForwardIosIcon />
  </div>
);


const ProductCard = ({ data, wishlist }) => {

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state?.shoppingCart?.items || []);
  const productInCart = cartItems?.length
  ? cartItems.find((item) => item?.data?.ProductCode === data?.ProductCode)
  : 0;
  const currentQty = productInCart ? productInCart.quantity : 0;

  const shoppingCart = useSelector((state) => state?.shoppingCart);
// console.log("Shopping Cart:", shoppingCart);

  const wishlistItems = useSelector(state => state.wishlist.items || []);
// console.log("Wishlist Items:", wishlistItems);
// console.log("dataaaaaaaaa",data)
const [isInWishlist, setIsInWishlist] = useState(false);
const [user, setUser] = useState(null);
  const navigate = useNavigate()

useEffect(() => {
  setIsInWishlist(wishlistItems.some(wishItem => wishItem.ProductCode === data.ProductCode));
}, [wishlistItems, data.ProductCode]);

  const [open, setOpen] = React.useState(false);
  const [show, setshow] = useState(!!productInCart);
  const [count, setCount] = useState(productInCart ? productInCart.quantity : 0);
  const [productcode, setproductcode] = useState(data.ProductCode)
  const [showreview, setshowreview] = React.useState(false)

  useEffect(() => {
    if (productInCart) {
      setCount(productInCart.quantity);
    } else {
      setCount(0);
    }
  }, [productInCart]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('token'));
  //   if (!storedUser) {
  //     navigate('/'); 
  //   } else {
  //     setUser(storedUser);
  //   }
  // }, [navigate]);

  const handleCartUpdate = async (cart, qty) => {
    
    if (!data) return;
    try {
      const response = await fetch(`${APPEnv.baseUrl}/CartDetails/CreateCartDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
          CartCode: data?.CartCode || '',
          CustomerCode: user?.[0]?.B2CCustomerId,
          Qty: qty,
          Price: data?.Price || '',
          SellingCost: data?.SellingCost,
          ProductCode: data?.ProductCode,
          ProductName: data?.ProductName,
          IsActive: true,
          ProductImage: data?.ProductImage || '',
        }),
      });
      const responseData = await response.json();
      if (responseData.Code === 200) {
        toast.success('Product Added to Cart', { fontSize:"12px",position: "top-right", autoClose: 1000 });

        setTimeout(getcartitems, 500);
      }
    } catch (err) {
      toast.error('Error updating cart', { position: "top-right", autoClose: 1000 });
      console.error('Error:', err);
    }
  };
  
  const addToCartHandler = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemInCart = cart.find(item => item?.data?.ProductCode === data?.ProductCode);
    if (itemInCart) {
      itemInCart.quantity += count;
    } else {
      cart.push({ data, quantity: count });
    }
    handleCartUpdate(cart, itemInCart ? itemInCart.quantity : count);
    setshow(true);
  };


  useEffect(() => {
    // Code to run when the component mounts
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart.length > 0) {
      cart.forEach((item) => {
      // console.log("item values", item)
        if (item?.data?.ProductCode === data?.ProductCode && item.quantity > 0) {
          setshow(true);
          setCount(item.quantity);
          getwhishlist();
        }
      });
    }
  }, []);

  const getcartitems = async () => {
    let user = localStorage.getItem('token');
    user = JSON.parse(user);

    if (user) {
      try {
        // console.log("Confirming the API Call");
            const response = await fetch(`${APPEnv.baseUrl}/CartDetails/Getbycode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&Code=${user[0].B2CCustomerId}`);
            const data = await response.json();

            if (data && data.Data) {
                let qty = 0;
              data.Data.forEach((item) => {
                  if (item.Qty > 0) {
                    // console.log("item -- 140 - productcard", item);
                    setshow(true);
                    setCount(item.Qty)
                  }
                  qty += item.Qty;
                });
                // setcartdataquantity(qty); 
            }

        } catch (error) {
            console.log("Error fetching cart items from the backend:", error);
        }
    }

    else {
      toast.error("Please login")
    }
};

const syncGuestCartToBackend = async (customerId) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  for (const item of cart) {
    try {
      await fetch(APPEnv.baseUrl + '/CartDetails/CreateCartDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
          CartCode: item.data.CartCode || "",
          CustomerCode: customerId,
          Qty: item.quantity,
          Price: item.data.Price || "",
          SellingCost: item.data.SellingCost,
          ProductCode: item.data.ProductCode,
          ProductName: item.data.ProductName,
          IsActive: true,
          CreatedUser: item.data.CreatedUser || "",
          ModifiedUser: item.data.ModifiedUser || "",
          ProductImage: item.data.ProductImage || "",
          Createdon: item.data.CreatedOn || "",
          Modifiedon: item.data.ModifiedOn || "",
          ChangedOnString: item.data.ChangedOnString || "",
          CreatedOnString: item.data.CreatedOnString || "",
        })
      });
    } catch (err) {
      console.error(`Error syncing item ${item.data.ProductCode}:`, err);
    }
  }

  localStorage.removeItem('cart'); // Clear local cart
  getcartitems();                  // Refresh cart from backend
};

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('token'));

  if (user && user[0]?.B2CCustomerId) {
    const guestCart = JSON.parse(localStorage.getItem('cart'));
    if (guestCart && guestCart.length > 0) {
      syncGuestCartToBackend(user[0].B2CCustomerId);
    }
  }
}, []); // Runs once on mount


const addtocart = async () => {
  const user = JSON.parse(localStorage.getItem('token'));

  const newQuantity = count ? count + 1 : 1;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const itemInCart = cart.find(item => item?.data?.ProductCode === data?.ProductCode);
  if (itemInCart) {
    itemInCart.quantity += newQuantity;
  } else {
    cart.push({ data, quantity: newQuantity });
  }

  // Store in localStorage & Redux
  localStorage.setItem('cart', JSON.stringify(cart));
  dispatch(addToCart({ product: { data }, quantity: newQuantity }));

  toast.success('Product added to cart', {
    position: "top-right",
    autoClose: 1000,
  });

  setCount(newQuantity);
  setshow(true);

  // If logged in, sync with backend
  if (user && user[0]?.B2CCustomerId) {
    try {
      const response = await fetch(APPEnv.baseUrl + '/CartDetails/CreateCartDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
          "CartCode": data.CartCode || "",
          "CustomerCode": user[0].B2CCustomerId,
          "Qty": itemInCart ? itemInCart.quantity : newQuantity,
          "Price": data.Price || "",
          "SellingCost": data?.SellingCost,
          "ProductCode": data.ProductCode,
          "ProductName": data.ProductName,
          "IsActive": true,
          "CreatedUser": data.CreatedUser || "",
          "ModifiedUser": data.ModifiedUser || "",
          "ProductImage": data.ProductImage || "",
          "Createdon": data.CreatedOn || "",
          "Modifiedon": data.ModifiedOn || "",
          "ChangedOnString": data.ChangedOnString || "",
          "CreatedOnString": data.CreatedOnString || ""
        }),
      });

      const responseData = await response.json();
      if (responseData.Code === 200) {
        setTimeout(() => {
          getcartitems(); // re-fetch from server
        }, 500);
      }
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  }
};

const decrementcartqty = async () => {
  // Retrieve the user data from localStorage
  let user = localStorage.getItem('token');
  user = JSON.parse(user);

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemInCart = cart.find(item => item.data.ProductCode === data.ProductCode);

  if (itemInCart) {
      if (itemInCart.quantity >= 1) {
          // Decrement the quantity and update the cart
          itemInCart.quantity -= 1;
         localStorage.setItem('cart', JSON.stringify(cart));
          try {
              // Call CreateCartDetails API to update the quantity
                             const response = await fetch(`${APPEnv.baseUrl}/CartDetails/CreateCartDetails`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
                      "CartCode": data.CartCode || "",
                      "CustomerCode": user[0].B2CCustomerId, // Use dynamic CustomerCode
                      "Qty": itemInCart.quantity,
                      "Price": data.Price || "",
                      "SellingCost": data.SellingCost,
                      "ProductCode": data.ProductCode,
                      "ProductName": data.ProductName,
                      "IsActive": true,
                      "CreatedUser": data.CreatedUser || "",
                      "ModifiedUser": data.ModifiedUser || "",
                      "ProductImage": data.ProductImage || "",
                      "Createdon": data.CreatedOn || "",
                      "Modifiedon": data.ModifiedOn || "",
                      "ChangedOnString": data.ChangedOnString || "",
                      "CreatedOnString": data.CreatedOnString || ""
                  }),
              });

              const responseData = await response.json();

              if (responseData.Code === 200) {
                  toast.success('Product Removed from Cart', {
                      position: "top-right",
                      autoClose: 500,
                  });
                  setTimeout(() => {
                    getcartitems();
                  }, 1000)
              }
          } catch (err) {
              toast.error('Error updating cart', {
                  position: "top-right",
                  autoClose: 1000,
              });
              console.error('Error updating cart:', err);
          }

      } else if (itemInCart.quantity === 1) {
        
          // Remove the item if quantity is 1
          try {
 const response = await fetch(`${APPEnv.baseUrl}/CartDetails/RemoveByProductCode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerCode=${user[0].B2CCustomerId}&ProductCode=${data.ProductCode}`);
                    const responseData = await response.json();

              if (responseData.Code === 200) {
                  // Remove the item from the local cart
                  cart = cart.filter(item => item.data.ProductCode !== data.ProductCode);
                 localStorage.setItem('cart', JSON.stringify(cart));

                  toast.success('Product removed from cart', {
                      position: "top-right",
                      autoClose: 1000,
                  });
                
                  setTimeout(() => {
                    getcartitems();
                  }, 1000)
              }
          } catch (err) {
              toast.error('Error removing product from cart', {
                  position: "top-right",
                  autoClose: 1000,
              });
              console.error('Error removing product from cart:', err);
          }
      }
  }

  setTimeout(() => {
    getcartitems();
  }, 1000)
};

useEffect(() => {
  setshow(!!productInCart); // Set to true if productInCart exists, false otherwise
}, [productInCart]);

const incrementcartqty = async () => {
  // Retrieve the user data from localStorage
  let user = localStorage.getItem('token');
  user = JSON.parse(user);

  if (!user) {
      
      return null;
  }

  // Get the cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Find the item to increment in the cart
  const itemInCart = cart.find(item => item.data.ProductCode === data.ProductCode);

  if (itemInCart) {
      itemInCart.quantity += 1;
  } else {
      // If item doesn't exist, you can handle it by adding it to the cart (optional)
      cart.push({
          data: data, 
          quantity: 1
      });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  try {
      // Make the API call to update the item quantity in the backend cart
      const response = await fetch(APPEnv.baseUrl + '/CartDetails/CreateCartDetails', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
              "CartCode": data.CartCode || "",
              "CustomerCode": user[0].B2CCustomerId,  // Pass the CustomerCode from the logged-in user's data
              "Qty": itemInCart.quantity,  // Updated quantity
              "Price": data.Price || "",
              "SellingCost": data.SellingCost,
              "CreatedUser": "",//user[0].B2CCustomerName
              "ModifiedUser":"",//user[0].B2CCustomerName
              "ProductCode": data.ProductCode,
              "ProductName": data.ProductName,
              "IsActive": true,
              "CreatedUser": data.CreatedUser || "",
              "ModifiedUser": data.ModifiedUser || "",
              "ProductImage": data.ProductImage || "",
              "Createdon": data.CreatedOn || "",
              "Modifiedon": data.ModifiedOn || "",
              "ChangedOnString": data.ChangedOnString || "",
              "CreatedOnString": data.CreatedOnString || ""
          }),
      });

      const responseData = await response.json();

    if (responseData.Code === 200) {
        
      setTimeout(() => {
        getcartitems();
      }, 1000)
          toast.success('Product Added to Cart', {
              position: "top-right",
              autoClose: 500,
          });
      }
  } catch (err) {
      console.log('Error updating cart:', err);
      toast.error('Error updating cart', {
          position: "top-right",
          autoClose: 1000,
      });
  }
};

const incrementcart = async (qty) => {
  let user = localStorage.getItem('token');
  user = JSON.parse(user);

  if (!user) {
    return null;
  }

  setCount(qty);

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemInCart = cart.find(item => item.data?.ProductCode === data?.ProductCode);
  
  if (itemInCart) {
    itemInCart.quantity = qty; // ✅ Ensure quantity updates correctly
  } else {
    cart.push({ data, quantity: qty });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  try {
    const response = await fetch(APPEnv.baseUrl + '/CartDetails/CreateCartDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
        "CartCode": data.CartCode || "",
        "CustomerCode": user[0].B2CCustomerId,  
        "Qty": qty,  
        "Price": data.Price || "",
        "SellingCost": data.SellingCost,
        "CreatedUser": user[0].B2CCustomerName || "",
        "ModifiedUser": user[0].B2CCustomerName || "",
        "ProductCode": data.ProductCode,
        "ProductName": data.ProductName,
        "IsActive": true,
        "ProductImage": data.ProductImage || "",
        "Createdon": data.CreatedOn || "",
        "Modifiedon": data.ModifiedOn || "",
        "ChangedOnString": data.ChangedOnString || "",
        "CreatedOnString": data.CreatedOnString || ""
      }),
    });

    const responseData = await response.json();

    if (responseData.Code === 200) {
      dispatch(addToCart({ product: {data}, quantity: qty }));
      setCount(qty);
          setshow(true);
      setTimeout(() => {
        getcartitems();
      }, 500);
    }
  } catch (err) {
    toast.error("Error updating cart", {
      position: "top-right",
      autoClose: 1000,
    });
    console.error("Error updating cart:", err);
  }

  setTimeout(() => {
    getcartitems();
    setshow(true);
  }, 500);
};



  const [prodid, setprodid] = useState(null)
  const [isinwhishlist, setisinwhishlist] = useState(wishlist)
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("token"));
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  
    if (user && guestWishlist.length > 0) {
      const syncWishlist = async () => {
        for (const item of guestWishlist) {
          await fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/Create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
              CustomerId: user[0].B2CCustomerId,
              ProductCode: item.ProductCode,
              ProductName: item.ProductName,
              IsActive: true,
              Quantity: item.Quantity,
              Price: item.Price,
              CreatedBy: user[0].B2CCustomerId,
              CreatedOn: new Date().toISOString(),
            }),
          });
        }
  
        // Clear guest wishlist
        localStorage.removeItem("wishlist");
        localStorage.removeItem("wishlistCount");
  
        // Refresh Redux state with server wishlist
        const response = await fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}`);
      const data = await response.json();
      if (data.Code === 200) {
        dispatch(setWishlistItems(data.Data));
      }
    };
  
      syncWishlist();
    }
  }, []);

  const addtowhishlist = () => {
    let user = JSON.parse(localStorage.getItem('token'));

    const wishlistItem = {
      ProductCode: data.ProductCode,
      ProductName: data.ProductName,
      Quantity: data.qty,
      Price: data.Price,
    };
  
    if (!user) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Avoid duplicate entries by ProductCode
    const isAlreadyInWishlist = wishlist.some(
      item => item.ProductCode === wishlistItem.ProductCode
    );

    if (!isAlreadyInWishlist) {
      wishlist.push(wishlistItem);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      localStorage.setItem("wishlistCount", JSON.stringify(wishlist.length));

      dispatch(addToWishlist(wishlistItem)); // Update Redux wishlist array
      dispatch(setWishlistCount(wishlist.length)); // Update Redux count

      setIsInWishlist(true);
      toast.success("Added to wishlist", { autoClose: 1000 });
    } else {
      toast.info("Already in wishlist", { autoClose: 1000 });
    }
    return;
  }

        fetch(APPEnv.baseUrl + '/B2CCustomerWishList/Create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
                "CustomerId": user[0].B2CCustomerId,
                "ProductCode": data.ProductCode,
                "ProductName": data.ProductName,
                "IsActive": true,
                "Quantity": data.qty,
                "Price": data.Price,
                "CreatedBy": user[0].B2CCustomerId,
                "CreatedOn": new Date().toISOString(),
            }),
        })
        .then(res => res.json())
        .then(response => {
            if (response.Code === 200) {
             
                dispatch(addToWishlist({ ProductCode: data.ProductCode })); // Update Redux state
                setIsInWishlist(true); // Update local state immediately
                getwhishlist();
                toast.success('Product added to wishlist', { position: "bottom-right", autoClose: 1000 });
            }
        })
        .catch(err => {
            toast.error('Error adding product to wishlist', { position: "bottom-right", autoClose: 1000 });
        });
    
};

  const getwhishlist = () => {
    let user = localStorage.getItem('token')
    user = JSON.parse(user)
    if (user) {
      fetch(APPEnv.baseUrl + `/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}`)
        .then(res => res.json())
        .then(data => {
          if (data.Code == 200 && Array.isArray(data.Data)) {
            data.Data.forEach((item) => {
              // setwishlistdataquantity(data.Data.length)
              if (item.ProductCode === productcode) {
                setisinwhishlist(true)
              }
            })
          }
        })
        .catch(err => {
          console.error(err);
        })
    }
  }

  const removewhishlist = () => {
  let user = JSON.parse(localStorage.getItem('token'));

  if (!user) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Remove item by ProductCode
    wishlist = wishlist.filter(item => item.ProductCode !== data.ProductCode);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("wishlistCount", JSON.stringify(wishlist.length));

    dispatch(removeFromWishlist(data.ProductCode)); // Update Redux state
    dispatch(setWishlistCount(wishlist.length)); // Update Redux count

    setIsInWishlist(false);
    toast.success("Removed from wishlist", { autoClose: 1000 });
    return;
  }

  // Logged-in user: call backend API
  fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/Remove?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}&ProductCode=${data.ProductCode}&UserName=admin`)
    .then(res => res.json())
    .then(response => {
      if (response.Code === 200) {
        dispatch(removeFromWishlist(data.ProductCode)); // Update Redux state
        setIsInWishlist(false); // Update local state immediately
        getwhishlist(); // Refresh wishlist
        toast.success('Product removed from wishlist', { position: "bottom-right", autoClose: 1000 });
      }
    })
    .catch(err => {
      toast.error('Error removing product from wishlist', { position: "bottom-right", autoClose: 1000 });
    });
};


  const [PopProducts, setproducts] = useState([]);

  const getProducts = () => {
    fetch(APPEnv.baseUrl + '/Product/GetAllWithImageV2?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION, {
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

  useEffect(() => {
    let user = localStorage.getItem('token');
    user = JSON.parse(user);
    if (user) {
      fetchWhishlistStatus(user[0].B2CCustomerId);
      getwhishlist();
    }
  }, []);
  const fetchWhishlistStatus = (customerId) => {
    fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${customerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.Code === 200) {
          data.Data.forEach(item => {
            if (item.ProductCode === productcode) {
              setisinwhishlist(true);
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };


  const [productData , setProductdata] = useState(null);

  const [popCount, setPopCount] = useState(0);

  const getProductById = async (code) => {

    fetch(APPEnv.baseUrl + '/Product/GetbycodeV2?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&ProductCode='+code, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
      .then(response => response.json())
      .then(data => {
          if (data.Status) {
              setProductdata(data.Data[0])
                // let myimgset = []
                // myimgset.push({ id: 1, image: data.Result[0].ProductImagePath })
                // setimageset(myimgset)
                // setproductdata(data.Result[0])
                // setactiveimg(myimgset[0])
                // setProductName( data?.Result?.[0]?.Name || "" )
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }


  
  const handleOpen = (code, qty) => {
    getProductById(code);
    if(qty===undefined){
      setPopCount(0);
    }
    getProducts();
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    // window.location.reload();
  }

  const addtocartPop = () => {
    let user = localStorage.getItem('token');
    user = JSON.parse(user);

    // Show authentication popup if user is not logged in
    if (!user) {
       
        return null;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemInCart = cart.find(item => item.data.ProductCode === productData.ProductCode);

    if (itemInCart) {
        // Increment the quantity if the item is already in the cart
        itemInCart.quantity += count;
    } else {
        // Add new item to the cart
        cart.push({ data: productData, quantity: count });
    }

    // Prepare data for API call
    const payload = {
        "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION,
        "CartCode": data.CartCode || "",
        "CustomerCode": user[0].B2CCustomerId, // Fetch CustomerCode from user
        "Qty": itemInCart ? itemInCart.quantity : count, // Ensure correct quantity
        "Price": data.Price || "",
        "SellingCost": data.SellingCost,
        "ProductCode": data.ProductCode,
        "ProductName": data.ProductName,
        "IsActive": true,
        "CreatedUser": user[0].B2CCustomerName || "",
        "ModifiedUser": user[0].B2CCustomerName || "",
        "ProductImage": data.ProductImage || "",
        "Createdon": data.CreatedOn || "",
        "Modifiedon": data.ModifiedOn || "",
        "ChangedOnString": data.ChangedOnString || "",
        "CreatedOnString": data.CreatedOnString || ""
    };

    // API call to add/update cart details
    fetch(APPEnv.baseUrl + '/CartDetails/CreateCartDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(res => res.json())
        .then(responseData => {
            if (responseData.Code === 200) {
                getwhishlist(); // Refresh wishlist
                toast.success('Product added to Cart', {
                    position: "top-right",
                    autoClose: 1000,
                });
                getcartitems(); // Refresh cart items
                setOpen(false); // Close popup

                // Update count for UI
                setshow(true);
                setCount(itemInCart ? itemInCart.quantity - 1 : count - 1);
            }
        })
        .catch(err => {
            console.error('Error adding to cart:', err);
            toast.error('Product could not be added to cart', {
                position: "top-right",
                autoClose: 1000,
            });
        });
};

  return (
    <>

          
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{zIndex:'9999'}}
        >
            <Box sx={style} className='pop-responsive'>
                <CloseIcon sx={{ position:'relative' , float:'right' , cursor:'pointer'}} onClick={handleClose} />
                {productData ? (
                <>
                             {productData && (
                <Grid container width='100%' >
            
  <Grid item sm={12} md={8} sx={{ marginRight: '100px' }}>
  <Grid container justifyContent="center" alignItems="center" sx={{ border: '1px solid gray', padding: '10px' }}>
    <Grid container spacing={2}> 
      {/* If only the main product image exists, make it larger */}
      {(!Array.isArray(productData.EcommerceGalleryImages) || productData.EcommerceGalleryImages.length === 0) ? (
        <Grid item xs={12} display="flex" justifyContent="center">
          <img 
            src={productData.ProductImagePath || noimage} 
            alt="Product" 
            width="300px" // Larger image size
            style={{ border: '2px solid #ccc', padding: '5px', borderRadius: '5px' }}
          />
        </Grid>
      ) : (
        <>
          {/* Main Product Image (Normal Size if Gallery Images Exist) */}
          <Grid item xs={6}>
            <img 
              src={productData.ProductImagePath || noimage} 
              alt="Product" 
              width="200px" 
              style={{ border: '2px solid #ccc', padding: '5px', borderRadius: '5px' }}
            />
          </Grid>

          {/* Ecommerce Gallery Images (Max 4 images, 2 per row) */}
          {Array.isArray(productData.EcommerceGalleryImages) && productData.EcommerceGalleryImages.slice(0, 4).map((img, index) => (
            <Grid item xs={6} key={index}>
              <img 
                src={img.ImageFilePath || noimage} 
                alt={`Product ${index}`} 
                width="200px" 
                style={{ border: '2px solid #ccc', padding: '5px', borderRadius: '5px' }}
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  </Grid>
</Grid>

                    <Grid item sm={12} md={2} sx={{ marginTop: '50px' }} >
                        <Typography sx={{fontWeight:'500' , fontSize:'20px' , wordBreak:'break-all'}}>{productData.ProductName}</Typography>
                        {/* <Typography>1 each</Typography> */}
                        <Typography sx={{fontWeight:'bolder', fontSize:'20px'}} >S${productData.SellingCost}</Typography>
                        <Typography 
  sx={{ 
    color: productData.IsStock ? 'green' : 'red', 
    padding: '10px 0' 
  }}
>
  {productData.IsStock ? "In Stock" : "Out Of Stock"}
</Typography>

                        <Grid className="calc-box" container sx={{borderRadius:'5px'}}>
                            <Grid item>
                                <RemoveIcon sx={{fontSize:'30px' , cursor:'pointer'}} 
                                   onClick={() => {
                                    if (popCount > 0) {
                                      setPopCount(popCount - 1)
                                      setshow(false)
                                    }
                                  }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography  sx={{fontSize:'20px'}}>{popCount}</Typography>
                            </Grid>
                            <Grid item> 
                              <AddIcon   sx={{fontSize:'30px' , cursor:'pointer'}} 
                                  onClick={() => {
                                   if (Array.isArray(productData?.EcommerceDetail) && productData.EcommerceDetail.length > 0 && productData.EcommerceDetail[0].StockAvailability) {
                                       if (popCount < productData.EcommerceDetail[0].QtyOnHand) {
                                        if(popCount < 10){
                                          setPopCount(popCount + 1)
                                        }
                                      }
                                       else {
                                           toast.error('You have reached maximum quantity', {
                                               position: "bottom-right",
                                               autoClose: 1000,
                                           })
                                       }
                                   }
                                   else {
                                    setPopCount(popCount + 1)
                                   }
                               }}
                              />
                            </Grid>
                        </Grid>
                        <Grid className="cart-box" container 
                  onClick={() => {
                    if (popCount > 0) {
                      handleClose();
                      incrementcart(popCount)
                      addToCartHandler()
                  }
                  }}
                  sx={{
                    pointerEvents: popCount === 0 ? 'none' : 'auto',
                    opacity: popCount === 0 ? 0.5 : 1,
                    cursor: popCount === 0 ? 'not-allowed' : 'pointer'
                }}
                  
                          >
                            <Grid item>
                                <ShoppingBagOutlinedIcon />
                            </Grid>
                            <Grid item>
                            <Typography sx={{ fontWeight: 'bold', cursor: popCount === 0 ? 'not-allowed' : 'pointer' }}>Add to Cart</Typography>
                            </Grid>
                        </Grid>
                        <Grid pt={2}>
                            <Typography sx={{fontWeight:'600'}}>Product Details:</Typography>
                        </Grid>
                        <Grid>
                          <Typography>
                            <div dangerouslySetInnerHTML={{ __html: productData && productData?.EcommerceDetail?.length && productData.EcommerceDetail[0] && productData.EcommerceDetail[0].Desciption }} />
                          </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            )}
             {showreview ? (
              <>
                  <Grid container pt={2} pb={2} justifyContent='space-between'>
                    <Grid item md={5.5}>
                      <Typography sx={{padding:'20px 0px' , fontSize:'20px'}}>Submit Your review</Typography>
                        <Grid container> 
                          <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            label="Name"
                            sx={{marginBottom:'20px'}}
                          />
                          <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            label="Email"
                            sx={{marginBottom:'20px'}}
                          />
                        <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            label="Review"
                            sx={{marginBottom:'20px'}}
                          />
                          <Rating name="no-value" value={null} sx={{fontSize:'50px'}} />
                        </Grid>
                        <Button sx={{margin:'10px 0',padding:'8px 30px' , backgroundColor:'#02b290' , color:'white' , fontWeight:'bold' , fontSize:'15px'}}>Submit</Button>
                    </Grid>
                    <Grid item md={5.5}>
                        <Typography sx={{padding:'20px 0px' , fontSize:'20px'}}>Product reviews</Typography>

                    </Grid>
                  </Grid>
              </>
             ):(
              <></>
             )}

                <Grid sx={{margin:'30px 0 '}}>
                    <Typography sx={{fontWeight:'bold' ,fontSize:'25px'}}>Related products</Typography>
                </Grid>
                <Grid className="slider-container">
 
                          {PopProducts?.length > 0 ? (
                           <>
                                <Slider {...settings}>
                                  {PopProducts && PopProducts?.length && PopProducts.map((item , index) => (
                                    <div style={{ display:'flex' , justifyContent:'center' , alignItems:'center'}}>
                                      <Grid item xs={6} sm={4} md={3} lg={3} xl={2.4}  key={index} className="image-hover-effect" sx={{margin:'10px' , minWidth:'200px' }}>
                                        <Card sx={{cursor:'pointer'}} >
                                        <CardContent>
                                            <Grid container direction='column'>
                                                <Grid item sx={{ display: 'flex', justifyContent: 'unset'}} >
                                                    <div>
                                                    <img
                                                    src={item.ProductImagePath || noimage}
                                                    alt="c1"
                                                    width="150px" 
                                                    height="160px" 
                                                    style={{
                                                      objectFit: 'cover',
                                                      maxWidth: '100%',
                                                      maxHeight: '100%',
                                                      paddingLeft: '10px',
                                                    }}
                                                    className="image-hover-effect"
                                                    />
                                                    </div>
                                                </Grid>
                                                <Grid item  sx={{zIndex:'9999' , paddingTop:'10px' }} >
                                                    <Grid container sx={{ display:'flex' , flexDirection:'column' , justifyContent:'space-between' ,  minHeight:'150px'}} >
                                                        <Grid item>
                                                            <Typography sx={{fontWeight:'bold' , lineHeight:'1.5rem' ,fontSize:'1rem'}}>S${item.PcsPrice} - S${item.SellingCost}</Typography>
                                                            <Typography sx={{padding:' 10px 0px' , color:'#595959' , fontSize:'14px' , wordBreak:'break-all'}}>{item.ProductName}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography>1 each</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        </Card>
                                      </Grid>
                                    </div>
                                  ))}
                                </Slider>
                            </>
                          ) 
                    : (
                      <></>
                    )}
                </Grid> 
                </>
                ):(
                  <>
              <div style={{ display: "flex", justifyContent: "center" }}>
  <img style={{ width: "100%", height: "400px", objectFit: "contain" }} src={logo} alt="Loading..." />
</div>
                  </>
                )}

            </Box>
        </Modal>

                <Grid item xs={6} sm={4} md={4} lg={3} xl={2.4}  className="image-hover-effect">
                    <Card sx={{cursor:'pointer'}} >
                    <CardContent>
                      <Grid container direction='column'>
                        <Grid item>
                          {
                             isInWishlist ? (
                              < FavoriteIcon style={{color:"rgb(231, 46, 46)"}} sx={{float:'right'}} onClick={removewhishlist} />
                             ):(
                              < FavoriteBorderIcon  sx={{float:'right'}} onClick={addtowhishlist} />
                             )
                          }
                          <ToastContainer />
                          <Grid pb={2} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            navigate(`/product/${data.ProductCode}`, {
                              state: {
                                qty: productInCart?.quantity ?? 0,
                                productCode: data.ProductCode
                              }
                            })
                          }
                        >
                          <img
                            src={data.ProductImagePath || noimage}
                            alt='c1'
                            width='280px'
                            height='200px'
                            style={{
                              objectFit: 'contain',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              paddingLeft: '10px'
                            }}
                            className="image-hover-effect"
                          />
                        </div>
                          </Grid>
                          {show && productInCart?.quantity > 0? (
                            <Grid container direction='row' sx={{display:'flex' , justifyContent:'flex-end'}}>
                              <Grid container direction='row' justifyContent='space-evenly' className='calc-box'>
                                <Grid item>
                                    <RemoveIcon sx={{fontSize:'20px' , cursor:'pointer'}} 
                                      onClick={() => {
                                        if (count > 1) {
                                          setCount(count - 1);
                                          dispatch(updateQuantity({ productCode: data.ProductCode, quantity: count - 1 }));
                                        } else {
                                          dispatch(removeFromCart(data.ProductCode));
                                          setshow(false);
                                        }
                                      }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography  sx={{fontSize:'16px'}}>{productInCart?.quantity}</Typography>
                                </Grid>
                                <Grid item>
                                    <AddIcon sx={{fontSize:'20px' , cursor:'pointer'}}
                          onClick={() => {
                                        if (Array.isArray(data?.EcommerceDetail) && data.EcommerceDetail?.length > 0 && data.EcommerceDetail[0].StockAvailability) {
                                          if (count < data.EcommerceDetail[0].QtyOnHand) {
                                            if(count < 10){
                                              setCount(count + 1)
                                              dispatch(updateQuantity({ productCode: data.ProductCode, quantity: count + 1 }));
                                            }
                                          } else {
                                            toast.error('You have reached the maximum quantity', {
                                              position: "bottom-right",
                                              autoClose: 1000,
                                            })
                                          }
                                        } else {
                                          setCount(count + 1)
                                          dispatch(updateQuantity({ productCode: data.ProductCode, quantity: count + 1 }));
                                        }
                                      }}
                                    />
                                </Grid>
                              </Grid>  
                            </Grid>
                          ):(
                            <Grid container direction='column' alignItems='end' gap={1} sx={{marginTop:'-40px' , minHeight:'70px'}}>
                              <RemoveRedEyeOutlinedIcon className="expand-look" sx={{fontSize:'32px'  , zIndex:'998'}}
                                onClick={() => 
  navigate(`/product/${data.ProductCode}`, { 
    state: { qty: productInCart?.quantity ?? 0,
      productCode: data.ProductCode
     } 
  })
}

                              />
                              <AddIcon className="expand-look" sx={{fontSize:'32px'  , zIndex:'998'}}
                        onClick={() => { addtocart() }}
                              />
                            </Grid>
                          )}
                   
                        </Grid>
                          <Grid item sx={{ paddingTop: '10px', display: 'flex', justifyContent: 'center' }}>
                              <Grid container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100px' }}>
                                  <Grid item>
                                      <Typography sx={{ fontWeight: 'bold', lineHeight: '1.5rem', fontSize: '1rem' }}>S$ {
                                       data.SellingCost.toFixed(2)}</Typography>
                                      <Typography sx={{ padding: '10px 0px', fontSize: '12px', wordBreak: 'break-all' }}>{data.ProductName}</Typography>
                                  </Grid>
                              </Grid>
                          </Grid>
                      </Grid>
                    </CardContent>
                    </Card>
                </Grid>

    </>
  )
}

export default ProductCard