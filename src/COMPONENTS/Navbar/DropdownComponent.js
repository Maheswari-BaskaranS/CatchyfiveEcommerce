import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DropdownComponent.css";

const DropdownComponent = ({ data, onCategorySelect }) => {
  const [show, setShow] = React.useState(false);
  const [expanded, setExpanded] = React.useState({});
  const [isHovered, setIsHovered] = React.useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="dropdowncomponent"
    
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="s1">
        {data.items && data.items.length > 0 ? (
          <div className="droptitle padt navItem"
          onClick={() => setShow(!show)}>
            <h3
              className={isHovered ? "hovered" : ""}
              style={{ paddingBottom: "4px" }}
            >
              {data.title}
            </h3>
            {show ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isHovered ? "#02B290" : "currentColor"}
                className="droptitle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isHovered ? "#02B290" : "currentColor"}
                className="droptitle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </div>
        ) : (
          <Link to={data.link} className="stylenone navItem">
            <h3>{data.title}</h3>
          </Link>
        )}
        {/* {show && <div className='border'></div>} */}
      </div>

      {show && data.items && data.items.length > 0 && (
        <div className="s2">
          <div className="category-grid">
            {/* Sort categories: No subcategories first, then by subcategory count */}
            {data.items
              .sort((a, b) => {
                const aSubLength = a.category.SubCategoryDetail
                  ? a.category.SubCategoryDetail.length
                  : 0;
                const bSubLength = b.category.SubCategoryDetail
                  ? b.category.SubCategoryDetail.length
                  : 0;

                if (aSubLength === 0 && bSubLength > 0) return -1; // No subcategories first
                if (bSubLength === 0 && aSubLength > 0) return 1; // Categories with subcategories later
                return aSubLength - bSubLength; // Sort by subcategory count (ascending)
              })
              .map((item, index) => (
                <div
                  key={index}
                  className="category"
                >
                  <Link
                    to={`/Home/${item.category.Categoryshorturl}/all/list`}
                    className="stylenone"
                    onClick={() =>{ onCategorySelect(item.category.Name)
                      setShow(false);}}
                  >
                    <h3 style={{ fontSize: "17px", color: "#02B290" }}>
                      <b>{item.category.Name}</b>
                    </h3>
                  </Link>
                  {item.category.SubCategoryDetail &&
                    item.category.SubCategoryDetail.length > 0 && (
                      <div className="subcategory-list">
                        {(expanded[item.category.Categoryshorturl]
                          ? item.category.SubCategoryDetail
                          : item.category.SubCategoryDetail.slice(0, 2)
                        )
                          .sort((a, b) => a.Name.localeCompare(b.Name))
                          .map((subcategory, subIndex) => (
                            <Link
                              key={subIndex}
                              to={`/Home/${item.category.Categoryshorturl}/${subcategory.Subcatgeoryshorturl}/list`}
                              className="stylenone padt"
                              onClick={() =>
                                onCategorySelect(item.category.Name)
                              }
                            >
                              <h3
                                style={{
                                  fontSize: "15px",
                                  margin: "3px 0",
                                  textAlign: "left",
                                }}
                              >
                                {subcategory.Name}
                              </h3>
                            </Link>
                          ))}

                        {item.category.SubCategoryDetail.length > 2 && (
                          <div
                            className="view-more"
                            style={{
                              color: "#FF007F",
                              cursor: "pointer",
                              fontSize: "14px",
                              marginTop: "5px",
                            }}
                            onClick={() =>
                              setExpanded((prev) => ({
                                ...prev,
                                [item.category.Categoryshorturl]:
                                  !prev[item.category.Categoryshorturl],
                              }))
                            }
                          >
                            {expanded[item.category.Categoryshorturl]
                              ? "View Less"
                              : "View More"}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;
