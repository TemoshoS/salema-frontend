import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import type { MissingPerson, MPComment, MissingStatus } from '../types/missingPerson';


interface ErrorProps {
  message?: string;
  status?: number;
  errors?: { msg: string; path?: string }[];
}

interface DataState {
  success: boolean | null;
  loading: boolean;
  error: ErrorProps | null;
  items: MissingPerson[];
  selected?: MissingPerson | null;
}

const initialState: DataState = {
  loading: false,
  error: null,
  success: null,
  items: [],
  selected: null,
};

// API call using createAsyncThunk
export const addMissingPersons = createAsyncThunk(
  'addMissingPersons',
  async (missingPersonData: FormData, { rejectWithValue }) => {
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


// ------ NEW: list ------
export const fetchMissingPersons = createAsyncThunk(
  'missing/list',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/client/v1/missing-persons');
      return res.data.missingPersons as MissingPerson[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

// ------ NEW: get one ------
export const fetchMissingPersonById = createAsyncThunk(
  'missing/getOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/client/v1/missing-person/info/${id}`);
      return res.data.missingPerson as MissingPerson;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

// ------ NEW: update ------
export const updateMissingPerson = createAsyncThunk(
  'missing/update',
  async (
    payload: { id: string; lastSeenDateTime: string; lastSeenLocation: string; missingStatus: MissingStatus },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...body } = payload;
      const res = await axiosInstance.put(`/client/v1/missing-person/${id}`, body);
      return { id, ...body, server: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

// ------ NEW: delete ------
export const deleteMissingPerson = createAsyncThunk(
  'missing/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/client/v1/missing-person/${id}`);
      return { id, server: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

// ------ NEW: comments ------
export const addComment = createAsyncThunk(
  'missing/comment/add',
  async (payload: { missingPerson: string; body: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/client/v1/comment', payload);
      return { ...payload, server: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

export const updateComment = createAsyncThunk(
  'missing/comment/update',
  async (payload: { id: string; body: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/client/v1/comment/${payload.id}`, { body: payload.body });
      return { ...payload, server: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  'missing/comment/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/client/v1/comment/${id}`);
      return { id, server: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: 'Network error' });
    }
  }
);

//

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
      })

      // list
      .addCase(fetchMissingPersons.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMissingPersons.fulfilled, (s, a: PayloadAction<MissingPerson[]>) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchMissingPersons.rejected, (s, a) => { s.loading = false; s.error = a.payload as ErrorProps; })
      // get one
      .addCase(fetchMissingPersonById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMissingPersonById.fulfilled, (s, a: PayloadAction<MissingPerson>) => {
        s.loading = false;
        s.selected = a.payload;
      })
      .addCase(fetchMissingPersonById.rejected, (s, a) => { s.loading = false; s.error = a.payload as ErrorProps; })

      // update
      .addCase(updateMissingPerson.fulfilled, (s, a) => {
        s.success = true;
        if (s.selected && s.selected._id === (a.payload as any).id) {
          s.selected = {
            ...s.selected,
            lastSeenDateTime: (a.payload as any).lastSeenDateTime,
            lastSeenLocation: (a.payload as any).lastSeenLocation,
            missingStatus: (a.payload as any).missingStatus,
          } as MissingPerson;
        }
        // update list item
        s.items = s.items.map((it) => it._id === (a.payload as any).id
          ? { ...it, lastSeenDateTime: (a.payload as any).lastSeenDateTime, lastSeenLocation: (a.payload as any).lastSeenLocation, missingStatus: (a.payload as any).missingStatus }
          : it);
      })

      // delete
      .addCase(deleteMissingPerson.fulfilled, (s, a) => {
        const id = (a.payload as any).id;
        s.items = s.items.filter((it) => it._id !== id);
        if (s.selected?._id === id) s.selected = null;
        s.success = true;
      })

      // comments: on success, we simply trigger a refetch in UI; reducer keeps success flag
      .addCase(addComment.fulfilled, (s) => { s.success = true; })
      .addCase(updateComment.fulfilled, (s) => { s.success = true; })
      .addCase(deleteCommentThunk.fulfilled, (s) => { s.success = true; })
      ;

  },
});
export const { resetPage } = missingPersonSlice.actions;
export default missingPersonSlice.reducer;
