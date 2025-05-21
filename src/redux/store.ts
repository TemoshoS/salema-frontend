import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import serviceRequestReducer from './serviceRequestSlice';
import securityCompanyReducer from './securityCompanySlice';
import panicReducer from './panicSlice';
import missingPersonReducer from './missingPersonSlice';
import officersReducer from './officerSlice';
import clientReducer from './clientSlice';
import eventsReducer from './eventSlice';
import dangerZoneReducer from './dangerZoneSlice';
import emergencyContactReducer from './emergencyContactSlice';
import voiceNoteReducer from './voiceNoteSlice';
import profileReducer from './profileSlice';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';

// Define the root reducer by combining slices
const rootReducer = combineReducers({
  auth: authReducer,
  serviceRequest: serviceRequestReducer,
  securityCompany: securityCompanyReducer,
  panic: panicReducer,
  missingPerson: missingPersonReducer,
  client: clientReducer,
  officers: officersReducer,
  events: eventsReducer,
  dangerZone: dangerZoneReducer,
  emergencyContacts: emergencyContactReducer,
  voiceCommand: voiceNoteReducer,
  profile: profileReducer,
});
// Define RootState as the return type of rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Persist configuration
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Specify which slices you want to persist
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist compatibility
    }),
});

// Set up persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch types based on the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for useDispatch and useSelector with types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
