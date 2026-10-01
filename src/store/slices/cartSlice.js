import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../../services/cartService";

export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getCartApi();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (payload, { rejectWithValue }) => {
    try {
      return await addToCartApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await updateCartItemApi(productId, quantity);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeItem",
  async (productId, { rejectWithValue }) => {
    try {
      return await removeCartItemApi(productId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      return await clearCartApi();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  count: 0,
  loading: false,
  saving: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,
    // ✅ NEW — instantly reset cart state after successful Stripe payment
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
      state.count = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const apply = (state, action) => {
      const d = action.payload.data;
      state.items = d.items;
      state.subtotal = d.subtotal;
      state.discount = d.discount;
      state.total = d.total;
      state.count = d.count;
      state.loading = false;
      state.saving = false;
      state.error = null;
    };

    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, apply)
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCartThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(addToCartThunk.fulfilled, apply)
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemThunk.fulfilled, apply)
      .addCase(removeCartItemThunk.fulfilled, apply)
      .addCase(clearCartThunk.fulfilled, apply);
  },
});

export const { resetCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;