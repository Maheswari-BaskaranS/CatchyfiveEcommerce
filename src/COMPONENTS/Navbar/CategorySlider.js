import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; 
import NoImage from '../../ASSETS/noimage.png';
import "./CategorySlider.css";
import { APPEnv } from "../config";

const CategorySlider = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(()=>{
    getCategories();
  },[])

  const getCategories = async () => {
    try {
      const response = await fetch(
        `${APPEnv.baseUrl}/Category/GetAllWithSubcategory?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}`
      );

      const categoriesData = await response.json();

      setCategories(
        categoriesData.Data.map((category) => ({
          Name: category.Name.toUpperCase(),
          Icon: category.IconImageFilePath?.trim() || NoImage,
          shortUrl: category.Categoryshorturl,
        }))
      );

      let formattedData = categoriesData.Data.map((category) => ({
        Name: category.Name.toUpperCase(),
        Icon: category.IconImageFilePath && category.IconImageFilePath.trim() !== "" 
          ? category.IconImageFilePath 
          : NoImage,
        shortUrl: category.Categoryshorturl,
      }));

      setCategories(formattedData);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleMouseEnter = () => {
    if (sliderRef.current) {
      sliderRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (sliderRef.current) {
      sliderRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <div className="category-slider-wrapper">
      <h2 className="slider-title">Frequently Bought</h2>
      {loading ? (
        <div className="spinner"></div> // Spinner when loading
      ) : (
        <div className="category-slider-container">
          <div 
            className="category-slider"
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {categories.map((item, index) => (
              <Link key={index} to={`/Home/${item.shortUrl}/all/list`} className="category-box">
                <img src={item.Icon} alt={item.Name} className="category-icon"  onClick={() => onCategorySelect(item.Name)}/>
                <p onClick={() => onCategorySelect(item.Name)}>{item.Name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySlider;
