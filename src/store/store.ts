import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groupReducer from './slices/groupSlice';
import expenseReducer from './slices/expenseSlice';
// Import other reducers here

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
    expenses: expenseReducer,
    // Add other reducers here
  },
  // Optional: Add middleware or devTools configuration
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
