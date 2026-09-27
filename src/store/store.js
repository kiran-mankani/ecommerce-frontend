import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";   // ← NEW

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,                          // ← NEW
  },
});