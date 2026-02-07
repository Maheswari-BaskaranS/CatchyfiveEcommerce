import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import img1 from '../../ASSETS/Images/1.png'
import img2 from '../../ASSETS/Images/2.png'
import img3 from '../../ASSETS/Images/3.png'
import img4 from '../../ASSETS/Images/4.png'
import Footer1 from '../../COMPONENTS/Footer/Footer1'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import ProductsSlider from '../../COMPONENTS/Product/ProductsSlider'
import './ProductPage.css'
import { useRecoilState } from 'recoil'
import { cartQuantity } from '../../Providers/CartQuantity'
import noimage from '../../ASSETS/noimage.png'
import { productPopupProvider } from '../../Providers/ProductpopupProvider'
import { productPopupIdProvider } from '../../Providers/ProductPopupIdProvider'
import ProductPopup from '../../COMPONENTS/Product/ProductPopup'
import { APPEnv } from '../../COMPONENTS/config'
import loader from '../../ASSETS/loaderGif.gif'
import { addToCart } from '../../Store/shoppingCartSlice'
import { useDispatch } from 'react-redux'

const ProductPage = (props) => {
    // const noimage = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'

    const { prodid } = useParams()
    const [imageset, setimageset] = React.useState(null)
    let user = localStorage.getItem('token')
    const navigate = useNavigate();
    const [productdata, setproductdata] = React.useState(null)
    const [activeimg, setactiveimg] = React.useState({})
    const [count, setcount] = React.useState(1)
    const [showreview, setshowreview] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const descriptionFromAPI = productdata?.EcommerceDetail && productdata.EcommerceDetail[0]?.Desciption;
    const [pagenumber, setpagenumber] = useState(1);
    const pageSize = 25;
    const location = useLocation();
    const qtyFromNav = location.state?.qty || 0;
const productCodeFromNav = location.state?.productCode; 
  const dispatch = useDispatch();

    // Function to strip HTML tags and decode HTML entities
    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };
  
    // Extract the text from the API description
    const formattedDescription = stripHtmlTags(descriptionFromAPI);
  useEffect(() => {
        setLoading(true);
        if (productCodeFromNav) {
            getProductById(productCodeFromNav);
        } else {
            getproductdatabyid(); // fallback if no productCode
        }
        // eslint-disable-next-line
    }, [productCodeFromNav]);

    const getProductById = async (code) => {
        setLoading(true);
        fetch(APPEnv.baseUrl + '/Product/GetbycodeV2?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&ProductCode='+code, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.Status && data.Data && data.Data.length > 0) {
                    setproductdata(data.Data[0]);
                    // Set imageset and activeimg for consistency
                    let myimgset = [];
                    // Collect all images if available
                    if (Array.isArray(data.Data[0].ProductImages) && data.Data[0].ProductImages.length > 0) {
                        myimgset = data.Data[0].ProductImages.map((img, idx) => ({ id: idx + 1, image: img.ImagePath }));
                    } else if (data.Data[0].ProductImagePath) {
                        myimgset.push({ id: 1, image: data.Data[0].ProductImagePath });
                    }
                    setimageset(myimgset);
                    setactiveimg(myimgset[0] || {});
                    setProductName(data.Data[0]?.Name || "");
                    if (qtyFromNav > 0) {
                        setcount(qtyFromNav);
                    }
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error:', error);
            });
    }
    const getproductdatabyid = async () => {
        setLoading(true);
        const produrl = prodid.replace(/&/g, "%26");
        fetch(APPEnv.baseUrl + '/Product/GetAllWithImageV2?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION+'&ProductShortURL='+produrl+`&pageNo=${pagenumber}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.Code == 200 && data.Result && data.Result.length > 0) {
                    setproductdata(data.Result[0]);
                    let myimgset = [];
                    if (Array.isArray(data.Result[0].ProductImages) && data.Result[0].ProductImages.length > 0) {
                        myimgset = data.Result[0].ProductImages.map((img, idx) => ({ id: idx + 1, image: img.ImagePath }));
                    } else if (data.Result[0].ProductImagePath) {
                        myimgset.push({ id: 1, image: data.Result[0].ProductImagePath });
                    }
                    setimageset(myimgset);
                    setactiveimg(myimgset[0] || {});
                    setProductName(data?.Result?.[0]?.Name || "");
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error:', error);
            });
    }


    useEffect(() => {
        // Code to run when the component mounts
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (cart) {
          cart.forEach((item) => {
            if (item.data.ProductCode === prodid) {
             // setshow(true);
              setcount(item.quantity);
            }
          });
        }
      }, []);

    const [rating, setrating] = React.useState(0)


    const [products, setproducts] = React.useState([])
    const [productName, setProductName] = React.useState("")

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

    useEffect(() => {
        getproductdatabyid();
        // If searchvalue is present in props, do not call getProducts
        const searchvalue = props.searchvalue || '';
        if (!searchvalue) {
            getProducts();
        }
        window.scroll(0, 0);
    }, [props.searchvalue]);
    const [show, setshow] = useState(false)
    const [reloadnavbar, setreloadnavbar] = React.useState(false)
      
    const addtocart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Check if the product is already in the cart
        const itemInCart = cart.find(item => item.data.ProductCode === productdata.ProductCode);
        if (itemInCart) {
            // If the product is already in the cart, update its quantity
            itemInCart.quantity += count;
        } else {
            // If the product is not in the cart, add it
            cart.push({ data: productdata, quantity: count });
        }
        // Update the cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch to Redux store (wrap productdata in 'data' property for compatibility with reducer)
    dispatch(addToCart({ product: { data: productdata }, quantity: count }));

        // Show a toast indicating the product was added to the cart
        toast.success('Product added to cart', {
            position: "bottom-right",
            autoClose: 1000,
            onClose: () => navigate('/')
        });
        // Update the cart items
        getcartitems();
    }
    

    const getcartitems = () => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        if (cart !== null) {
            let qty = 0;
            cart.forEach((item) => {
                qty += item.quantity
            })
            // setcartdataquantity(qty)
        }
        // else {
        //     setcartdataquantity(0)
        // }
    }


    const [productpopup, setproductpopup] = useRecoilState(productPopupProvider)
    const [productpopupid, setproductpopupid] = useRecoilState(productPopupIdProvider)




    return (
        <div className='productpage'>
            {productpopup && prodid && <ProductPopup prodid={productpopupid} />}
            <Navbar reloadnavbar={reloadnavbar} />
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <img src={loader} alt="Loading..." style={{ width: 80, height: 80 }} />
                </div>
            ) : productdata ? (
                <>
                    <div className='pc1'>
                        <div className='c11'>
                            <div className='imgset'>
                                {imageset && imageset.map((item, index) => (
                                    <div className='imgsmall' key={item.id}
                                        onClick={() => {
                                            setactiveimg(item)
                                        }}
                                    >
                                        {item.image && item.image !== '/Content/images/NoImage.jpg' ?
                                            <img src={item.image} alt=""
                                                className={activeimg.id === item.id ? 'active' : ''}
                                            />
                                            :
                                            <img src={noimage} alt=""
                                                className={activeimg.id === item.id ? 'active' : ''}
                                            />
                                        }
                                    </div>
                                ))}
                            </div>
                            {activeimg.image && activeimg.image !== '/Content/images/NoImage.jpg' ?
                                <img src={activeimg.image} alt="" className='imgbig' />
                                :
                                <img src={noimage} alt="" className='imgbig' />
                            }
                        </div>
                        <div className='c12'>
                            <h1 style={{ color: "var(--col1)", fontWeight: "bold" }}> {productdata?.Name || productName} </h1>
                            <p className='head1'>{formattedDescription}</p>
                            <h2>S$ {productdata?.SellingCost ? productdata.SellingCost.toFixed(2) : '--'}</h2>
                            <div className='qty'>
                                <button
                                    onClick={() => {
                                        if (count > 1) {
                                            setcount(count - 1)
                                        }
                                    }}
                                >-</button>
                                <span>{count}</span>
                                <button
                                    onClick={() => {
                                        if (productdata?.EcommerceDetail && Array.isArray(productdata.EcommerceDetail) && productdata.EcommerceDetail[0]?.StockAvailability) {
                                            if (count < productdata.EcommerceDetail[0].QtyOnHand) {
                                                setcount(count + 1)
                                            } else {
                                                toast.error('You have reached maximum quantity', {
                                                    position: "bottom-right",
                                                    autoClose: 1000,
                                                });
                                            }
                                        } else {
                                            setcount(count + 1)
                                        }
                                    }}
                                >+</button>
                            </div>
                            <div className='addtocart'
                                onClick={() => {
                                    addtocart()
                                    setshow(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <span>Add to Cart</span>
                            </div>
                        </div>
                    </div>
                    <div className='pc2'>
                        {showreview ?
                            <div className='reviewcont'>
                                {/* ...existing code... */}
                            </div>
                            :
                            <p className='desc'>
                                {productdata?.EcommerceDetail && Array.isArray(productdata.EcommerceDetail) && productdata.EcommerceDetail[0]?.Specification}
                            </p>
                        }
                    </div>
                    <div className='slidercont'>
                        <ProductsSlider products={products} categoryname='Related Products' />
                    </div>
                    <div className='slidercont'>
                        <ProductsSlider products={products} categoryname='Explore More' />
                    </div>
                    <Footer1 />
                    <Footer2 />
                </>
            ) : null}
        </div>
    )
}

export default ProductPage