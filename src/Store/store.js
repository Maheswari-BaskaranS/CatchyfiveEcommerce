import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlistSlice'
import shoppingCartReducer from './shoppingCartSlice'

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    shoppingCart: shoppingCartReducer,
  },
});

export default store;
