import React, { useEffect , useState} from 'react'
import BannerSlider from '../../COMPONENTS/Banners/BannerSlider'
import HomeCategories from '../../COMPONENTS/Category/HomeCategories'
import Footer1 from '../../COMPONENTS/Footer/Footer1'
import Footer2 from '../../COMPONENTS/Footer/Footer2'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import Product_Sidebar from '../../COMPONENTS/Product/Product_Sidebar'
import img1 from '../../ASSETS/Images/1.png'
import img2 from '../../ASSETS/Images/2.png'
import img3 from '../../ASSETS/Images/3.png'
import img4 from '../../ASSETS/Images/4.png'
import ProductsSlider from '../../COMPONENTS/Product/ProductsSlider'
import AuthPopup from '../../COMPONENTS/Auth/AuthPopup'
import { useRecoilState } from 'recoil'
import { orderSuccessfulProvider } from '../../Providers/OrderSuccessfulProvider'
import { productPopupProvider } from '../../Providers/ProductpopupProvider'
import { productPopupIdProvider } from '../../Providers/ProductPopupIdProvider'
import ProductPopup from '../../COMPONENTS/Product/ProductPopup'
import SlidingTopText from '../../COMPONENTS/SlidingTopText/SlidingTopText'
import { APPEnv } from '../../COMPONENTS/config'


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [productPopup, setProductPopup] = useRecoilState(productPopupProvider);
  const [productPopupId, setProductPopupId] = useRecoilState(productPopupIdProvider);

  const getCategories = async () => {
    try {
      const response = await fetch(`${APPEnv.baseUrl}/Category/GetAllWithSubcategory?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const categoriesData = await response.json();
      const formattedCategories = categoriesData.Data.map((category) => ({
        category: {
          ...category,
          Name: category.Name.toUpperCase(),
        },
        subcategories: category.SubCategoryDetail.map((subcat) => ({
          ...subcat,
          Name: subcat.Name.toUpperCase(),
        })),
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getProducts = async (page) => {
    try {
      const response = await fetch(`${APPEnv.baseUrl}/Product/GetAllWithImage?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&pageNo=${page}&pageSize=50`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.Result.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...data.Result]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const loadMoreProducts = () => {
    if (hasMore) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts(pageNumber);
  }, [pageNumber]);

  return (
    <div>
      {productPopup && productPopupId && <ProductPopup prodid={productPopupId} />}
      <SlidingTopText text={`${process.env.REACT_APP_SLIDERTOPTEXT}`} />
      <Navbar />
      <BannerSlider />
      <HomeCategories />
      <Product_Sidebar categories={categories} categoryname={'All Products'} />

      <div className='slidercont'>
        <ProductsSlider products={products} categoryname='Latest Products' />
        {hasMore && (
          <button className='load-more-btn' onClick={loadMoreProducts}>
            Load More Products
          </button>
        )}
      </div>

      <Footer1 />
      <Footer2 />
    </div>
  );
};

export default Home;
