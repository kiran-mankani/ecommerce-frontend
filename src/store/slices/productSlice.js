import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../../services/productService";

export const fetchProductsThunk = createAsyncThunk(
  "product/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getProductsApi(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

export const createProductThunk = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createProductApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "product/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateProductApi(id, payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  items: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  loading: false,
  saving: false,
  error: null,
};

/* 🔑 Helper — safely extract items + pagination from any response shape */
const extractListPayload = (payload, currentPagination) => {
  const p = payload || {};
  const d = p.data || p;

  // Try common keys in order
  const items =
    d.items ||
    d.products ||
    d.results ||
    (Array.isArray(d) ? d : []) ||
    [];

  const pagination =
    d.pagination ||
    p.pagination ||
    {
      page: 1,
      limit: 10,
      total: items.length,
      pages: 1,
    };

  return { items, pagination };
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },

    // 🔑 Update stock after checkout
    updateProductStock: (state, action) => {
      const updates = action.payload; // [{ productId, name, newStock }]
      if (!Array.isArray(updates)) return;

      for (const update of updates) {
        const product = state.items.find(
          (p) => String(p._id) === String(update.productId)
        );
        if (product) {
          product.stock = update.newStock;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- FETCH ----------
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { items, pagination } = extractListPayload(
          action.payload,
          state.pagination
        );
        state.items = items;
        state.pagination = pagination;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- CREATE ----------
      .addCase(createProductThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createProductThunk.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // ---------- UPDATE ----------
      .addCase(updateProductThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateProductThunk.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // ---------- DELETE ----------
      .addCase(deleteProductThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, updateProductStock } = productSlice.actions;
export default productSlice.reducer;