import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../utils/api";

export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/admins?page=${page}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.admin || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, clearError } = adminSlice.actions;
export default adminSlice.reducer;

// Selectors
export const selectAdmins = (state) => state.admin.admins;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectAdminCurrentPage = (state) => state.admin.currentPage;
export const selectAdminTotalPages = (state) => state.admin.totalPages;
