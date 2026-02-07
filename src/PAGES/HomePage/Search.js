import React, { useEffect, useRef, useState } from "react";
import Footer1 from "../../COMPONENTS/Footer/Footer1";
import Footer2 from "../../COMPONENTS/Footer/Footer2";
import Navbar from "../../COMPONENTS/Navbar/Navbar";
import { useParams, useLocation } from "react-router-dom";

import "./Home1.css";
import ProductCard from "../../COMPONENTS/Product/ProductCard";
import SlidingTopText from "../../COMPONENTS/SlidingTopText/SlidingTopText";
import ClipLoader from "react-spinners/ClipLoader";
import logo from "../../ASSETS/loaderGif.gif";
import { Grid } from "@mui/material";
import { APPEnv } from "../../COMPONENTS/config";

const Search = ({ data }) => {
 
  function useQuery() {
  return new URLSearchParams(useLocation().search);
}
 const query = useQuery();
  const searchTerm = query.get("q") || "";
  const productScrollBoxRef = useRef(null);

  const [products, setProducts] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pagenumber, setpagenumber] = useState(1);
  const [isgetProguct, setisgetProguct] = useState(false);
  const [sortproductsby, setsortproductsby] = React.useState("Latest");

  const [paginationInfo, setPaginationInfo] = useState({
    TotalNumberOfPages: 0,
    NextPageUrl: null,
    PreviousPageUrl: null,
  });

   const checkifinwhishlist = (code) => {};

useEffect(() => {
  if (searchTerm) {
    getProductSearch(searchTerm);
  }
}, [searchTerm]);

console.log(searchTerm,"searchTerm");


const getProductSearch = (qur) => {
  setLoadingProducts(true);

  fetch(`${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&ProductName=${qur}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setProducts(data.Result || []);
      setPaginationInfo({
        TotalNumberOfPages: data.TotalPages || 1,
        NextPageUrl: data.NextPageUrl,
        PreviousPageUrl: data.PreviousPageUrl,
      });
      setTimeout(() => {
        if (productScrollBoxRef.current) {
          productScrollBoxRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    })
    .catch((err) => {
      console.error("Search API failed:", err);
      setProducts([]);
    })
};



  const listInnerRef = useRef();
  const scrollEvent = async () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      // Check if the user has scrolled to the bottom of the container
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // Load new products if the user is at the bottom
        if (!loadingProducts && isgetProguct) {
          setLoadingProducts(true);
          setLoadingProducts(false);
        }
      }
    }
  };

// console.log(categoryBaseUrl,"categoryBaseUrl")
  useEffect(() => {
    const scrollEvent = async () => {
      if (listInnerRef.current) {
        listInnerRef.current.addEventListener("scroll", scrollEvent);
      }
      return () => {
        if (listInnerRef.current) {
          listInnerRef.current.removeEventListener("scroll", scrollEvent);
        }
      };
    };
  }, [scrollEvent]);

useEffect(() => {
  console.log("Search mounted at:", window.location.pathname + window.location.search);
}, []);


const handleNextPage = () => {
  if (paginationInfo.NextPageUrl && pagenumber < paginationInfo.TotalNumberOfPages) {
    setpagenumber((prev) => prev + 1);
  }
};

const handlePreviousPage = () => {
  if (pagenumber > 1) {
    setpagenumber((prev) => prev - 1);
  }
};



  return (
    <div>
      <SlidingTopText />

      <Navbar
        getProductSearch={getProductSearch}
      />

          <Grid>
            <div className="header">
              <div className="sortby">
                <span style={{ marginRight: "15px" }}>Sort by:</span>
                <select
                  value={sortproductsby}
                  onChange={(e) => setsortproductsby(e.target.value)}
                >
                  <option value="Price Low to High">Low to High</option>
                  <option value="Price High to Low">High to Low</option>
                  <option value="Latest">Latest</option>
                </select>
              </div>
            </div>
          </Grid>

          <div className="product_scroll_box" ref={productScrollBoxRef}>
            <div>
              <Grid
                container
                style={{
                  marginTop: "10px",
                  height: "90vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
                className="product-scroll-box"
                onScroll={(e) => scrollEvent(e)}
                ref={listInnerRef}
                spacing={2}
              >
                {products && products.length > 0 ? (
                  products
                    .sort((a, b) => {
                      if (sortproductsby === "Latest") {
                        return new Date(b.ChangedOn) - new Date(a.ChangedOn);
                      } else if (sortproductsby === "Price Low to High") {
                        return a.SellingCost - b.SellingCost;
                      } else if (sortproductsby === "Price High to Low") {
                        return b.SellingCost - a.SellingCost;
                      }
                      return 0;
                    })
                    .map((item, index) => (
                      <ProductCard
                        key={index}
                        data={item}
                        wishlist={checkifinwhishlist(item.Code)}
                      />
                    ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80vh",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <h1>{loadingProducts ? "" : "No Products Found"}</h1>
                    {loadingProducts && (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img src={logo} alt="Loading..." />
                      </div>
                    )}
                  </div>
                )}
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                textAlign="center"
              >
                <Grid item>
                  {loadingProducts && products.length >= 50 && (
                    <ClipLoader color="#36d7b7" />
                  )}
                </Grid>
              </Grid>
              <div className="pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={!paginationInfo.PreviousPageUrl}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="current-page">
                  Page {pagenumber} of {paginationInfo.TotalNumberOfPages}
                </span>
               <button
  onClick={handleNextPage}
  disabled={
    ( !paginationInfo.NextPageUrl) || loadingProducts
  }
  className="pagination-btn"
>
                  Next
                </button>
              </div>
            </div>
          </div>
          <Footer1 />
      <Footer2 />
        </div>

   
  );
};

export default Search;
