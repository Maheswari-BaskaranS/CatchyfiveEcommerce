import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartReloadState } from "../../Providers/CartReload";
import "./CartItem.css";
import { cartPopupState } from "../../Providers/CartPopupProvider";
import noimage from "../../ASSETS/noimage.png";
import { Grid, Typography, Button, TextField } from "@mui/material";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { APPEnv } from "../config";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../Store/shoppingCartSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
  zIndex: 9999,
};

const CustomPrevArrow = (props) => (
  <div className="custom-arrow custom-prev" onClick={props.onClick}>
    <ArrowBackIosNewIcon />
  </div>
);

const CustomNextArrow = (props) => (
  <div className="custom-arrow custom-next" onClick={props.onClick}>
    <ArrowForwardIosIcon />
  </div>
);

const CartItem = ({ itemdata, getcartdata }) => {
    const dispatch = useDispatch();
  const [showdelete, setshowdelete] = useState(false);
  const [cartreload, setcartreload] = useRecoilState(cartReloadState);
  const [open, setOpen] = React.useState(false);
  const [showreview, setshowreview] = React.useState(false);

  const [productData, setProductdata] = useState(null);
  const [popCount, setPopCount] = useState(1);
  const [count, setCount] = useState(1);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  useEffect(() => {
    // Code to run when the component mounts
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      cart.forEach((item) => {
        if (
          item.data.ProductCode === itemdata.data.ProductCode &&
          item.data.quantity > 0
        ) {
          //   setshow(true);
          setCount(item.quantity);
        }
      });
    }
  }, []);

  const getProductById = async (code) => {
    fetch(
      APPEnv.baseUrl +
        "/Product/GetAllWithImageV2?OrganizationId=" +
        process.env.REACT_APP_BACKEND_ORGANIZATION +
        "&ProductCode=" +
        code,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.Code == 200) {
          setProductdata(data.Result[0]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [PopProducts, setproducts] = useState([]);

  const getProducts = () => {
    fetch(
      APPEnv.baseUrl +
        "/Product/GetAllWithImageV2?OrganizationId=" +
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
        setproducts(data.Result);
      });
  };

  const handleOpen = (code) => {
    getProductById(code);
    getProducts();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const addtocartPop = () => {
    let user = localStorage.getItem("token");
    user = JSON.parse(user);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const itemInCart = cart.find(
      (item) => item.data.ProductCode === productData.ProductCode
    );

    if (itemInCart) {
      itemInCart.quantity += count;
    } else {
      cart.push({ data: productData, quantity: count });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    const payload = {
      OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
      CartCode: itemdata.data.CartCode || "",
      CustomerCode: user[0].B2CCustomerId, // Fetch CustomerCode from user
      Qty: itemInCart ? itemInCart.quantity : count, // Ensure correct quantity
      Price: itemdata.data.Price || "",
      SellingCost: itemdata.data.SellingCost,
      ProductCode: itemdata.data.ProductCode,
      ProductName: itemdata.data.ProductName,
      IsActive: true,
      CreatedUser: user[0].B2CCustomerName || "",
      ModifiedUser: user[0].B2CCustomerName || "",
      ProductImage: itemdata.data.ProductImage || "",
      Createdon: itemdata.data.CreatedOn || "",
      Modifiedon: itemdata.data.ModifiedOn || "",
      ChangedOnString: itemdata.data.ChangedOnString || "",
      CreatedOnString: itemdata.data.CreatedOnString || "",
    };

    fetch(APPEnv.baseUrl + "/CartDetails/CreateCartDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData.Code === 200) {
          toast.success("Product added to Cart", {
            position: "top-right",
            autoClose: 1000,
          });
          getcartitems(); 
          setOpen(false); 

          setCount(itemInCart ? itemInCart.quantity - 1 : count - 1);
        }
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
        toast.error("Product could not be added to cart", {
          position: "top-right",
          autoClose: 1000,
        });
      });

  };

  const getcartitems = async () => {
    let user = localStorage.getItem("token");
    user = JSON.parse(user);

    if (user) {
      try {
        const response = await fetch(
          APPEnv.baseUrl +
            "/CartDetails/Getbycode?OrganizationId=" +
            process.env.REACT_APP_BACKEND_ORGANIZATION +
            "&Code=" +
            user[0].B2CCustomerId
        );
        const data = await response.json();

        if (data && data.Data) {
          let qty = 0;
          data.Data.forEach((item) => {
            qty += item.Qty;
          });
        }
      } catch (error) {
        console.error("Error fetching cart items from the backend:", error);
      }
    }

  };

  const deleteitem = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let newcart = cart.filter(
      (item) => item.data.ProductCode !== itemdata.data.ProductCode
    );
    dispatch(removeFromCart(itemdata?.data?.ProductCode))
    localStorage.setItem("cart", JSON.stringify(newcart));

    // Refresh cart data and items
    getcartdata();
    getcartitems();
  };

  const increaseqty = async () => {
    let user = localStorage.getItem("token");
    user = JSON.parse(user);

    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach((item) => {
      if (item.data.ProductCode === itemdata.data.ProductCode) {
        item.quantity = item.quantity + 1;
      }
    });
    const itemInCart = cart.find(
      (item) => item.data.ProductCode === itemdata.data.ProductCode
    );
    localStorage.setItem("cart", JSON.stringify(cart));
    try {
      // Make the API call to update the item quantity in the backend cart
      const response = await fetch(
        APPEnv.baseUrl + "/CartDetails/CreateCartDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
            CartCode: itemdata.data.CartCode || "",
            CustomerCode: user[0].B2CCustomerId, // Pass the CustomerCode from the logged-in user's data
            Qty: itemInCart.quantity, // Updated quantity
            Price: itemdata.data.Price || "",
            SellingCost: itemdata.data.SellingCost,
            CreatedUser: "", //user[0].B2CCustomerName
            ModifiedUser: "", //user[0].B2CCustomerName
            ProductCode: itemdata.data.ProductCode,
            ProductName: itemdata.data.ProductName,
            IsActive: true,
            CreatedUser: itemdata.data.CreatedUser || "",
            ModifiedUser: itemdata.data.ModifiedUser || "",
            ProductImage: itemdata.data.ProductImage || "",
            Createdon: itemdata.data.CreatedOn || "",
            Modifiedon: itemdata.data.ModifiedOn || "",
            ChangedOnString: itemdata.data.ChangedOnString || "",
            CreatedOnString: itemdata.data.CreatedOnString || "",
          }),
        }
      );

      const responseData = await response.json();
      dispatch(updateQuantity({ productCode: itemdata?.data?.ProductCode, quantity: itemdata?.quantity + 1 }))
      if (responseData.Code === 200) {
        getcartitems(); // Fetch updated cart items from the backend
        toast.success("Product Added to Cart", {
          position: "top-right",
          autoClose: 500,
        });
        
      }
    } catch (err) {
      console.log("Error updating cart:", err);
      toast.error("Error updating cart", {
        position: "top-right",
        autoClose: 1000,
      });
    }
    getcartdata();
    // getcartitems()
  };

  const decreaseqty = async () => {
    let user = localStorage.getItem("token");
    user = JSON.parse(user);
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemInCart = cart.find(
      (item) => item.data.ProductCode === itemdata.data.ProductCode
    );
  
    if (itemInCart) {
      if (itemInCart.quantity > 1) {
        // Dispatch Redux action to update quantity in state
        dispatch(updateQuantity({ productCode: itemdata?.data?.ProductCode, quantity: itemdata?.quantity - 1 }));
  
        // Decrement the quantity and update localStorage
        itemInCart.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
  
        try {
          // Call API to update quantity
          const response = await fetch(
            `${APPEnv.baseUrl}/CartDetails/CreateCartDetails`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                OrgId: process.env.REACT_APP_BACKEND_ORGANIZATION,
                CartCode: itemdata.data.CartCode || "",
                CustomerCode: user[0].B2CCustomerId,
                Qty: itemInCart.quantity,
                Price: itemdata.data.Price || "",
                SellingCost: itemdata.data.SellingCost,
                ProductCode: itemdata.data.ProductCode,
                ProductName: itemdata.data.ProductName,
                IsActive: true,
                CreatedUser: itemdata.data.CreatedUser || "",
                ModifiedUser: itemdata.data.ModifiedUser || "",
                ProductImage: itemdata.data.ProductImage || "",
                Createdon: itemdata.data.CreatedOn || "",
                Modifiedon: itemdata.data.ModifiedOn || "",
                ChangedOnString: itemdata.data.ChangedOnString || "",
                CreatedOnString: itemdata.data.CreatedOnString || "",
              }),
            }
          );
  
          const responseData = await response.json();
          if (responseData.Code === 200) {
            toast.success("Product Added to Cart", {
              position: "top-right",
              autoClose: 500,
            });
  
            // Refresh cart data
            getcartdata();
            getcartitems();
          }
        } catch (err) {
          toast.error("Error updating cart", {
            position: "top-right",
            autoClose: 1000,
          });
          console.error("Error updating cart:", err);
        }
      } else if (itemInCart.quantity === 1) {
        // Dispatch Redux action to remove the item from state
        dispatch(removeFromCart(itemdata?.data?.ProductCode));
  
        try {
          const response = await fetch(
            `${APPEnv.baseUrl}/CartDetails/RemoveByProductCode?OrganizationId=${process.env.REACT_APP_BACKEND_ORGANIZATION}&CustomerCode=${user[0].B2CCustomerId}&ProductCode=${itemdata.data.ProductCode}`
          );
          const responseData = await response.json();
  
          if (responseData.Code === 200) {
            // Remove from local storage
            cart = cart.filter(
              (item) => item.data.ProductCode !== itemdata.data.ProductCode
            );
            localStorage.setItem("cart", JSON.stringify(cart));
  
            toast.success("Product removed from cart", {
              position: "top-right",
              autoClose: 1000,
            });
  
            getcartdata();
            getcartitems();
          }
        } catch (err) {
          toast.error("Error removing product from cart", {
            position: "top-right",
            autoClose: 1000,
          });
          console.error("Error removing product from cart:", err);
        }
      }
    }
  
    // Refresh the cart
    getcartitems();
  };
  

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ zIndex: "9999" }}
      >
        <Box sx={style} className="pop-responsive">
          {productData ? (
            <>
              {productData && (
                <Grid container width="98%">
                  <Grid item sm={12} md={8}>
                    <Grid container direction="row">
                      <Grid
                        item
                        md={2.5}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid
                            item
                            p={2}
                            m={1}
                            sx={{ border: "1px solid #02b290" }}
                          >
                            <img
                              src={productData.ProductImagePath}
                              alt=""
                              width="90px"
                              height="110px"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={9} m={1}>
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            border: "1px solid #02b290",
                            padding: "100px 0",
                          }}
                        >
                          <img
                            src={productData.ProductImagePath}
                            alt=""
                            width="230px"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        fontSize: "18px",
                        wordBreak: "break-all",
                      }}
                    >
                      {productData.Name}
                    </Typography>
                    {/* <Typography>1 each</Typography> */}
                    <Typography sx={{ fontWeight: "bolder", fontSize: "20px" }}>
                      S${productData.SellingCost}
                    </Typography>
                    <Typography sx={{ color: "#F98F60", padding: "10px 0" }}>
                      only items left
                    </Typography>
                    <Grid
                      className="calc-box"
                      container
                      sx={{ borderRadius: "5px" }}
                    >
                      <Grid item>
                        <RemoveIcon
                          sx={{ fontSize: "30px", cursor: "pointer" }}
                          onClick={() => {
                            if (popCount > 0) {
                              setPopCount(popCount - 1);
                              decreaseqty();
                            }
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontSize: "22px" }}>
                          {popCount}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <AddIcon
                          sx={{ fontSize: "30px", cursor: "pointer" }}
                          onClick={() => {
                            if (
                              productData?.EcommerceDetail &&
                              productData.EcommerceDetail[0].StockAvailability
                            ) {
                              if (
                                popCount <
                                productData.EcommerceDetail[0].QtyOnHand
                              ) {
                                setPopCount(popCount + 1);
                              } else {
                                toast.error(
                                  "You have reached maximum quantity",
                                  {
                                    position: "bottom-right",
                                    autoClose: 1000,
                                  }
                                );
                              }
                            } else {
                              setPopCount(popCount + 1);
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      className="cart-box"
                      container
                      onClick={() => {
                        addtocartPop();
                      }}
                    >
                      <Grid item>
                        <ShoppingBagOutlinedIcon />
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Add to Cart
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Grid className="pop-box" item md={5.5}>
                        <FavoriteBorderIcon />
                        <Typography>Wishlist</Typography>
                      </Grid>
                      <Grid className="pop-box" item md={5.5}>
                        <ReplyOutlinedIcon />
                        <Typography>Share</Typography>
                      </Grid>
                    </Grid>

                    <Grid pt={2}>
                      <Typography sx={{ fontWeight: "600" }}>
                        Product Details:
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography>
                        {(productData &&
                          productData.EcommerceDetail[0].Desciption) ||
                          "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {showreview ? (
                <>
                  <Grid container pt={2} pb={2} justifyContent="space-between">
                    <Grid item md={5.5}>
                      <Typography
                        sx={{ padding: "20px 0px", fontSize: "20px" }}
                      >
                        Submit Your review
                      </Typography>
                      <Grid container>
                        <TextField
                          required
                          fullWidth
                          id="outlined-required"
                          label="Name"
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          required
                          fullWidth
                          id="outlined-required"
                          label="Email"
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          required
                          fullWidth
                          id="outlined-required"
                          label="Review"
                          sx={{ marginBottom: "20px" }}
                        />
                        <Rating
                          name="no-value"
                          value={null}
                          sx={{ fontSize: "50px" }}
                        />
                      </Grid>
                      <Button
                        sx={{
                          margin: "10px 0",
                          padding: "8px 30px",
                          backgroundColor: "#02b290",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item md={5.5}>
                      <Typography
                        sx={{ padding: "20px 0px", fontSize: "20px" }}
                      >
                        Product reviews
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              <Grid sx={{ margin: "30px 0 " }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "25px" }}>
                  Related products
                </Typography>
              </Grid>
              <Grid className="slider-container">
                {PopProducts.length > 0 ? (
                  <>
                    <Slider {...settings}>
                      {PopProducts &&
                        PopProducts.length &&
                        PopProducts.map((item, index) => (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              sm={4}
                              md={3}
                              lg={3}
                              xl={2.4}
                              key={index}
                              className="image-hover-effect"
                              sx={{ margin: "10px", minWidth: "200px" }}
                            >
                              <Card sx={{ cursor: "pointer" }}>
                                <CardContent>
                                  <Grid container direction="column">
                                    <Grid
                                      item
                                      sx={{
                                        display: "flex",
                                        justifyContent: "unset",
                                      }}
                                    >
                                      <div>
                                        <img
                                          src={item.ProductImagePath || noimage}
                                          alt="c1"
                                          width="170px"
                                          height="160px"
                                          style={{
                                            objectFit: "cover",
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            paddingLeft: "10px",
                                          }}
                                          className="image-hover-effect"
                                        />
                                      </div>
                                    </Grid>
                                    <Grid
                                      item
                                      sx={{
                                        zIndex: "9999",
                                        paddingTop: "10px",
                                      }}
                                    >
                                      <Grid
                                        container
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "space-between",
                                          minHeight: "150px",
                                        }}
                                      >
                                        <Grid item>
                                          <Typography
                                            sx={{
                                              fontWeight: "bold",
                                              lineHeight: "1.5rem",
                                              fontSize: "1rem",
                                            }}
                                          >
                                            S${item.PcsPrice} - S$
                                            {item.SellingCost}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              padding: " 10px 0px",
                                              color: "#595959",
                                              fontSize: "14px",
                                              wordBreak: "break-all",
                                            }}
                                          >
                                            {item.Name}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography>1 each</Typography>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            </Grid>
                          </div>
                        ))}
                    </Slider>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </>
          ) : (
            <>
              <LinearProgress />
            </>
          )}
        </Box>
      </Modal>

      <div
        className="cartitem"
        style={{ borderBottom: "0.2px solid rgb(128, 128, 128)" }}
      >
        <div
          className="s1"
          onMouseEnter={() => setshowdelete(true)}
          onMouseLeave={() => setshowdelete(false)}
          style={{ borderRadius: "6px" }}
        >
          <img
            src={
              itemdata.data.ProductImageFileName != "NoImage.jpg" &&
              itemdata.data.ProductImageFileName !== ""
                ? itemdata.data.ProductImagePath
                : noimage
            }
            alt="no img"
          />
          {showdelete && (
            <div className="removeitem">
              <button 
            onClick={deleteitem}
             >
                <CloseIcon sx={{ fontSize: "15px" }} />
              </button>
            </div>
          )}
        </div>
        <Grid container direction="column" sx={{ padding: "0px 10px" }}>
          <Grid item>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item md={9}>
                <Typography
                  className="ProdName"
                  onClick={(e) => {
                    handleOpen(itemdata.data.ProductCode);
                  }}
                >
                  {itemdata.data.ProductName}
                </Typography>
              </Grid>
              <Grid
                item
                md={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  S$
                  {(itemdata?.data?.SellingCost * itemdata.quantity).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{ padding: "10px 0" }}
                >
                  <RemoveIcon
                    sx={{
                      border: "1px solid grey",
                      borderRadius: "50%",
                      color: "#767676",
                      fontSize: "22px",
                    }}
                    onClick={() => {
                      decreaseqty();
                      // window.location.reload();
                    }}
                   
                  />
                  <Typography
                    sx={{ padding: "0px 10px", fontWeight: "bold" }}
                    onClick={(e) => {
                      handleOpen(itemdata.data.ProductCode);
                    }}
                  >
                    {itemdata.quantity}
                  </Typography>
                  <AddIcon
                    sx={{
                      border: "1px solid grey",
                      borderRadius: "50%",
                      color: "#767676",
                      fontSize: "22px",
                    }}
                    onClick={increaseqty}
                 
                  />
                </Grid>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </div>
    </>
  );
};

export default CartItem;
