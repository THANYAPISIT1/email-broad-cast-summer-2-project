import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { API_BASE_URL } from "../../utils/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ AUsername, APassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        AUsername,
        APassword,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);

      return {
        token,
        user: decodedToken,
        isAuthenticated: true,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ AEmail, AUsername, APassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        AEmail,
        AUsername,
        APassword,
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch {
    return false;
  }
};

const getInitialState = () => {
  const token = localStorage.getItem("token");
  const isValid = isTokenValid(token);

  if (!isValid && token) {
    localStorage.removeItem("token");
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  let user = null;
  if (token && isValid) {
    try {
      user = jwtDecode(token);
    } catch {
      localStorage.removeItem("token");
    }
  }

  return {
    user,
    token: isValid ? token : null,
    isAuthenticated: isValid,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    checkTokenExpiry: (state) => {
      if (state.token && !isTokenValid(state.token)) {
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = "Session expired";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, checkTokenExpiry } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
