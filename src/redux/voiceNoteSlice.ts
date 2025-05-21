import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {VoiceCommandsType} from '../types';
import {Alert} from 'react-native';
import {Location} from 'react-native-get-location';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
  voiceCommands: VoiceCommandsType[];
  deleteId: string | null;
}

// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
  voiceCommands: [],
  deleteId: null,
};

// API call using createAsyncThunk
export const createvoiceCommands = createAsyncThunk(
  'createvoiceCommands',
  async (
    voiceDetails: {
      text: string;
      type: string;
      emergencyContact: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await axiosInstance.post(
        '/voice-command/v1/',
        voiceDetails,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateVoiceCommands = createAsyncThunk(
  'updateVoiceCommands',
  async (
    voiceDetails: {
      text: string;
      type: string;
      emergencyContact: string;
    },
    {rejectWithValue},
  ) => {
    // console.log('asdasd', voiceDetails);
    try {
      const response = await axiosInstance.put(
        `/voice-command/v1/${voiceDetails.emergencyContact}`,
        {text: voiceDetails.text},
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getvoiceCommands = createAsyncThunk(
  'getvoiceCommands',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/voice-command/v1/');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deletevoiceCommands = createAsyncThunk(
  'deletevoiceCommands',
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

export const sendAlertToEmergencyContact = createAsyncThunk(
  'sendAlertToEmergencyContact',
  async (
    body: {
      location: {latitude: number; longitude: number};
      emergencyID: string;
    },
    {rejectWithValue},
  ) => {
    try {
      console.log('sdfsdf', body.location);
      const response = await axiosInstance.post(
        `/emergency-alert/v1/contact-alert/${body.emergencyID}`,
        {location: body.location},
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const isAPendingAction = isPending(
  getvoiceCommands,
  deletevoiceCommands,
  createvoiceCommands,
  updateVoiceCommands,
  sendAlertToEmergencyContact,
);
const isARejectedAction = isRejected(
  getvoiceCommands,
  deletevoiceCommands,
  createvoiceCommands,
  updateVoiceCommands,
  sendAlertToEmergencyContact,
);

const voiceCommandSlice = createSlice({
  name: 'voiceCommands',
  initialState,
  reducers: {
    resetPage: state => {
      console.log('resetPage___');
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createvoiceCommands.fulfilled, (state, action) => {
        console.log('createvoiceCommands.fulfilled', action.payload);
        state.loading = false;
        state.success = true;
      })
      .addCase(updateVoiceCommands.fulfilled, (state, action) => {
        console.log('updateVoiceCommands.fulfilled', action.payload);
        state.loading = false;
        state.success = true;
      })

      .addCase(getvoiceCommands.fulfilled, (state, action) => {
        console.log('getvoiceCommands.fulfilled', action);
        state.loading = false;
        state.voiceCommands = action.payload.voiceCommands;
      })
      .addCase(deletevoiceCommands.fulfilled, (state, action) => {
        console.log('deletevoiceCommands.fulfilled', action.payload.id);
        state.loading = false;
        state.deleteId = action.payload.id;
      })
      .addCase(sendAlertToEmergencyContact.fulfilled, (state, action) => {
        console.log('sendAlertToEmergencyContact.fulfilled', action.payload.id);
        state.loading = false;
        state.success = true;
      })

      .addMatcher(isAPendingAction, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addMatcher(isARejectedAction, (state, action: any) => {
        console.log('isARejectedAction', action);
        Alert.alert('', action.payload.message);
        state.loading = false;
        state.success = false;
        state.error = action.payload as ErrorProps;
      });
  },
});
export const {resetPage} = voiceCommandSlice.actions;
export default voiceCommandSlice.reducer;
