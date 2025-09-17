import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../utils/api";

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async ({ page = 1, selectedLevel = [] }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const tagsQuery =
        selectedLevel.length > 0
          ? `&selectedLevel=${selectedLevel
              .map((tag) => tag.value || tag)
              .join(",")}`
          : "";

      const response = await axios.get(
        `${API_BASE_URL}/customers?page=${page}${tagsQuery}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

export const fetchCustomer = createAsyncThunk(
  "customer/fetchCustomer",
  async (cusId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/customers/${cusId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.customer[0];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customer"
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ cusId, customerData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `${API_BASE_URL}/customers/${cusId}`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return { cusId, ...customerData };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update customer"
      );
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (cusId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.put(`${API_BASE_URL}/customers/delete/${cusId}`, null, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return cusId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete customer"
      );
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${API_BASE_URL}/customers`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    currentCustomer: null,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,

    selectedTags: [],

    editLoading: false,
    editError: null,
  },
  reducers: {
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.editError = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomer.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.editLoading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.editLoading = false;
        const index = state.customers.findIndex(
          (c) => c.CusID === action.payload.cusId
        );
        if (index !== -1) {
          state.customers[index] = {
            ...state.customers[index],
            ...action.payload,
          };
        }
        if (
          state.currentCustomer &&
          state.currentCustomer.CusID === action.payload.cusId
        ) {
          state.currentCustomer = {
            ...state.currentCustomer,
            ...action.payload,
          };
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.editLoading = false;
        state.customers = state.customers.filter(
          (c) => c.CusID !== action.payload
        );
        if (
          state.currentCustomer &&
          state.currentCustomer.CusID === action.payload
        ) {
          state.currentCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.editLoading = false;
        if (state.currentPage === 1) {
          state.customers.unshift(action.payload);
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      });
  },
});

export const {
  setSelectedTags,
  setCurrentPage,
  clearError,
  clearCurrentCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;

export const selectCustomers = (state) => state.customer.customers;
export const selectCurrentCustomer = (state) => state.customer.currentCustomer;
export const selectCustomerLoading = (state) => state.customer.loading;
export const selectCustomerError = (state) => state.customer.error;
export const selectCustomerCurrentPage = (state) => state.customer.currentPage;
export const selectCustomerTotalPages = (state) => state.customer.totalPages;
export const selectCustomerSelectedTags = (state) =>
  state.customer.selectedTags;
export const selectEditLoading = (state) => state.customer.editLoading;
export const selectEditError = (state) => state.customer.editError;
