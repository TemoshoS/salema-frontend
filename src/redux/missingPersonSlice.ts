import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

interface ErrorProps {
  message: string;
  status: number;
}
interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
}

// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
};

// API call using createAsyncThunk
export const addMissingPersons = createAsyncThunk(
  'addMissingPersons',
  async (missingPersonData: FormData, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(
        '/client/v1/missing-person',
        missingPersonData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const missingPersonSlice = createSlice({
  name: 'missingPerson',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addMissingPersons.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMissingPersons.fulfilled, (state, action) => {
        console.log('addMissingPersons.fulfilled', action);
        state.loading = false;
        state.success = true;
      })
      .addCase(addMissingPersons.rejected, (state, action) => {
        console.log('addMissingPersons.rejected', action);
        state.loading = false;
        state.error = action.payload as ErrorProps;
      });
  },
});
export const {resetPage} = missingPersonSlice.actions;
export default missingPersonSlice.reducer;
