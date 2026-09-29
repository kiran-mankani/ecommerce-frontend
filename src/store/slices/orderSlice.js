import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderApi,
  getMyOrdersApi,
  getMyOrderByIdApi,
} from "../../services/orderService";

export const createOrderThunk = createAsyncThunk(
  "order/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createOrderApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to place order"
      );
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  "order/fetchMy",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getMyOrdersApi(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

export const fetchOrderByIdThunk = createAsyncThunk(
  "order/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await getMyOrderByIdApi(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load order"
      );
    }
  }
);

const initialState = {
  list: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  current: null,
  loading: false,
  saving: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload.data;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.items;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrderByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;