import React from 'react';
import onlineshop from '../../ASSETS/OnlineShop.jpg'
import './Footer1.css';

const Footer1 = () => {
    return (
        <div className='footer1'>
            <h1>Get Groceries delivered and order the best of seasonal farm fresh food</h1>
            <img src={onlineshop} alt='Online Shopping' />
        </div>
    );
};

export default Footer1;
