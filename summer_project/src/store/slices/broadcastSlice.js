import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../utils/api";

export const fetchBroadcasts = createAsyncThunk(
  "broadcast/fetchBroadcasts",
  async (params, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const {
        page = 1,
        status = null,
        dateRange = null,
        tags = [],
        filter = null,
      } = params;

      const queryParams = { page };

      if (status) queryParams.status = status;
      if (dateRange && dateRange[0] && dateRange[1]) {
        queryParams.daterange = `${dateRange[0].toISOString()},${dateRange[1].toISOString()}`;
      }
      if (tags.length > 0) {
        queryParams.tag = tags.map((tag) => tag.value || tag).join(",");
      }
      if (filter) queryParams.filter = filter;

      const response = await axios.get(`${API_BASE_URL}/broadcasts`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch broadcasts"
      );
    }
  }
);

export const fetchFilterTags = createAsyncThunk(
  "broadcast/fetchFilterTags",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/filtertags`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.BTags || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags"
      );
    }
  }
);

const broadcastSlice = createSlice({
  name: "broadcast",
  initialState: {
    broadcasts: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,

    filters: {
      selectedTags: [],
      selectedStatus: null,
      selectedFilter: null,
      selectedDateRange: [null, null],
    },

    availableTags: [],
    tagsLoading: false,

    createBroadcast: {
      recipientTitle: "",
      selectedLevel: null,
      email: "",
      tag: "",
      blacklist: "",
      recipientEveryone: "",
      contentName: "",
      selectedTemplate: null,
      broadcastName: "Untitled Broadcast",
      fromName: "",
      sqlDate: null,
    },
  },
  reducers: {
    setSelectedTags: (state, action) => {
      state.filters.selectedTags = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.filters.selectedStatus = action.payload;
    },
    setSelectedFilter: (state, action) => {
      state.filters.selectedFilter = action.payload;
    },
    setSelectedDateRange: (state, action) => {
      state.filters.selectedDateRange = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setRecipientTitle: (state, action) => {
      state.createBroadcast.recipientTitle = action.payload;
    },
    setSelectedLevel: (state, action) => {
      state.createBroadcast.selectedLevel = action.payload;
    },
    setEmail: (state, action) => {
      state.createBroadcast.email = action.payload;
    },
    setTag: (state, action) => {
      state.createBroadcast.tag = action.payload;
    },
    setBlacklist: (state, action) => {
      state.createBroadcast.blacklist = action.payload;
    },
    setRecipientEveryone: (state, action) => {
      state.createBroadcast.recipientEveryone = action.payload;
    },
    setContentName: (state, action) => {
      state.createBroadcast.contentName = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.createBroadcast.selectedTemplate = action.payload;
    },
    setBroadcastName: (state, action) => {
      state.createBroadcast.broadcastName = action.payload;
    },

    resetFilters: (state) => {
      state.filters = {
        selectedTags: [],
        selectedStatus: null,
        selectedFilter: null,
        selectedDateRange: [null, null],
      };
      state.currentPage = 1;
    },
    resetCreateBroadcast: (state) => {
      state.createBroadcast = {
        recipientTitle: "",
        selectedLevel: null,
        email: "",
        tag: "",
        blacklist: "",
        recipientEveryone: "",
        contentName: "",
        selectedTemplate: null,
        broadcastName: "Untitled Broadcast",
        fromName: "",
        sqlDate: null,
      };
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBroadcasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBroadcasts.fulfilled, (state, action) => {
        state.loading = false;
        state.broadcasts = action.payload.broadcasts || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchBroadcasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilterTags.pending, (state) => {
        state.tagsLoading = true;
      })
      .addCase(fetchFilterTags.fulfilled, (state, action) => {
        state.tagsLoading = false;
        state.availableTags = action.payload.map((tag) => ({
          label: tag.BTag,
          value: tag.BTag,
        }));
      })
      .addCase(fetchFilterTags.rejected, (state, action) => {
        state.tagsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedTags,
  setSelectedStatus,
  setSelectedFilter,
  setSelectedDateRange,
  setCurrentPage,
  setRecipientTitle,
  setSelectedLevel,
  setEmail,
  setTag,
  setBlacklist,
  setRecipientEveryone,
  setContentName,
  setSelectedTemplate,
  setBroadcastName,
  resetFilters,
  resetCreateBroadcast,
  clearError,
} = broadcastSlice.actions;

export default broadcastSlice.reducer;

export const selectBroadcasts = (state) => state.broadcast.broadcasts;
export const selectBroadcastLoading = (state) => state.broadcast.loading;
export const selectBroadcastError = (state) => state.broadcast.error;
export const selectCurrentPage = (state) => state.broadcast.currentPage;
export const selectTotalPages = (state) => state.broadcast.totalPages;
export const selectFilters = (state) => state.broadcast.filters;
export const selectAvailableTags = (state) => state.broadcast.availableTags;
export const selectCreateBroadcast = (state) => state.broadcast.createBroadcast;
