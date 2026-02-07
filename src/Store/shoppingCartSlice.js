import { createSlice } from '@reduxjs/toolkit';

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];


const initialState = {
  items: savedCart,
  count: savedCart.reduce((acc, item) => acc + (item.Qty || 1), 0),
};
const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {


    
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
    

      if (!product || !product.data || !product.data.ProductCode) {
        console.error("addToCart received invalid product data:", product);
        return;
      }
    
      const existingItemIndex = state.items.findIndex(
        (item) => item.data.ProductCode === product.data.ProductCode
      );
    
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      console.log("Adding to cart:", product);

      state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
    
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartCount", JSON.stringify(state.count));
    },

    removeFromCart: (state, action) => {
      const productCode = action.payload;
      state.items = state.items.filter(item => item.data.ProductCode !== productCode);

      state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartCount", JSON.stringify(state.count));
    },

    updateQuantity: (state, action) => {
      const { productCode, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.data.ProductCode === productCode);
      
      if (itemIndex !== -1) {
        if (quantity > 0) {
          state.items[itemIndex].quantity = quantity;
        } else {
          state.items.splice(itemIndex, 1); // Remove item if quantity reaches 0
        }
      }
    
      state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartCount", JSON.stringify(state.count));
    },
    
    

    clearCart: (state) => {
      state.items = [];
      state.count = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("cartCount");
    },

    setCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : []; // Ensure it's an array
      state.count = state.items.length > 0 
        ? state.items.reduce((acc, item) => acc + (item.quantity || 0), 0) 
        : 0;
    
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartCount", JSON.stringify(state.count));
    },
    

    setCartCount: (state, action) => {
      state.count = action.payload || 0;
      localStorage.setItem("cartCount", JSON.stringify(state.count));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems, setCartCount } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
