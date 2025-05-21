import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  profileDetails: ProfileType;
  loading: boolean;
  error: ErrorProps | null;
  success: boolean;
}

interface ProfileType {
  _id: string;
  firstName: string;
  surname: string;
  contact: string;
  address: string;
}

// Initial state
const initialState: DataState = {
  profileDetails: {
    _id: '',
    firstName: '',
    surname: '',
    contact: '',
    address: '',
  },
  loading: false,
  error: null,
  success: false,
};

export const getClientProfile = createAsyncThunk(
  'getClientProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/client/v1/my-profile');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const updateClientProfile = createAsyncThunk(
  'updateClientProfile',
  async (
    clientProfile: {
      firstName: string;
      surname: string;
      contact: string;
      address: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await axiosInstance.put(
        '/client/v1/my-profile',
        clientProfile,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getClientProfile.fulfilled, (state, action) => {
        // console.log('getClientProfile', action);
        state.loading = false;
        state.profileDetails = action.payload.client;
      })
      .addCase(updateClientProfile.fulfilled, (state, action) => {
        console.log('updateClientProfile');
        state.loading = false;
        state.success = true;
      });
  },
});
export const {resetPage} = profileSlice.actions;
export default profileSlice.reducer;
