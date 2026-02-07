import React, { useEffect, useState, useRef, useMemo } from 'react'
import './Navbar.css'
import logo from '../../ASSETS/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DropdownComponent from './DropdownComponent'
import AuthPopup from '../Auth/AuthPopup'
import { authPopupState } from '../../Providers/AuthPopupProvider'
import SearchIcon from '@mui/icons-material/Search';
import _, { debounce } from 'lodash';
import { useRecoilState } from 'recoil'
import { useDispatch, useSelector } from 'react-redux'
import Cart from '../Cart/Cart'
import { cartPopupState } from '../../Providers/CartPopupProvider'
import { cartQuantity } from '../../Providers/CartQuantity'
import { toast, ToastContainer } from 'react-toastify'
import { wishPopupState } from '../../Providers/WishPopupProvider'
import Wishlist from '../Wishlist/Wishlist'
import { wishQuantity } from '../../Providers/WishListQuantityProvider';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { APPEnv } from '../config'
import { setWishlistCount } from '../../Store/wishlistSlice'
import loader from "../../ASSETS/loaderGif.gif";

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

const Navbar = ({ getProductSearch, onCategorySelect }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const path = location.pathname;

const cartCount = useSelector(state => state.shoppingCart?.count) || 0;
console.log(cartCount);

    const [cartdataquantity, setcartdataquantity] = useRecoilState(cartQuantity)
    const [wishlistdataquantity, setwishlistdataquantity] = useRecoilState(wishQuantity)
    const [categories, setCategories] = useState([])
    const [searchValue, setSearchValue] = useState('');
    
const wishlistCounts = useSelector(state => state.wishlist?.count);
  
useEffect(() => {
    const storedCount = JSON.parse(localStorage.getItem("wishlistCount")) || 0;
    dispatch(setWishlistCount(storedCount));
  }, [dispatch]);

    const navigate = useNavigate();
 
 const [category, setCategory] = useState([]);
 useEffect(() => {
    getCategories()
}, []) 
let toastShown = false;                     


    const getCategories = async () => {
        try {
            const response = await fetch(`${APPEnv.baseUrl}/Category/GetAllWithSubcategory?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const categoriesData = await response.json();
            let alldata = [];

            setCategory(
                categoriesData.Data.map((category) => ({
                  Name: category.Name.toUpperCase(),
                  shortUrl: category.Categoryshorturl,
                }))
              );

            for (const category of categoriesData.Data) {

                let obj = {
                    category: {
                        ...category,
                        Name: category.Name.toUpperCase() 
                    },
                    subcategories: category.SubCategoryDetail.map(subcat => ({
                        ...subcat,
                        Name: subcat.Name.toUpperCase() 
                    }))
                };


                alldata.push(obj);
            }

            setCategories(alldata);
        } catch (error) {
            console.log('Error:', error);
        }
    };

 

    const dropdownitems = [
        {
            id: 1,
            title: 'Home',
            link: '/'
        },
        {
            id: 2,
            title: 'Categories',
            items:
                categories

        },
        {
            id: 3,
            title: 'About Us',
            link: '/about'
        },
        {
            id: 4,
            title: 'Contact Us',
            link: '/contact'
        },
        {
            id: 5,
            title: 'Offers',
            link: '/offers'
        }
    ]

    const [authPopupShow, setAuthPopupShow] = useRecoilState(authPopupState);
    const [cartPopupShow, setCartPopupShow] = useRecoilState(cartPopupState);
    const [wishlistpopupshow, setwishlistpopupshow] = useRecoilState(wishPopupState);
  
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setuser] = useState(null)
    const [carttotal, setcarttotal] = useState(0)

    const checklogin = async () => {
        try {
            let token = localStorage.getItem('token')
            if (token) {
                let user = JSON.parse(token)
                if (user) {
                    const response = await fetch(`${APPEnv.baseUrl}/B2CCustomerRegister/Getbycode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&B2CCustomerId=${user[0].B2CCustomerId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setuser(data?.Data[0]);
                    getaddress(data?.Data[0]);
                    localStorage.setItem('token', JSON.stringify(data.Data));
                    setLoggedIn(true);
                }
            } else {
                setLoggedIn(false)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoggedIn(false)
        }
    };

    const [defaultaddress, setdefaultaddress] = useState(null)

    const getaddress = (userdata) => {
        let mainaddress = {
            AddressLine1: userdata?.AddressLine1,
            AddressLine2: userdata?.AddressLine2,
            AddressLine3: userdata?.AddressLine3,
            EmailId: userdata.EmailId,
            default: true
        }
        let otheraddress = [];
        fetch(APPEnv.baseUrl + '/B2CCustomerDeliveryAddress/GetAll?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&CustomerId=' + userdata.B2CCustomerId)

            .then(res => res.json())
            .then(data => {

                if (data.Data != null) {
                    otheraddress = data.Data
                    if (mainaddress.AddressLine1 == '' && mainaddress.AddressLine2 == '' && mainaddress.AddressLine3 == '') {
                        let alladdress = [
                            ...otheraddress
                        ]

                        // find IsDefault true
                        let tempdefaultaddress = alladdress.find((address) => {
                            return address.IsDefault == true
                        })
                    
                        if (tempdefaultaddress) {
                            setdefaultaddress(tempdefaultaddress)
                        }
                    }

                    else {
                        let alladdress = [
                            ...otheraddress,
                            mainaddress
                        ]
                        let tempdefaultaddress = alladdress.find((address) => {
                            return address.IsDefault == true
                        })
                        if (tempdefaultaddress) {
                            setdefaultaddress(tempdefaultaddress)
                        }
                    }

                }
                else {
                    let alladdress = [
                        mainaddress
                    ]
                    if (mainaddress.AddressLine1 == '' && mainaddress.AddressLine2 == '' && mainaddress.AddressLine3 == '') {
                        let tempdefaultaddress = alladdress.find((address) => {
                            return address.IsDefault == true
                        })
                        
                        if (tempdefaultaddress) {
                            setdefaultaddress(tempdefaultaddress)
                        }
                    }
                    else {
                        let tempdefaultaddress = alladdress.find((address) => {
                            return address.IsDefault == true
                        })
                        if (tempdefaultaddress) {
                            setdefaultaddress(tempdefaultaddress)
                        }

                    }

                }
            })

    }

    const [products, setproducts] = useState([]);

    // Search overlay state
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);


    const getwishlist = async () => {
        let user = localStorage.getItem('token');
        user = JSON.parse(user);
    
        if (user) {
            try {
                const response = await fetch(`${APPEnv.baseUrl}/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}`);
                const data = await response.json();
                  if (data.Data && data.Data.length > 0) {
                    const products = await Promise.all(data.Data.map(async (item) => {
                        const productResponse = await fetch(`${APPEnv.baseUrl}/Product/Getbycode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&ProductCode=${item.ProductCode}`);
                        const productData = await productResponse.json();
                        return productData.Data;
                    }));
                    setwishlistdataquantity(products.length)
                }
                else {
                    setwishlistdataquantity(0)
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        checklogin()
       // getcartitems()
        // getcarttotal()
        getwishlist()
       
    }, [cartdataquantity, wishlistdataquantity, products])



    const [freeDelivery, setfreeDelivery] = useState(80)
     const [subtotal, setsubtotal] = React.useState(0)
        const getcartdata = async () => {
            let total = 0;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Calculate subtotal from localStorage cart
  if (cart.length > 0) {
    cart.forEach(item => {
      if (item?.data?.SellingCost && item?.quantity > 0) {
        total += item.data.SellingCost * item.quantity;
      }
    });
  }

  setsubtotal(total);
  
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
        
               
                setsubtotal(total);
               
            } catch (error) {
                console.error(error);
            }
        };

        React.useEffect(() => {
            getcartdata(); // Call immediately
          
            const interval = setInterval(() => {
              getcartdata();
            }, 5000); // Calls every 5 seconds
          
            return () => clearInterval(interval); // Cleanup on unmount
          }, []);
          

    const handleWishlist = () => {

        let user = localStorage.getItem('token')
        user = JSON.parse(user)
      
        if (user) {
            setwishlistpopupshow(true)
            setAuthPopupShow(false) 
            setCartPopupShow(false)
        } else {
            setwishlistpopupshow(false)
            navigate('/login')
            // setAuthPopupShow(true)
            setCartPopupShow(false)
      
            toast.error('Please log in to view your wishlist.', {
                position: "top-right",
                autoClose: 1000, 
            });
        }
      
      }
    const handleCartlist = () => {

        let user = localStorage.getItem('token')
        user = JSON.parse(user)

        if (user) {
            setwishlistpopupshow(false)
            setAuthPopupShow(false)
            setCartPopupShow(true)
        } else {
            setwishlistpopupshow(false)
            navigate('/login')
            // setAuthPopupShow(true)
            setCartPopupShow(false)

              
        toast.error('Please log in to view your cart.', {
            position: "top-right",
            autoClose: 1000,
        });
        }

    }

// ✅ useMemo ensures debounce is stable and not reset on every render
const debouncedFetchSuggestions = useMemo(
    () =>
        debounce(async (query) => {
            if (!query.trim()) {
                setSuggestions([]);
                setShowDropdown(false);
                setLoadingSuggestions(false);
                return;
            }
            setLoadingSuggestions(true);
            try {
                const response = await fetch(
                    `${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&ProductName=${encodeURIComponent(query)}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                             body: JSON.stringify({
                            OrganizationId: process.env.REACT_APP_BACKEND_ORGANIZATION,
                            ProductName: query
                        }),
                    }
                );
                const data = await response.json();
                const products = Array.isArray(data) ? data : data.Result;

                if (Array.isArray(products) && products.length > 0) {
                    setSuggestions(products.slice(0, 8));
                    setShowDropdown(true);
                } else {
                    setSuggestions([]);
                    setShowDropdown(false);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setSuggestions([]);
                setShowDropdown(false);
            }
            setLoadingSuggestions(false);
        }, 350),
    []
);

// ✅ cleanup only once on unmount
useEffect(() => {
  return () => {
    debouncedFetchSuggestions.cancel();
  };
}, [debouncedFetchSuggestions]);

// ✅ trigger on search change
useEffect(() => {
  if (search.trim()) {
    debouncedFetchSuggestions(search);
  } else {
    setSuggestions([]);
    setShowDropdown(false);
  }
  setHighlightedIndex(-1);
}, [search, debouncedFetchSuggestions]);


    const handleSearch = () => {
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search)}`);
            setShowDropdown(false);
        }
    };


    const handleKeyDown = (e) => {
        if (showDropdown && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    const selected = suggestions[highlightedIndex];
                    setSearch(selected.Name);
                    setShowDropdown(false);
                    navigate(`/search?q=${encodeURIComponent(selected.Name)}`);
                } else {
                    handleSearch();
                }
            } else if (e.key === 'Tab') {
                setShowDropdown(false);
            }
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            handleSearch();
        }
    };

    // Hide dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Only show search icon in navbar, not the input
    const hideSearchBarRoutes = ['/about', '/contact', '/offers'];
    const shouldShowSearchIcon = !hideSearchBarRoutes.includes(path.toLowerCase());


    return (
        <>
            <nav>
                <ToastContainer />
                {authPopupShow && <AuthPopup />}
                {cartPopupShow && <Cart />}
                {wishlistpopupshow && <Wishlist />}
                
                <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // logo/search left, right section aligned
  width: "90%",
  backgroundColor:"#ffffff",
  gap: "30px"
}}>
              <div className="s1">
    <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={(e) => {
            // Prevent navigation if click is triggered by overlay/modal close or not a direct user click
            if (e.isTrusted && e.detail === 1) {
                window.location.href = "/";
            }
        }}
    />

  {/* Only show search icon in navbar */}
  {shouldShowSearchIcon && (
    <button
            className="search-trigger-btn"
            onClick={() => {
                setSearch(""); // Clear search input on icon click
                setShowSearchOverlay(true);
                setTimeout(() => {
                    if (searchInputRef.current) searchInputRef.current.focus();
                }, 100);
            }}
            title="Search"
        >
      <SearchIcon style={{ color: "#fff" }} />
    </button>
  )}

  {/* Search Overlay/Modal */}
    {showSearchOverlay && (
        <div
            className="search-overlay"
            onClick={e => {
                e.stopPropagation(); // Prevent bubbling to logo
                setShowSearchOverlay(false);
                setTimeout(() => {
                    setSearch("");
                }, 0);
                setSuggestions([]);
                setShowDropdown(false);
            }}
        >
      {/* Close (X) button */}
            <button
                className="closee-btnss"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowSearchOverlay(false);
                    setTimeout(() => {
                        setSearch("");
                    }, 0);
                    setSuggestions([]);
                    setShowDropdown(false);
                }}
                title="Close"
            >
                ×
            </button>

      <div
        className="search-overlay-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-input-wrap">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for Products and Categories"
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!showDropdown && e.target.value.trim()) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            onFocus={() => {
              setSearchFocused(true);
              if (suggestions.length > 0) setShowDropdown(true);
            }}
          />
          {/* Clear button */}
          <button
            className="cleare-btnss"
            onClick={() => {
              setSearch("");
              setSuggestions([]);
              setShowDropdown(false);
              if (searchInputRef.current) searchInputRef.current.focus();
            }}
            title="Clear"
            tabIndex={-1}
          >
            ×
          </button>
        </div>

        <button
          className="search-submit-btn"
          onClick={() => {
            handleSearch();
            setShowSearchOverlay(false);
          }}
        >
          Search <SearchIcon style={{ color: "#fff" }} />
        </button>

                {/* Loader while fetching suggestions, only if search has text */}
                {search.trim() && loadingSuggestions && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
                        <img src={loader} alt="Loading..." style={{ width: 48, height: 48 }} />
                    </div>
                )}
                {showDropdown && suggestions.length > 0 && searchFocused && !loadingSuggestions && (
                    <div className="suggestions-box">
                        {suggestions.map((item, idx) => (
                            <div
                                key={item.ProductCode || item.ProductName || idx}
                                className={`suggestion-card ${
                                    highlightedIndex === idx ? "highlighted" : ""
                                }`}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSearch(item.ProductName);
                                    setShowDropdown(false);
                                    setShowSearchOverlay(false);
                                    navigate(`/search?q=${encodeURIComponent(item.ProductName)}`);
                                }}
                            >
                                <img
                                    src={
                                        item.ProductImagePath ||
                                        item.ProductImage ||
                                        "/noimage.png"
                                    }
                                    alt={item.ProductName}
                                    onError={(e) => {
                                        e.target.src = "/noimage.png";
                                    }}
                                />
                                <div className="title">{item.ProductName}</div>
                                {item.SellingCost && (
                                    <div className="price">${item.SellingCost}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
      </div>
    </div>
  )}
</div>


                    <div className='right' style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div className='freedeliveryout' style={{ marginRight: 25 }}>
                            {subtotal >= freeDelivery && <p>Proceed to checkout for free delivery</p>}
                            {subtotal > 0 && subtotal < freeDelivery && <p>Add <span className='price'>$ {(freeDelivery - subtotal).toFixed(2)}</span> more for free delivery</p>}
                            {subtotal == 0 && subtotal < freeDelivery && <p>Add <span className='price'>$ {(freeDelivery - subtotal).toFixed(2)}</span> and above for free delivery</p>}
                            <div className='freedeliveryprogress'>
                                <div className='freedelivery' style={{ width: `${(subtotal / freeDelivery) * 100}%` }}></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div className='cartout' onClick={(e) => {
                                e.stopPropagation();
                                if (loggedIn) {
                                    handleWishlist();
                                } else {
                                    if (!toastShown) {
                                        toast.info("Please sign in to view your wishlist");
                                        toastShown = true;
                                        setTimeout(() => {
                                            toastShown = false;
                                            navigate('/login');
                                        }, 2000);
                                    }
                                }
                            }}>
                                <div className='cart'>
                                    <span className='qty'>{wishlistCounts ?? 0}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cicon">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </div>
                                <p className='resp'>Wishlist</p>
                            </div>
                            <div className='cartout'style={{marginLeft:'-15px'}} onClick={(e) => {
                                e.stopPropagation();
                                if (loggedIn) {
                                    handleCartlist();
                                } else {
                                    if (!toastShown) {
                                        toast.info("Please sign in to view your cart");
                                        toastShown = true;
                                        setTimeout(() => {
                                            toastShown = false;
                                            navigate('/login');
                                        }, 2000);
                                    }
                                }
                            }}>
                                <div className='cart'>
                                    <span className='qty'>{cartCount ?? 0}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cicon">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                                <p className='resp'>Cart</p>
                            </div>
                            {loggedIn ? (
                                <Link to='/user/accountsettings' className={'stylenone'}>
                                    <div className='userout'>
                                        <div className='user'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                        <p>Account</p>
                                    </div>
                                </Link>
                            ) : (
                            <div 
  className='userout' 
  style={{ display: "flex", alignItems: "center", cursor: "pointer", whiteSpace: "nowrap" }}
  onClick={() => {
    navigate('/login');
    setCartPopupShow(false);
    setwishlistpopupshow(false);
  }}
>
  <div className='user' onClick={() => navigate('/login')}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
      className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" 
        d="M15.75 6a3.75 3.75 0 11-7.5 0 
           3.75 3.75 0 017.5 0zM4.501 20.118a7.5 
           7.5 0 0114.998 0A17.933 17.933 0 
           0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  </div>
  <p onClick={() => navigate('/login')} style={{ margin: 0, whiteSpace: "nowrap" }}>Sign In</p>
</div>


                            )}
                        </div>
                    </div>
</div>
                    {/* ...existing code for s2 section... */}
                    <div className='s2'>
                        <div className='s21'>
                            {dropdownitems.map((item, index) => (
                                <DropdownComponent onCategorySelect={onCategorySelect} data={item} key={index} />
                            ))}
                        </div>
                        {user && (
                            <Link to='/user/address' className={'stylenone'}>
                                <div className='s22'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <h3>Delivery:</h3>
                                    {!defaultaddress ? (
                                        <p>Address</p>
                                    ) : (
                                        <p
                                            style={{
                                                maxWidth: "200px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                margin: 0,
                                                lineHeight: "1.2",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {defaultaddress?.AddressLine1 || ""}
                                            {defaultaddress?.AddressLine2?.length > 0 ? `, ${defaultaddress.AddressLine2}` : ""}
                                            {defaultaddress?.AddressLine3?.length > 0 ? `, ${defaultaddress.AddressLine3}` : ""}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>
                </nav>
            </>
        );
    }
    export default Navbar;
