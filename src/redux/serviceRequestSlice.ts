import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {RootState} from './store';
import {getEndPoint} from '../utils/helper';

interface LocationProps {
  latitude: number | undefined;
  longitude: number | undefined;
}

interface ServiceRequestProps {
  securityCompany: string | undefined;
  requestedServices: string[];
  requestedDateTime: Date | undefined;
  priority: string;
  location: LocationProps;
  body: string;
}

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  items: any[];
  loading: boolean;
  error: ErrorProps | null;
  serviceRequestDetails: ServiceRequestProps | null;
  success: boolean;
}

// Initial state
const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
  serviceRequestDetails: null,
  success: false,
};

export const createServiceRequest = createAsyncThunk(
  'serviceRequest/createServiceRequest',
  async (serviceRequestData: ServiceRequestProps, {getState}) => {
    try {
      const state = getState() as RootState; // RootState is your type for the entire Redux state
      const accessToken = state.auth.accessToken;
      const response = await axiosInstance.post(
        '/service-request/v1',
        serviceRequestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add your authorization token or other headers here
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('error', error);
    }
  },
);

export const fetchServiceRequests = createAsyncThunk(
  'serviceRequest/fetchServiceRequests',
  async () => {
    try {
      const response = await axiosInstance.get(getEndPoint());
      return response.data;
    } catch (error: any) {
      console.log({error});
    }
  },
);

export const updateServiceRequests = createAsyncThunk(
  'serviceRequest/updateServiceRequests',
  async (updateData: {
    serviceRequestId: string;
    status: string;
    assignedOfficers: string[];
    body: string;
  }) => {
    try {
      const response = await axiosInstance.put(
        '/service-request/v1/',
        updateData,
      );
      return response.data;
    } catch (error: any) {
      console.log({error});
    }
  },
);

export const updateServiceRequestsByOfficer = createAsyncThunk(
  'serviceRequest/updateServiceRequestsByOfficer',
  async (updateData: {serviceRequestId: string; status: string}) => {
    try {
      const response = await axiosInstance.patch(
        `/service-request/v1/${updateData.serviceRequestId}`,
        {status: updateData.status},
      );
      return response.data;
    } catch (error: any) {
      console.log({error});
    }
  },
);

const isAPendingAction = isPending(
  createServiceRequest,
  fetchServiceRequests,
  updateServiceRequests,
  updateServiceRequestsByOfficer,
);

const isARejectedAction = isRejected(
  createServiceRequest,
  fetchServiceRequests,
  updateServiceRequests,
  updateServiceRequestsByOfficer,
);

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(fetchServiceRequests.fulfilled, (state, action) => {
        // console.log('fetchServiceRequests', action.payload);
        state.loading = false;
        state.items = action.payload.serviceRequests;
      })

      .addCase(updateServiceRequests.fulfilled, (state, action) => {
        console.log('updateServiceRequests', action.payload);
        state.loading = false;
        state.success = true;
      })

      .addCase(updateServiceRequestsByOfficer.fulfilled, (state, action) => {
        console.log('updateServiceRequestsByOfficer', action.payload);
        state.loading = false;
        state.success = true;
      })

      .addMatcher(isAPendingAction, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addMatcher(isARejectedAction, (state, action) => {
        console.log('isARejectedAction', action.payload);
        state.loading = false;
        state.success = false;
        state.error = action.payload as ErrorProps;
      });
  },
});
export const {resetPage} = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;
