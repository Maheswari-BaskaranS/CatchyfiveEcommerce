import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import img1 from '../../ASSETS/Images/1.png'
import img2 from '../../ASSETS/Images/2.png'
import img3 from '../../ASSETS/Images/3.png'
import img4 from '../../ASSETS/Images/4.png'
import Footer1 from '../../COMPONENTS/Footer/Footer1'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import ProductsSlider from '../../COMPONENTS/Product/ProductsSlider'
import './ProductPopup.css'
import { useRecoilState } from 'recoil'
import { productPopupProvider } from '../../Providers/ProductpopupProvider'
// import '../../PAGES/Product/ProductPage.css'
import noimage from '../../ASSETS/noimage.png'
import { productPopupIdProvider } from '../../Providers/ProductPopupIdProvider'
import { APPEnv } from '../config'

const ProductPopup = ({ prodid }) => {
    const [imageset, setimageset] = useState(null);
    const [productdata, setproductdata] = useState([]);
    const [activeimg, setactiveimg] = useState({});
    const [count, setcount] = useState(1);
    const [products, setproducts] = useState([]);
    const [reloadnavbar, setreloadnavbar] = useState(false);
    const [productpopup, setproductpopup] = useRecoilState(productPopupProvider);
    const [productpopupid, setproductpopupid] = useRecoilState(productPopupIdProvider);

    // Pagination states
    const [pageNo, setpageNo] = useState(1);
    const pageSize = 50;

    const getproductdatabyid = async () => {

        fetch(APPEnv.baseUrl + '/Product/Getbycode?OrganizationId='+ process.env.REACT_APP_BACKEND_ORGANIZATION+'&ProductCode=' + prodid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.Code === 200) {
                    let myimgset = [];
                    myimgset.push({ id: 1, image: data.Data[0].ProductImagePath });
                    setimageset(myimgset);
                    setproductdata(data.Data[0]);
                    setactiveimg(myimgset[0]);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const getProducts = () => {
        fetch(APPEnv.baseUrl + '/Product/GetAll?OrganizationId='+process.env.REACT_APP_BACKEND_ORGANIZATION, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setproducts(data.Result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        getproductdatabyid();
        getProducts();
        window.scroll(0, 0);
    }, [prodid, pageNo]);

    const addtocart = () => {
        let cart = JSON.parse(localStorage.getItem('cart'));

        if (cart) {
            let itemincart = cart.find(item => item.productdata.ProductId === productdata.ProductId);
            if (itemincart) {
                cart = cart.map(item => {
                    if (item.productdata.ProductId === productdata.ProductId) {
                        return {
                            ...item,
                            quantity: item.quantity + count,
                        };
                    } else {
                        return item;
                    }
                });
                localStorage.setItem('cart', JSON.stringify(cart));
            } else {
                cart = [
                    ...cart,
                    {
                        productdata,
                        quantity: count,
                    },
                ];
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        } else {
            cart = [
                {
                    productdata,
                    quantity: count,
                },
            ];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        setreloadnavbar(!reloadnavbar);
        toast.success('Item added to cart');
    };

    return (
        <div className='productpopup'>
            <div className='productpopup__container'>
                <button
                    className='auth-popup__close-btn'
                    onClick={() => {
                        setproductpopup(false);
                        setproductpopupid(null);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className='pc1'>
                    <div className='c11'>
                        <div className='imgset'>
                            {imageset &&
                                imageset.map((item, index) => (
                                    <div
                                        className='imgsmall'
                                        key={index}
                                        onClick={() => {
                                            setactiveimg(item);
                                        }}
                                    >
                                        {item.image && item.image !== '/Content/images/NoImage.jpg' ? (
                                            <img
                                                src={item.image}
                                                alt=""
                                                className={activeimg.id === item.id ? 'active' : ''}
                                            />
                                        ) : (
                                            <img
                                                src={noimage}
                                                alt=""
                                                className={activeimg.id === item.id ? 'active' : ''}
                                            />
                                        )}
                                    </div>
                                ))}
                        </div>
                        {activeimg.image && activeimg.image !== '/Content/images/NoImage.jpg' ? (
                            <img src={activeimg.image} alt="" className='imgbig' />
                        ) : (
                            <img src={noimage} alt="" className='imgbig' />
                        )}
                    </div>

                    <div className='c12'>
                        <h1 className='head1'>{productdata?.EcommerceDetail?.[0]?.Desciption}</h1>
                        <h2>S$ {productdata?.SellingCost?.toFixed(2)}</h2>
                        <div className='qty'>
                            <button
                                onClick={() => {
                                    if (count > 1) {
                                        setcount(count - 1);
                                    }
                                }}
                            >
                                -
                            </button>
                            <span>{count}</span>
                            <button
                                onClick={() => {
                                    if (productdata?.EcommerceDetail?.[0]?.StockAvailability) {
                                        if (count < productdata.EcommerceDetail[0].QtyOnHand) {
                                            setcount(count + 1);
                                        } else {
                                            toast.error('You have reached maximum quantity', {
                                                position: 'bottom-right',
                                                autoClose: 1000,
                                            });
                                        }
                                    } else {
                                        setcount(count + 1);
                                    }
                                }}
                            >
                                +
                            </button>
                        </div>

                        <div
                            className='addtocart'
                            onClick={() => {
                                addtocart();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                            <span>Add to Cart</span>
                        </div>

                        <p
                            style={{
                                textDecoration: 'none',
                                color: 'gray',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setproductpopup(false);
                                window.location.href = `/product/${productdata.ProductCode}`;
                            }}
                        >
                            More Details
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;
