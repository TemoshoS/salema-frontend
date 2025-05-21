import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {DangerZoneData} from '../types';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
  showDangerZonePopup: boolean;
  dangerZones: DangerZoneData[] | null;
}
interface LocationType {
  latitude: number;
  longitude: number;
}
// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
  showDangerZonePopup: false,
  dangerZones: null,
};

export const getDangerZones = createAsyncThunk(
  'getDangerZones',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`/danger-zone/v1/`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const checkDangerZone = createAsyncThunk(
  'checkDangerZone',
  async (location: LocationType, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(
        `/danger-zone/v1/check`,
        location,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
const isAPendingAction = isPending(checkDangerZone, getDangerZones);
const isARejectedAction = isRejected(checkDangerZone, getDangerZones);

const dangerZoneSlice = createSlice({
  name: 'dangerZone',
  initialState,
  reducers: {
    toggleDangerZonePopup: (state, action) => {
      console.log('toggleDangerZonePopup', action);
      state.showDangerZonePopup = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(checkDangerZone.fulfilled, (state, action) => {
      console.log('checkDangerZone.fulfilled', action);
      state.loading = false;
      state.showDangerZonePopup =
        action.payload.message !== 'Location is not within any danger zone';
    });
    builder.addCase(getDangerZones.fulfilled, (state, action) => {
      console.log('getDangerZones.fulfilled', action);
      state.loading = false;
      state.dangerZones = action.payload.dangerZones;
    });
    builder.addMatcher(isAPendingAction, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addMatcher(isARejectedAction, (state, action: any) => {
      console.log('isARejectedAction', action.payload);
      state.loading = false;
      state.success = false;
      state.error = action.payload as ErrorProps;
    });
  },
});
export const {toggleDangerZonePopup} = dangerZoneSlice.actions;
export default dangerZoneSlice.reducer;
