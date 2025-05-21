import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from './store';
import {Alert} from 'react-native';

interface SecurityCompanyProps {
  _id: string;
  companyName: string;
  address: string;
  psiraNumber: string;
  contactPerson: string;
  phone: string;
  servicesOffered: string[];
  branches: string[];
  officers: string[];
  isVerified: boolean;
  isDeclined: boolean;
}

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  items: any[];
  loading: boolean;
  error: ErrorProps | null;
  securityCompanyDetails: SecurityCompanyProps | null;
  deleteId: string | null;
  isVerified: boolean;
  isDeclined: boolean;
}

// Initial state
const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
  securityCompanyDetails: null,
  deleteId: null,
  isVerified: false,
  isDeclined: false,
};

export const fetchAdminSecurityCompanies = createAsyncThunk(
  'securityCompany/fetchAdminSecurityCompanies',
  async () => {
    try {
      const response = await axiosInstance.get('/security-company/v1/list-all');
      return response.data;
    } catch (error: any) {
      console.log({error});
    }
  },
);
export const verifySecurityCompany = createAsyncThunk(
  'securityCompany/verifySecurityCompany',
  async (companyId: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(
        `/security-company/v1/verify/${companyId}`,
      );
      return response.data;
    } catch (error: any) {
      console.log({error});
      return rejectWithValue(error.response.data);
    }
  },
);

export const declineSecurityCompany = createAsyncThunk(
  'securityCompany/declineSecurityCompany',
  async (companyId: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(
        `/security-company/v1/decline/${companyId}`,
      );
      return response.data;
    } catch (error: any) {
      console.log({error});
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteSecurityCompany = createAsyncThunk(
  'deleteClient',
  async (companyId: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.delete(
        `/security-company/v1/${companyId}`,
      );

      return {id: companyId, ...response.data};
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAllSecurityCompany = createAsyncThunk(
  'securityCompany/fetchAllSecurityCompany',
  async () => {
    try {
      const response = await axiosInstance.get('/security-company/v1/list');
      return response.data;
    } catch (error: any) {
      console.log({error});
    }
  },
);

export const fetchSecurityCompanyByID = createAsyncThunk(
  'securityCompany/fetchSecurityCompanyByID',
  async (companyId: string | undefined) => {
    try {
      const response = await axiosInstance.get(
        `/security-company/v1/${companyId}`,
      );
      return response.data;
    } catch (error: any) {
      console.log({error});
    }
  },
);

const isAPendingAction = isPending(
  fetchAllSecurityCompany,
  fetchSecurityCompanyByID,
);

const isARejectedAction = isRejected(
  fetchAllSecurityCompany,
  fetchSecurityCompanyByID,
);

const securityCompanySlice = createSlice({
  name: 'securityCompany',
  initialState,
  reducers: {
    updateCompanyList: (state, action) => {
      console.log('updateClientList', action);
      state.items = action.payload;
      state.deleteId = null;
    },
    updateVerifyStatus: (state, action) => {
      console.log('updateVerifyStatus', action);
      state.isVerified = action.payload;
    },
    updateDeclineStatus: (state, action) => {
      console.log('updateDeclineStatus', action);
      state.isDeclined = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAdminSecurityCompanies.fulfilled, (state, action) => {
      console.log('fetchAdminSecurityCompanies', action.payload);
      state.loading = false;
      state.items = action.payload.companies.filter(
        item => item.verificationStatus === 'verified',
      );
    });
    builder.addCase(deleteSecurityCompany.fulfilled, (state, action) => {
      console.log('deleteSecurityCompany', action.payload);
      state.loading = false;
      state.deleteId = action.payload.id;
    });
    builder.addCase(verifySecurityCompany.fulfilled, (state, action) => {
      console.log('verifySecurityCompany', action.payload);
      state.loading = false;
      state.isVerified = true;
    });
    builder.addCase(fetchAllSecurityCompany.fulfilled, (state, action) => {
      // console.log('fetchAllSecurityCompany', action.payload);
      state.loading = false;
      state.items = action.payload.companies;
    });

    builder.addCase(fetchSecurityCompanyByID.fulfilled, (state, action) => {
      state.loading = false;
      state.securityCompanyDetails = action.payload.data;
    });

    builder.addCase(declineSecurityCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeclined = true;
    });

    builder.addMatcher(isAPendingAction, state => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isARejectedAction, (state, action) => {
      console.log('action', action.payload);
      state.loading = false;
      state.error = action.payload as ErrorProps;
    });
  },
});
export const {updateCompanyList, updateVerifyStatus, updateDeclineStatus} =
  securityCompanySlice.actions;
export default securityCompanySlice.reducer;
