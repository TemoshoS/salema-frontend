import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {Officer, OfficerProfileType, OfficerType} from '../types';
import {Alert} from 'react-native';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
  officers: OfficerType[] | null;
  deleteId: string | null;
  officerProfile: OfficerProfileType;
}

// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
  officers: null,
  deleteId: null,
  officerProfile: {
    firstName: '',
    lastName: '',
    psiraNumber: '',
    phone: '',
    availabilityStatus: 'available',
    skills: [],
    experienceYears: '',
    grade: 'Select a grade',
  },
};

// API call using createAsyncThunk
export const getOfficers = createAsyncThunk(
  'getOfficers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/security-company/v1/officers');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const deleteOfficer = createAsyncThunk(
  'deleteOfficer',
  async (officerId: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.patch(
        `/security-company/v1/remove-officer/${officerId}`,
      );

      return {id: officerId, ...response.data};
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const addOfficer = createAsyncThunk(
  'addOfficer',
  async (officerData: Officer, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(
        `/security-company/v1/add-officer`,
        officerData,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getOfficerProfile = createAsyncThunk(
  'getOfficerProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(
        '/security-officer/v1/my-profile',
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const updateOfficerProfile = createAsyncThunk(
  'updateOfficerProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.put(
        '/security-officer/v1/my-profile',
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const isAPendingAction = isPending(
  getOfficers,
  deleteOfficer,
  getOfficerProfile,
  updateOfficerProfile,
  addOfficer,
);
const isARejectedAction = isRejected(
  getOfficers,
  deleteOfficer,
  getOfficerProfile,
  updateOfficerProfile,
  addOfficer,
);

const officerSlice = createSlice({
  name: 'officers',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
    },
    updateOfficerList: (state, action) => {
      console.log('updateClientList', action);
      state.officers = action.payload;
      state.deleteId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOfficers.fulfilled, (state, action) => {
        console.log('getOfficers.fulfilled', action);
        state.loading = false;
        state.officers = action.payload.officers;
      })
      .addCase(deleteOfficer.fulfilled, (state, action) => {
        console.log('deleteOfficers.fulfilled', action.payload.id);
        state.loading = false;
        state.deleteId = action.payload.id;
      })
      .addCase(addOfficer.fulfilled, (state, action) => {
        console.log('addOfficer.fulfilled', action.payload);
        state.loading = false;
        state.success = true;
      })
      .addCase(getOfficerProfile.fulfilled, (state, action) => {
        console.log('getOfficerProfile.fulfilled', action.payload);
        state.loading = false;
        state.success = true;
        state.officerProfile = action.payload.profile;
      })

      .addCase(updateOfficerProfile.fulfilled, (state, action) => {
        console.log('getOfficerProfile.fulfilled', action.payload);
        state.loading = false;
        state.success = true;
      })

      .addMatcher(isAPendingAction, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addMatcher(isARejectedAction, (state, action: any) => {
        console.log('isARejectedAction', action.payload);
        Alert.alert('', action.payload.message);
        state.loading = false;
        state.success = false;
        state.error = action.payload as ErrorProps;
      });
  },
});
export const {resetPage, updateOfficerList} = officerSlice.actions;
export default officerSlice.reducer;
