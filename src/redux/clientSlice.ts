import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
  isFulfilled,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {ClientType} from '../types';
import {Alert} from 'react-native';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
  clients: ClientType[] | null;
  deleteId: string | null;
  updateSuccess: boolean;
}

// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
  clients: null,
  deleteId: null,
  updateSuccess: false,
};

interface DetailsType {
  firstName: string;
  surname: string;
  contact: string;
  address: string;
  id: string;
}


// API call using createAsyncThunk
export const getClients = createAsyncThunk(
  'getClients',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/client/v1/list-all');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateClient = createAsyncThunk(
  'updateClient',
  async (details:DetailsType, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.put(`/client/v1/update/${details.id}`,details);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteClient = createAsyncThunk(
  'deleteClient',
  async (clientId: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.delete(`/client/v1/${clientId}`);

      return {id: clientId, ...response.data};
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
const isAPendingAction = isPending(getClients, deleteClient);
const isARejectedAction = isRejected(getClients, deleteClient);
// const isUpdatedAction = isFulfilled

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
    },
    updateClientList: (state, action) => {
      console.log('updateClientList', action);
      state.clients = action.payload;
      state.deleteId = null;
    },
    resetUpdateClientSuccess: state =>{
      state.updateSuccess = false;
    }
  },
  extraReducers: builder => {
    builder.addCase(getClients.fulfilled, (state, action) => {
      console.log('getClients.fulfilled', action);
      state.loading = false;
      state.clients = action.payload.clients;
    });
    builder.addCase(deleteClient.fulfilled, (state, action) => {
      console.log('deleteClient.fulfilled', action.payload.id);
      state.loading = false;
      state.deleteId = action.payload.id;
    });

    builder.addCase(updateClient.fulfilled,(state,action)=>{
      console.log('updateClient.fulfilled',action.payload)
      state.loading = false;
      state.updateSuccess = true;
      Alert.alert('Success','User details updated successfully');
    });

    builder.addCase(updateClient.rejected,(state,action)=>{
      console.log('updateClient.rejected',action)
      state.loading = false;
      Alert.alert('Failure','User details could not be updated');
    });

    builder.addMatcher(isAPendingAction, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addMatcher(isARejectedAction, (state, action: any) => {
      console.log('isARejectedAction', action.payload);
      Alert.alert('', action.payload.message);
      state.loading = false;
      state.success = false;
      state.error = action.payload as ErrorProps;
    });

   
  },
});
export const {resetPage, updateClientList,resetUpdateClientSuccess} = clientSlice.actions;
export default clientSlice.reducer;
