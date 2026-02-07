

import React, { useEffect,useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../COMPONENTS/Navbar/Navbar';
import Search_Product_Sidebar from '../../COMPONENTS/Product/Search_Product_Sidebar';
import ProductCard from '../../COMPONENTS/Product/ProductCard';
import './Search.css';
import loaderGif from '../../ASSETS/loaderGif.gif';
import { APPEnv } from '../../COMPONENTS/config';
const SearchPage = () => {
  const { searchvalue } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // Remove pageNumber and hasMore, only fetch first page

  const pageSize = 25;
  const fetchProducts = async () => {
    setLoading(true);
    // Pass searchvalue as a query param if present
    let apiUrl = `${APPEnv.baseUrl}/Product/GetAllWithImageV2?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&pageNo=1&pageSize=${pageSize}`;
    if (searchvalue && searchvalue.trim() !== "") {
      apiUrl += `&ProductName=${encodeURIComponent(searchvalue)}`;
    }
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      let filtered = data.Result;
      if (searchvalue && searchvalue.trim() !== "") {
        filtered = filtered.filter((product) =>
          product.Name.toLowerCase().includes(searchvalue.toLowerCase())
        );
      }
      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setProducts([]);
    fetchProducts();
    // eslint-disable-next-line
  }, [searchvalue]);
  let count=0;
  const listInnerRef = useRef();
  // No infinite scroll or page increment logic
  return (
    <div className="search-page">
      <Navbar />
      <div className="sidebar-products-container">
        {loading ? (
          <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <img src={loaderGif} alt="Loading..." style={{ width: '200px', height: '200px' }} />
          </div>
        ) : (
        
          <div className="product-cards">
              <div className="product_scroll_box">
          <div
            className="product-scroll-box"
            style={{
              height: "600px",
              overflowY: "scroll",
              display: "flex",
              flexWrap: "wrap",
              paddingLeft: "0px",
              paddingRight: "10px",
            }}
            // No infinite scroll
            ref={listInnerRef}
          >
            {products.map((product) => (
              <ProductCard key={product.id} data={product} wishlist={false} searchvalue={searchvalue} />
            ))}
          </div>
          </div>
</div>

        )}

      </div>
    </div>
  );
};

export default SearchPage;
