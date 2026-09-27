import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signupApi,
  loginApi,
  verifyOtpApi,
  logoutApi,
} from "../../services/authService";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      return await signupApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await verifyOtpApi(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    hydrateAuth: (state, action) => {
      const user = action.payload;
      const token = localStorage.getItem("token");
      state.user = user || null;
      state.token = token || null;
      state.isAuthenticated = !!token;
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // VERIFY OTP
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.data.token);
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { setCredentials, logout, clearError, hydrateAuth } =
  authSlice.actions;
export default authSlice.reducer;