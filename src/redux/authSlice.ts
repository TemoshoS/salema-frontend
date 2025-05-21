import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from './store';
import {RoleStrings} from '../constants/constants';

// Define an interface for the state
interface RoleProps {
  GU: string;
  MG: string;
  AD: string;
  SO: string;
}
interface UserProps {
  role: string;
  name: string;
  surname: string;
  email: string;
  address: string;
}
interface ErrorProps {
  message: string;
  status: number;
}
interface DataState {
  items: any[];
  loading: boolean;
  error: ErrorProps | null;
  isLoggedIn: boolean;
  userDetails: UserProps | null;
  accessToken: string | null;
  isDrawerOpen: boolean;
}

// Initial state
const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
  isLoggedIn: false,
  userDetails: null,
  accessToken: null,
  isDrawerOpen: false,
};

// const baseURL = 'http://127.0.0.1';

// API call using createAsyncThunk
export const login = createAsyncThunk(
  'login',
  async (loginData: {email: string; password: string}, {rejectWithValue}) => {
    try {
      // Alert.alert('asdas', JSON.stringify(loginData));
      const response = await axiosInstance.post('/user/v1/login', loginData);
      return response.data;
    } catch (error: any) {
      // Alert.alert('', JSON.stringify(error.response.data));
      return rejectWithValue(error.response.data);
    }
  },
);
export const register = createAsyncThunk(
  'register',
  async (
    registerData: {
      firstName: string;
      email: string;
      password: string;
      surname: string;
      address: string;
      role: string;
      contact: string;
    },
    {rejectWithValue},
  ) => {
    try {
      console.log('Register api called');
      const response = await axiosInstance.post(
        'https://salema-backend1.onrender.com/client/v1/register',
        registerData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const securityCompanyRegister = createAsyncThunk(
  'securityCompanyRegister',
  async (
    registerData: {
      companyName: string;
      contactPerson: string;
      phone: string;
      psiraNumber: string;
      email: string;
      address: string;
      password: string;
      branches: string[];
      securityServices: string[];
    },
    {rejectWithValue},
  ) => {
    try {
      console.log('Register api called');
      const response = await axiosInstance.post(
        '/security-company/v1/register',
        registerData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const registerDevice = createAsyncThunk(
  'registerDevice',
  async (
    registerDeviceData: {
      fcmToken: string;
      configuration: any;
    },
    {rejectWithValue},
  ) => {
    try {
      const config = {
        headers: {Authorization: registerDeviceData.configuration},
      };
      const tokenData = {
        fcmToken: registerDeviceData.fcmToken,
      };
      console.log('config =', config);
      console.log('tokenData =', tokenData);
      const response = await axiosInstance.post(
        '/fcm-token/v1/',
        tokenData,
        config,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deRegisterDevice = createAsyncThunk(
  'deRegisterDevice',
  async (
    registerDeviceData: {
      fcmToken?: string;
      configuration: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const config = {
        headers: {Authorization: registerDeviceData.configuration},
      };

      const response = await axiosInstance.delete('/fcm-token/v1/', config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const isAPendingAction = isPending(
  login,
  register,
  registerDevice,
  deRegisterDevice,
  securityCompanyRegister,
);
const isARejectedAction = isRejected(
  login,
  register,
  registerDevice,
  deRegisterDevice,
  securityCompanyRegister,
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, {payload}) => {
      state.isLoggedIn = true;
      state.userDetails = payload;
    },
    logoutSuccess: state => {
      state.isLoggedIn = false;
      state.error = null;
      state.accessToken = null;
    },
    toggleDrawer: (state, {payload}) => {
      state.isDrawerOpen = payload;
    },
    resetPage: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      .addCase(login.fulfilled, (state, action) => {
        console.log('login.fulfilled', action);
        state.loading = false;
        state.items = action.payload;
        state.isLoggedIn = true;
        state.userDetails = action.payload;
        state.accessToken = action.payload.access_token;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.isLoggedIn = true;
        state.accessToken = action.payload.access_token;
        Alert.alert('', 'User Registered Successfully');
        state.userDetails = {
          role: RoleStrings.GU,
          name: 'Sample',
          surname: 'Surname',
          email: 'email@email.com',
          address: 'saddress',
        };
      })
      .addCase(securityCompanyRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.isLoggedIn = true;
        state.accessToken = action.payload.access_token;
        Alert.alert('', 'User Registered Successfully');
        state.userDetails = {
          role: RoleStrings.MG,
          name: 'Sample',
          surname: 'Surname',
          email: 'email@email.com',
          address: 'saddress',
        };
      })
      .addCase(registerDevice.fulfilled, (state, action) => {
        console.log('registerDevice action', action.payload);
        state.loading = false;
        state.items = action.payload;
        state.isLoggedIn = true;
        // Alert.alert('', 'Device Registered Successfully');
      })

      .addCase(deRegisterDevice.fulfilled, (state, action) => {
        console.log('deregisterDevice action', action.payload);
        state.loading = false;
        state.items = action.payload;
        state.isLoggedIn = false;
      });
    builder.addMatcher(isAPendingAction, state => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isARejectedAction, (state, action: any) => {
      state.loading = false;
      state.error = action.payload as ErrorProps;
    });
  },
});
export const {loginSuccess, logoutSuccess, toggleDrawer, resetPage} =
  authSlice.actions;

export default authSlice.reducer;
// selectors.js
export const selectUser = (state: RootState) => state.auth;
