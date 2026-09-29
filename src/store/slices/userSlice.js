import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
  uploadAvatarApi,
} from "../../services/userService";

export const fetchProfileThunk = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getProfileApi();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfileApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "user/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await changePasswordApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password"
      );
    }
  }
);

export const uploadAvatarThunk = createAsyncThunk(
  "user/uploadAvatar",
  async (file, { rejectWithValue }) => {
    try {
      return await uploadAvatarApi(file);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to upload avatar"
      );
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfileThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = action.payload.data;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(changePasswordThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.saving = false;
        state.successMessage = "Password changed successfully";
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(uploadAvatarThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = action.payload.data;
        state.successMessage = "Avatar updated";
      })
      .addCase(uploadAvatarThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserStatus } = userSlice.actions;
export default userSlice.reducer;