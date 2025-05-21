import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {CommentType, EventsType, OfficerType} from '../types';
import {Alert} from 'react-native';

interface ErrorProps {
  message: string;
  status: number;
}

interface DataState {
  success: boolean;
  createEventSuccess: boolean;
  loading: boolean;
  error: ErrorProps | null;
  events: EventsType[];
  eventId: string;
  comments: CommentType[];
}

// Initial state
const initialState: DataState = {
  loading: false,
  error: null,
  success: false,
  createEventSuccess: false,
  events: [],
  eventId: '',
  comments: [],
};

// API call using createAsyncThunk
export const getEvents = createAsyncThunk(
  'getEvents',
  async (serviceReqID: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`/event/v1/${serviceReqID}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const createEvent = createAsyncThunk(
  'createEvent',
  async (
    data: {
      requestID: string;
      eventData: {
        eventTitle: string;
        eventBody: string;
      };
    },
    {rejectWithValue},
  ) => {
    try {
      console.log('eventDAtaa', data);
      const response = await axiosInstance.post(`/event/v1/${data.requestID}`, {
        eventTitle: data.eventData.eventTitle,
        eventBody: data.eventData.eventBody,
      });

      return response.data;
    } catch (error: any) {
      console.log('eventDAtaaerror', error);
      return rejectWithValue(error.response.data);
    }
  },
);
export const updateEventStatus = createAsyncThunk(
  'updateEventStatus',
  async (eventData: {eventId: string; status: string}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.patch(
        `/event/v1/${eventData.eventId}`,
        {status: eventData.status},
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const addEventComment = createAsyncThunk(
  'addEventComment',
  async (
    eventData: {eventComment: string | undefined; eventId: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await axiosInstance.post(
        `/event/v1/comment/${eventData.eventId}`,
        {comment: eventData.eventComment},
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const isAPendingAction = isPending(
  getEvents,
  updateEventStatus,
  addEventComment,
);
const isARejectedAction = isRejected(
  getEvents,
  updateEventStatus,
  addEventComment,
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetPage: state => {
      state.success = false;
      state.events = [];
      state.eventId = '';
      state.comments = [];
      state.createEventSuccess = false;
    },
    setSelectedEventId: (state, action) => {
      state.eventId = action.payload._id;
      state.comments = action.payload.comments;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getEvents.fulfilled, (state, action) => {
        console.log('getEvents.fulfilled', action.payload);
        state.loading = false;
        state.events = action.payload.events;
        if (state.eventId !== '') {
          const selectedEvent = action.payload.events.filter(
            (item: EventsType) => item._id === state.eventId,
          );
          state.comments = selectedEvent[0].comments;
        }
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        console.log('createEvent.fulfilled', action.payload);
        state.loading = false;
        state.createEventSuccess = true;
      })

      .addCase(updateEventStatus.fulfilled, (state, action) => {
        console.log('updateEventStatus.fulfilled', action.payload);
        state.loading = false;
        state.success = true;
      })

      .addCase(addEventComment.fulfilled, (state, action) => {
        console.log('addEventComment.fulfilled', action.payload);
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
export const {resetPage, setSelectedEventId} = eventSlice.actions;
export default eventSlice.reducer;
