import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from './store';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
    response: any;
    loading: boolean;
    error: ErrorProps | null;
  }

// Initial state
const initialState: DataState = {
    response: null,
    loading: false,
    error: null,
  };

export const emergencyAlert = createAsyncThunk(
    'emergencyAlert',
    async (panicData: 
      {
        location: {
            // longitude: 12.7128,
            // latitude: -15.0060
            longitude: Number,
            latitude: Number
        },
        alertType: String
    }, {rejectWithValue}) => {
      try {
        console.log("panic data = ",panicData)
        const response = await axiosInstance.post('/emergency-alert/v1/', panicData);
        console.log("panic data response = ",response)
        return response.data;
      } catch (error: any) {
        console.log("panic error = ",error)
        return rejectWithValue(error.response.data);
      }
    },
  );

  const panicSlice = createSlice({
    name: 'panic',
    initialState,
    reducers:{},
    extraReducers: builder => {
      builder
        .addCase(emergencyAlert.pending, state => {
          state.loading = true;
          state.error = null;
        })
        .addCase(emergencyAlert.fulfilled, (state, action) => {
          console.log('alert.fulfilled', action);
          state.loading = false;
          state.response = action.payload;
          Alert.alert('', 'Alert Triggered Successfully');
        })
        .addCase(emergencyAlert.rejected, (state, action) => {
          console.log('alert.rejected', action);
          state.loading = false;
          state.error = action.payload as ErrorProps;
        });
    },
  });

  export default panicSlice.reducer;