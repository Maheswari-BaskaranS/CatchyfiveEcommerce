import React, { useEffect, useRef, useState } from "react";
import BannerSlider from "../../COMPONENTS/Banners/BannerSlider";
import HomeCategories from "../../COMPONENTS/Category/HomeCategories";
import Footer1 from "../../COMPONENTS/Footer/Footer1";
import Footer2 from "../../COMPONENTS/Footer/Footer2";
import Navbar from "../../COMPONENTS/Navbar/Navbar";
import { useParams } from "react-router-dom";
import "./Home1.css";
import CategoryTopbar from "../../COMPONENTS/Product/CategoryTopbar";
import ProductCard from "../../COMPONENTS/Product/ProductCard";
import SlidingTopText from "../../COMPONENTS/SlidingTopText/SlidingTopText";
import ClipLoader from "react-spinners/ClipLoader";
import logo from "../../ASSETS/loaderGif.gif";
import { Grid } from "@mui/material";
import { APPEnv } from "../../COMPONENTS/config";
import CategorySlider from "../../COMPONENTS/Navbar/CategorySlider";

const Home1 = ({ data }) => {
  const {
    subcategory,
    Categoryshorturl,
    Subcatgeoryshorturl,
    level3Subcategory,
  } = useParams();
  const firstLoadRef = useRef(true);
  const productScrollBoxRef = useRef(null);

  const [products, setProducts] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [categories, setCategories] = React.useState([]);
  const [pagenumber, setpagenumber] = useState(1);
  const [isgetProguct, setisgetProguct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortproductsby, setsortproductsby] = React.useState("Latest");
const [categoryBaseUrl, setCategoryBaseUrl] = useState(null);

  const [bannerimages, setbannerimages] = React.useState([]);

  const [paginationInfo, setPaginationInfo] = useState({
    TotalNumberOfPages: 0,
    NextPageUrl: null,
    PreviousPageUrl: null,
  });
  const pageSize = 25;

  const getbannerdata = () => {
    fetch(
      APPEnv.baseUrl +
        "/B2CBannerImage/GetAll?OrganizationId=" +
        process.env.REACT_APP_BACKEND_ORGANIZATION,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setbannerimages(data.Data);
      });
  };

  React.useEffect(() => {
    getbannerdata();
  }, []);

  const getProductSearch = (qur) => {
    fetch(
      `${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&ProductName=${qur}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.Result);
        // Scroll to product scroll box after search
        setTimeout(() => {
          if (productScrollBoxRef.current) {
            productScrollBoxRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      });
  };

const getProducts = async (page) => {
  try {
    setLoadingProducts(true);

    let baseUrl = "";

    const encodedCategory = encodeURIComponent(Categoryshorturl || "");
    const encodedSubcategory = encodeURIComponent(Subcatgeoryshorturl || "");
    const encodedLevel3Subcategory = encodeURIComponent(level3Subcategory || "");

    if (!Categoryshorturl || encodedCategory === "all") {
      // console.log("Running DEFAULT getProducts call");
      baseUrl = `${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}`;
      setCategoryBaseUrl(null); // clear category-specific context
    } else {
      // console.log("Running CATEGORY-SPECIFIC getProducts call");

      if (encodedSubcategory === "all") {
        baseUrl = `${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CategoryShortURL=${encodedCategory}`;
      } else if (encodedLevel3Subcategory === "list") {
        baseUrl = `${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CategoryShortURL=${encodedCategory}&SubCategoryShortURL=${encodedSubcategory}`;
      } else {
        baseUrl = `${APPEnv.baseUrl}/Product/ProductGetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CategoryShortURL=${encodedCategory}&SubCategoryShortURL=${encodedSubcategory}&SubCategoryL2ShortURL=${encodedLevel3Subcategory}`;
      }

      setCategoryBaseUrl(baseUrl); // ✅ store base URL for future use
    }

    const finalUrl = `${baseUrl}&pageNo=${page}&pageSize=${pageSize}`;

    const response = await fetch(finalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();

    let filteredProducts = [];
    if (data.Result && data.Result.length > 0) {
      filteredProducts = data.Result;

      if (page === 1) {
        setProducts(filteredProducts);
      } else {
        setProducts((prev) => [...prev, ...filteredProducts]);
      }

      setPaginationInfo({
        TotalNumberOfPages: data.TotalNumberOfPages || 1,
        NextPageUrl: data.NextPageUrl,
        PreviousPageUrl: data.PreviousPageUrl,
      });
    }

    // console.log("url called", finalUrl);
    // console.log("encodedCategory, encodedSubcategory, encodedLevel3Subcategory called", encodedCategory, encodedSubcategory, encodedLevel3Subcategory);
  } catch (error) {
    // console.error("Error fetching products:", error);
  } finally {
    setLoadingProducts(false);
  }
};


  const getCategories = async () => {
    try {
      const response = await fetch(
        `${APPEnv.baseUrl}/Category/GetAllWithSubcategory?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const categoriesData = await response.json();
      let alldata = [];

      for (const category of categoriesData.Data) {
        let obj = {
          category: {
            ...category,
            Name: category.Name.toUpperCase(),
          },
          subcategories: category.SubCategoryDetail.map((subcat) => ({
            ...subcat,
            Name: subcat.Name.toUpperCase(),
          })),
        };
        // Name=category.Name;
        alldata.push(obj);
      }

      setCategories(alldata);
    } catch (error) {
      // console.log("Error:", error);
    }
  };

  const checkifinwhishlist = (code) => {};

  // INITIAL LOAD — only when no category is selected
  useEffect(() => {
    if (
      firstLoadRef.current &&
      (!Categoryshorturl || Categoryshorturl === "all") &&
      !Subcatgeoryshorturl &&
      !level3Subcategory
    ) {
      getProducts(1);
      firstLoadRef.current = false;
    }
  }, []);

  // CATEGORY CHANGE
  useEffect(() => {
    if (
      !firstLoadRef.current &&
      (Categoryshorturl || Subcatgeoryshorturl || level3Subcategory)
    ) {
      setProducts([]);
      setpagenumber(1);
      getProducts(1);
    }
  }, [Categoryshorturl, Subcatgeoryshorturl, level3Subcategory]);

useEffect(() => {
  // Only proceed if not first load
  if (!firstLoadRef.current) {
    if (categoryBaseUrl) {
      // ✅ Call category-specific paginated API
      const fullUrl = `${categoryBaseUrl}&pageNo=${pagenumber}&pageSize=${pageSize}`;
      // console.log("Calling CATEGORY URL:", fullUrl);

      setLoadingProducts(true);
      fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts((prev) =>
            pagenumber === 1 ? data.Result : [...prev, ...data.Result]
          );
          setPaginationInfo({
            TotalNumberOfPages: data.TotalNumberOfPages || 1,
            NextPageUrl: data.NextPageUrl,
            PreviousPageUrl: data.PreviousPageUrl,
          });
        })
        .catch((err) =>  console.error(err))
        .finally(() => setLoadingProducts(false));
    } else {
      // ✅ Call default API (no category selected)
      // console.log("Calling DEFAULT on pagination:", pagenumber);
      getProducts(pagenumber);
    }
  }
}, [pagenumber]);
// console.log("categoryBaseUrl =", categoryBaseUrl, "pageNo =", pagenumber);


  useEffect(() => {
    getCategories();
  }, []); // call categories only once

  const [visible, setVisible] = useState(false);
  const size = 1000;
  let loading = false;

  let count = 0;
  const listInnerRef = useRef();
  const scrollEvent = async () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      // Check if the user has scrolled to the bottom of the container
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // Load new products if the user is at the bottom
        if (!loadingProducts && isgetProguct) {
          setLoadingProducts(true);
          await getProducts(pagenumber);
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

const isCategorySelected = Categoryshorturl && Categoryshorturl !== "all";

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
        // getProductSearch={getProductSearch}  
        onCategorySelect={setSelectedCategory}
      />

      <HomeCategories />
      <div className="product_sidebar" style={{ marginTop: "20px" }}>
        <div className="allproducts">
          <CategoryTopbar categories={categories} />

          <Grid sx={{ maxWidth: "100vw" }}>
            <BannerSlider />
          </Grid>
          <Grid sx={{ maxWidth: "100vw" }}>
            <CategorySlider onCategorySelect={setSelectedCategory} />
          </Grid>
          <Grid>
            <h2 className="slider-title">{selectedCategory || "Products"}</h2>
          </Grid>

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
    (!isCategorySelected && !paginationInfo.NextPageUrl) || loadingProducts
  }
  className="pagination-btn"
>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {visible ? (
          <div
            className="scrollToTop"
            onClick={() => {
              window.scrollTo(0, size - 500);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
              />
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>

      <Footer1 />
      <Footer2 />
    </div>
  );
};

export default Home1;
