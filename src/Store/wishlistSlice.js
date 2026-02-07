import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   count: JSON.parse(localStorage.getItem("wishlistCount")) || 0, 
//   items: JSON.parse(localStorage.getItem("wishlist")) || [],
// };
const initialState = {
  count: 0,
  items: [],
};


const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.some(item => item.ProductCode === action.payload.ProductCode);
      if (!exists) {
        state.items.push(action.payload);
        state.count += 1;
        localStorage.setItem("wishlist", JSON.stringify(state.items));
        localStorage.setItem("wishlistCount", JSON.stringify(state.count));
      }
    },
    removeFromWishlist: (state, action) => {
      const updatedItems = state.items.filter(item => item.ProductCode !== action.payload);
      state.items = updatedItems;
      state.count = updatedItems.length; // Update count correctly
      localStorage.setItem("wishlist", JSON.stringify(updatedItems));
      localStorage.setItem("wishlistCount", JSON.stringify(state.count));
    },
    setWishlistCount: (state, action) => {
      state.count = action.payload || 0; // Ensure count is a valid number
      localStorage.setItem("wishlistCount", JSON.stringify(state.count));
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload || [];
      state.count = state.items.length; // Sync count with items
      localStorage.setItem("wishlist", JSON.stringify(state.items));
      localStorage.setItem("wishlistCount", JSON.stringify(state.count));
    },
    incrementWishlistCount: (state) => {
      state.count += 1;
      localStorage.setItem("wishlistCount", JSON.stringify(state.count));
    },
    decrementWishlistCount: (state) => {
      state.count = Math.max(0, state.count - 1);
      localStorage.setItem("wishlistCount", JSON.stringify(state.count));
    },
    updateWishlistCount: (state, action) => {
      state.count = action.payload || 0;
      localStorage.setItem("wishlistCount", JSON.stringify(state.count));
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  setWishlistCount,
  setWishlistItems,
  incrementWishlistCount,
  decrementWishlistCount,
  updateWishlistCount,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
