import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminOrdersApi,
  getAdminOrderByIdApi,
  updateOrderStatusApi,
  deleteAdminOrderApi,
} from "../../services/adminOrderService";

export const fetchAdminOrdersThunk = createAsyncThunk(
  "adminOrder/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getAdminOrdersApi(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

export const fetchAdminOrderByIdThunk = createAsyncThunk(
  "adminOrder/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await getAdminOrderByIdApi(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load order"
      );
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  "adminOrder/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateOrderStatusApi(id, status);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const deleteAdminOrderThunk = createAsyncThunk(
  "adminOrder/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAdminOrderApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete order"
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

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    clearCurrentAdminOrder: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.items;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchAdminOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminOrderByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrderByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(fetchAdminOrderByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload.data;
        state.list = state.list.map((o) =>
          o._id === updated._id ? { ...o, orderStatus: updated.orderStatus } : o
        );
        if (state.current && state.current._id === updated._id) {
          state.current.orderStatus = updated.orderStatus;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(deleteAdminOrderThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteAdminOrderThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.list = state.list.filter((o) => o._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteAdminOrderThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentAdminOrder } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;