import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminUsersApi,
  getAdminUserByIdApi,
} from "../../services/adminUserService";

export const fetchAdminUsersThunk = createAsyncThunk(
  "adminUser/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getAdminUsersApi(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load users"
      );
    }
  }
);

export const fetchAdminUserByIdThunk = createAsyncThunk(
  "adminUser/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await getAdminUserByIdApi(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load user"
      );
    }
  }
);

const initialState = {
  list: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  current: null,
  loading: false,
  error: null,
};

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    clearCurrentAdminUser: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.items;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchAdminUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
      })
      .addCase(fetchAdminUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentAdminUser } = adminUserSlice.actions;
export default adminUserSlice.reducer;