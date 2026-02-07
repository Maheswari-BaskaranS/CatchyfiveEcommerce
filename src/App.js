import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './PAGES/HomePage/Home';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductPage from './PAGES/Product/ProductPage';
import About from './PAGES/ExtraPages/About';
import Login from './PAGES/Auth/Login';
import Signup from './PAGES/Auth/Signup';
import UserProfile from './PAGES/User/UserProfile';
import ForgotPassword from './PAGES/Auth/ForgotPassword';
import Home1 from './PAGES/HomePage/Home1';
import Search from './PAGES/HomePage/Search'
import Checkout from './PAGES/Checkout/Checkout';
import Success from './PAGES/Checkout/Success';
import Failed  from './PAGES/Checkout/failed';
import Cancel from './PAGES/Checkout/Cancel';
import Contact from './PAGES/ExtraPages/Contact';
import SearchPage from './PAGES/Search/SearchPage';
import SearchPage1 from './PAGES/Search/SearchPage1';
import TnCPrivacy from './PAGES/ExtraPages/TnCPrivacy';
import PaymentPage from './PAGES/Payment/PaymentPage';
import OrderTrack from './COMPONENTS/UserProfile/OrderTrack';
import Return from './COMPONENTS/UserProfile/Return';
import SearchResults from './PAGES/Search/SearchResults';
import AllProduct from './COMPONENTS/Product/AllProduct';  // Import the AllProduct component
import ReturnList from './COMPONENTS/UserProfile/ReturnList';
import { useDispatch } from 'react-redux';
import { setWishlistCount, setWishlistItems } from './Store/wishlistSlice';
import { APPEnv } from './COMPONENTS/config';
import Offers from './PAGES/ExtraPages/Offers';
// import OrderTrack from './COMPONENTS/UserProfile/OrderTrack';
// const Home1 = lazy(() => import('./PAGES/HomePage/Home1'));
const App = () => {
  const dispatch = useDispatch();
 const location = useLocation();
 
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    const storedCount = storedItems.length;
  
    dispatch(setWishlistItems(storedItems)); // This will update both items and count
    dispatch(setWishlistCount(storedCount));
  }, [dispatch]);
  

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("token"));
  
  //   if (!user) {
  //     dispatch(setWishlistItems([]));
  //     dispatch(setWishlistCount(0));
  //     // localStorage.removeItem("wishlist");
  //     // localStorage.removeItem("wishlistCount");
  //   } else {
  //     fetch(APPEnv.baseUrl + `/B2CCustomerWishList/GetByCustomer?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerId=${user[0].B2CCustomerId}`)
  //       .then(res => res.json())
  //       .then(response => {
  //         if (response.Code === 200) {
  //           dispatch(setWishlistItems(response.Data));
  //           dispatch(setWishlistCount(response.Data.length));
  //           localStorage.setItem("wishlist", JSON.stringify(response.Data));
  //           localStorage.setItem("wishlistCount", response.Data.length);
  //         }
  //       })
  //       .catch(err => {
  //         console.error("Error fetching wishlist:", err);
  //       });
  //   }
  // }, [dispatch]);
  
    useEffect(() => {
    console.log("🔎 Current route:", location.pathname + location.search);
  }, [location]);

  return (
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/search" element={<Search />} />
        {/* <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Home1 /></Suspense>} />
        <Route path="/home/:categoryid/:categoryname/:subcategory" element={<Suspense fallback={<div>Loading...</div>}><Home1 /></Suspense>} /> */}
        <Route path="/home/:Categoryshorturl/:Subcatgeoryshorturl/:level3Subcategory" element={<Home1 />} />
        <Route path="/product/:prodid" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/success' element={<Success />} />
        <Route path='/failed' element={<Failed />} />
        <Route path='/cancel' element={<Cancel />} />
        <Route path="/user/:activepage" element={<UserProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path='/about' element={<About />} />
        <Route path='/privacy-tnc' element={<TnCPrivacy />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/offers' element={<Offers />} />
        {/* <Route path="/search/:searchvalue" element={<SearchPage />} />
        <Route path="/searchbycategory/:categoryid/:categoryname/:subcategory" element={<SearchPage1 />} /> */}
        <Route path='/payment' element={<PaymentPage />} />
        <Route path="/products/:searchValue" element={<AllProduct />} />
        <Route path="/order-track" element={<OrderTrack />} />
        <Route path='/return-products' element={<Return />} />
        <Route path='/return-process' element={<ReturnList /> } />
        <Route path="*" element={<div><h1>404 NOT FOUND</h1></div>} />
      </Routes>
  );
}

export default App;
