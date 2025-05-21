import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {EmergencyContactsType} from '../types';
import {Alert} from 'react-native';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
  emergencyContacts: EmergencyContactsType[] | null;
  deleteId: string | null;
}

// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
  emergencyContacts: null,
  deleteId: null,
};

// API call using createAsyncThunk
export const createEmergencyContacts = createAsyncThunk(
  'createEmergencyContacts',
  async (
    contactDetails: {
      email: string;
      name: string;
      relationship: string;
      phone: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await axiosInstance.post(
        '/emergency-contact/v1/',
        contactDetails,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// API call using createAsyncThunk
export const getEmergencyContacts = createAsyncThunk(
  'getEmergencyContacts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/emergency-contact/v1/');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteEmergencyContacts = createAsyncThunk(
  'deleteEmergencyContacts',
  async (contactId: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.delete(
        `/emergency-contact/v1/${contactId}`,
      );

      return {id: contactId, ...response.data};
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
const isAPendingAction = isPending(
  getEmergencyContacts,
  deleteEmergencyContacts,
  createEmergencyContacts,
);
const isARejectedAction = isRejected(
  getEmergencyContacts,
  deleteEmergencyContacts,
  createEmergencyContacts,
);

const emergencyContactSlice = createSlice({
  name: 'emergencyContacts',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
      state.error = null;
    },
    updateEmergencyContactList: (state, action) => {
      console.log('updateEmergencyContactList', action);
      state.emergencyContacts = action.payload;
      state.deleteId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createEmergencyContacts.fulfilled, (state, action) => {
        console.log('createEmergencyContacts.fulfilled', action.payload.id);
        state.loading = false;
        state.success = true;
      })
      .addCase(getEmergencyContacts.fulfilled, (state, action) => {
        console.log('getEmergencyContacts.fulfilled', action);
        state.loading = false;
        state.emergencyContacts = action.payload.emergencyContacts;
      })
      .addCase(deleteEmergencyContacts.fulfilled, (state, action) => {
        console.log('deleteEmergencyContacts.fulfilled', action.payload.id);
        state.loading = false;
        state.deleteId = action.payload.id;
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
export const {resetPage, updateEmergencyContactList} =
  emergencyContactSlice.actions;
export default emergencyContactSlice.reducer;
