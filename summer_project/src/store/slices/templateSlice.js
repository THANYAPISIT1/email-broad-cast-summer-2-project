import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../utils/api";

export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${API_BASE_URL}/templates?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch templates"
      );
    }
  }
);

export const fetchTemplate = createAsyncThunk(
  "template/fetchTemplate",
  async (tid, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/templates/${tid}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch template"
      );
    }
  }
);

const templateSlice = createSlice({
  name: "template",
  initialState: {
    templates: [],
    currentTemplate: null,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    highlightedTemplate: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setHighlightedTemplate: (state, action) => {
      state.highlightedTemplate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  setHighlightedTemplate,
  clearError,
  clearCurrentTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;

export const selectTemplates = (state) => state.template.templates;
export const selectCurrentTemplate = (state) => state.template.currentTemplate;
export const selectTemplateLoading = (state) => state.template.loading;
export const selectTemplateError = (state) => state.template.error;
export const selectTemplateCurrentPage = (state) => state.template.currentPage;
export const selectTemplateTotalPages = (state) => state.template.totalPages;
export const selectHighlightedTemplate = (state) =>
  state.template.highlightedTemplate;
