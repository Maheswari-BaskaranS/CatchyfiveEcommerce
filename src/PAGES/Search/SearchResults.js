import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { APPEnv } from '../../COMPONENTS/config';

const SearchResults = (searchValue) => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        // `${process.env.REACT_APP_BACKEND_URL}/search?q=${searchQuery}&page=${currentPage}`
        `${APPEnv.baseUrl}/Product/GetAllWithImageV2?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&ProductName=${searchValue.searchValue}&pageNo=${currentPage}&pageSize=${pageSize}`
      );
      setProducts((prevProducts) => [...prevProducts, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage,searchValue]);

  return (
    <div>
      {/* Display your paginated products here */}
      {/* For example: */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
