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

const emptyCartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  count: 0,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: () => initialState,

    // 🔑 Local-only clear (instant reset, no backend call)
    // Used only as an emergency fallback
    clearCart: (state) => {
      Object.assign(state, emptyCartState);
    },
  },
  extraReducers: (builder) => {
    // 🔑 Helper: safely extract cart data from various payload shapes
    const apply = (state, action) => {
      const payload = action.payload;
      // Backend might return: { data: {...} } OR { items: [...], ... } OR null
      const d = payload?.data || payload || {};

      state.items = d.items || [];
      state.subtotal = Number(d.subtotal) || 0;
      state.discount = Number(d.discount) || 0;
      state.total = Number(d.total) || 0;
      state.count = Number(d.count) || (d.items?.length ?? 0);
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

      // 🔑 CLEAR CART — force empty state regardless of backend response shape
      .addCase(clearCartThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        Object.assign(state, emptyCartState);
        state.saving = false;
        state.loading = false;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;