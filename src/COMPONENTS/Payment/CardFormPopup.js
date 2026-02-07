import React from 'react'
import payimg from '../../ASSETS/pay.png'
import logo from '../../ASSETS/logo.png'
import './CardFormPopup.css'
import { useRecoilState } from 'recoil'
import { cardDetailsPopupState } from '../../Providers/CardDetailsPopupProvider'
import { loadStripe } from '@stripe/stripe-js'

import noimage from '../../ASSETS/noimage.png'
import Stripe from 'stripe'
const CardFormPopup = ({ cartdata , total}) => {


    const [cardDetailsPopup, setcardDetailsPopup] = useRecoilState(cardDetailsPopupState)
    const [carddata, setcarddata] = React.useState({
        cardnumber: '',
        nameoncard: '',
        cardexpiry: '',
        cardcvc: '',
        email: ''
    })

    const payviastripe = async (e) => {
        e.preventDefault()
        let PublishableKey = `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
        let SecretKey = `${process.env.REACT_APP_STRIPE_SECRET_KEY}`


        // cartdata is [
        //     {
        //         "data": {
        //             "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
        //             "BranchCode": null,
        //             "Code": "0000827",
        //             "Name": "   CAMEL BEEHOON",
        //             "ProductCode": "0000827",
        //             "ProductName": "   CAMEL BEEHOON",
        //             "Specification": "",
        //             "Category": "0014",
        //             "SubCategory": null,
        //             "CategoryName": "NOODLES",
        //             "SubCategoryName": "",
        //             "Uom": "",
        //             "UomName": null,
        //             "PcsPerCarton": 1,
        //             "ProductType": "",
        //             "Brand": "",
        //             "Weight": 0,
        //             "UnitCost": 0,
        //             "AverageCost": 0,
        //             "PcsPrice": 0,
        //             "CartonPrice": 0,
        //             "BarCode": "",
        //             "DisplayOrder": 1,
        //             "IsActive": true,
        //             "IsStock": true,
        //             "CreatedBy": "",
        //             "CreatedOn": "2023-03-31T23:49:47.803",
        //             "ChangedBy": "admin",
        //             "ChangedOn": "2023-04-08T19:07:05.897",
        //             "SellingCost": 1.4,
        //             "SellingBoxCost": 1.4,
        //             "StockQty": null,
        //             "StockBoxQty": null,
        //             "StockPcsQty": null,
        //             "SalesAccount": "",
        //             "InventoryAccount": "",
        //             "COGAccount": "",
        //             "ProductImageString": null,
        //             "ProductImage": null,
        //             "CreatedOnString": "31/03/2023",
        //             "ChangedOnString": "08/04/2023",
        //             "SupplierCode": "",
        //             "SupplierName": "",
        //             "TaxPerc": 8,
        //             "ProductBarcode": null,
        //             "BoxCount": null,
        //             "ProductImg_Base64String": null,
        //             "ProductImageFileName": "camel_behoon.jpg",
        //             "ProductImagePath": "https://fervent-wilson.154-26-130-251.plesk.page//CATCHIFIVE//PRODUCT//45c208e8-44b3-4f62-afc6-b0a737dada91_camel_behoon.jpg",
        //             "MinSellingCost": 0,
        //             "MinSellingBoxCost": 0,
        //             "Tag": "",
        //             "IsWeight": false,
        //             "UomPriceDetail": null,
        //             "StockWQty": null,
        //             "UnitMarginPerc": 0,
        //             "BoxMarginPerc": 0
        //         },
        //         "quantity": 3
        //     },
        //     {
        //         "data": {
        //             "OrgId": process.env.REACT_APP_BACKEND_ORGANIZATION ,
        //             "BranchCode": null,
        //             "Code": "0000864",
        //             "Name": " F&N SWEETENED 390 gr CARTON 1X48",
        //             "ProductCode": "0000864",
        //             "ProductName": " F&N SWEETENED 390 gr CARTON 1X48",
        //             "Specification": "",
        //             "Category": "0003",
        //             "SubCategory": "DAIRY",
        //             "CategoryName": "DAIRY",
        //             "SubCategoryName": "",
        //             "Uom": "",
        //             "UomName": null,
        //             "PcsPerCarton": 1,
        //             "ProductType": "",
        //             "Brand": "",
        //             "Weight": 0,
        //             "UnitCost": 0,
        //             "AverageCost": 0,
        //             "PcsPrice": 0,
        //             "CartonPrice": 0,
        //             "BarCode": "",
        //             "DisplayOrder": 1,
        //             "IsActive": true,
        //             "IsStock": true,
        //             "CreatedBy": "",
        //             "CreatedOn": "2023-03-31T23:49:47.803",
        //             "ChangedBy": "",
        //             "ChangedOn": "2023-03-31T23:49:47.803",
        //             "SellingCost": 38,
        //             "SellingBoxCost": 38,
        //             "StockQty": null,
        //             "StockBoxQty": null,
        //             "StockPcsQty": null,
        //             "SalesAccount": "",
        //             "InventoryAccount": "",
        //             "COGAccount": "",
        //             "ProductImageString": null,
        //             "ProductImage": null,
        //             "CreatedOnString": "31/03/2023",
        //             "ChangedOnString": "31/03/2023",
        //             "SupplierCode": "",
        //             "SupplierName": "",
        //             "TaxPerc": 8,
        //             "ProductBarcode": null,
        //             "BoxCount": null,
        //             "ProductImg_Base64String": null,
        //             "ProductImageFileName": "",
        //             "ProductImagePath": "",
        //             "MinSellingCost": 0,
        //             "MinSellingBoxCost": 0,
        //             "Tag": "",
        //             "IsWeight": false,
        //             "UomPriceDetail": null,
        //             "StockWQty": null,
        //             "UnitMarginPerc": 0,
        //             "BoxMarginPerc": 0
        //         },
        //         "quantity": 1
        //     }
        // ]

        
    }
    return (
        <div
            className='auth-popup'
        >
            <div className='card-popup__content'>
                <button className='auth-popup__close-btn'
                    onClick={() => {
                        setcardDetailsPopup(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>


                <form> 
                    <div id='card-element'></div>
                    <div className='s1'>
                        {/* <img src={logo} alt='logo' className='logo' /> */}
                        <h1>Payment</h1>
                        <p>Enter your card details to make payment</p>
                    </div>


                    <div className='formcont'>
                        <label htmlFor='cardnumber'>Card Number</label>
                        <input type='text' name='cardnumber' id='cardnumber'
                            onChange={(e) => {
                                setcarddata({ ...carddata, cardnumber: e.target.value })
                            }}
                        />
                    </div>

                    <div className='formcont'>
                        <label htmlFor='nameoncard'>Name on Card</label>
                        <input type='text' name='nameoncard' id='nameoncard'
                            onChange={(e) => {
                                setcarddata({ ...carddata, nameoncard: e.target.value })
                            }}
                        />
                    </div>

                    <div className='formrow'>
                        <div className='formcont'>
                            <label htmlFor='cardexpiry'>Card Expiry</label>
                            <input type='text' name='cardexpiry' id='cardexpiry'
                                placeholder='MM/YY'
                                onChange={(e) => {
                                    setcarddata({ ...carddata, cardexpiry: e.target.value })
                                }}
                            />
                        </div>

                        <div className='formcont'>
                            <label htmlFor='cardcvc'>Card CVC</label>
                            <input type='text' name='cardcvc' id='cardcvc'

                                onChange={(e) => {
                                    setcarddata({ ...carddata, cardcvc: e.target.value })
                                }}
                            />
                        </div>
                    </div>

                    <div className='formcont'>
                        <label htmlFor='email'>Email Address</label>
                        <input type='email' name='email' id='email'

                            onChange={(e) => {
                                setcarddata({ ...carddata, email: e.target.value })
                            }}
                        />
                    </div>


                    <button className='btn'
                        onClick={(e) => {
                            payviastripe(e)
                        }}
                    >Pay</button>
                </form>

            </div>
        </div>
    )
}

export default CardFormPopup