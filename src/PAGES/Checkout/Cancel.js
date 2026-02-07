import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import './Cancel.css';

const Cancel = () => {
  const [reloadnavbar, setreloadnavbar] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0); // Add a reload key

  useEffect(() => {
    // Add any cancellation logic here
  }, []);

  return (
    <div>
      {/* Pass reloadKey as a prop to Navbar */}
      <Navbar reloadnavbar={reloadnavbar} reloadKey={reloadKey} />
      <div className="cancel-container">
        <h1 className="cancel-heading">Order Cancellation</h1>
        <p className="cancel-message">Your order has been cancelled. </p>
        <Link to="/" className="continue-shopping-link">
          <button className="continue-shopping-btn">Return to Home</button>
        </Link>
      </div>
    </div>
  )
}

export default Cancel;