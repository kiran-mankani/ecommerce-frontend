import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../services/categoryService";

export const fetchCategoriesThunk = createAsyncThunk(
  "category/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getCategoriesApi(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load categories"
      );
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  "category/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCategoryApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  "category/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateCategoryApi(id, payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete category"
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CREATE
      .addCase(createCategoryThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createCategoryThunk.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // UPDATE
      .addCase(updateCategoryThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload.data;
        state.items = state.items.map((c) =>
          c._id === updated._id ? updated : c
        );
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((c) => c._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;