import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';

import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/config/apiConstants';
import { apiClient } from '@/lib/apiClients';

// Request payload types, previously in services/api.ts
export interface LoginCredentials { email: string; password: string; }
export interface SignupCredentials { username: string; email: string; password: string; }

// Response type from auth endpoints, already in @/types
export interface AuthResponse { token: string; user: UserProfile; }


interface AuthState {
  user: UserProfile | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient<AuthResponse, LoginCredentials>({
        method: 'POST',
        endpoint: AUTH_ENDPOINTS.LOGIN,
        body: credentials,
        isPublic: true,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk<AuthResponse, SignupCredentials, { rejectValue: string }>(
  'auth/signupUser',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient<AuthResponse, SignupCredentials>({
        method: 'POST',
        endpoint: AUTH_ENDPOINTS.SIGNUP,
        body: credentials,
        isPublic: true,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<UserProfile, void, { rejectValue: string; state: { auth: AuthState } }>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.token) {
      return rejectWithValue('No token found for fetching current user');
    }
    try {
      const user = await apiClient<UserProfile>({
        method: 'GET',
        endpoint: USER_ENDPOINTS.GET_ME,
      });
       if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user)); // Update user in localStorage
      }
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle'; // Set to idle, so next protected route access re-evaluates
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');
        if (token && userString) {
          try {
            state.token = token;
            state.user = JSON.parse(userString);
            state.status = 'succeeded'; // Successfully loaded from storage
          } catch (e) {
            console.error("Failed to parse user from storage", e);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            state.status = 'failed'; // Mark as failed if parsing error
            state.error = 'Invalid user data in storage';
            state.token = null;
            state.user = null;
          }
        } else {
          // No token or user found in storage.
          // This means an attempt to load from storage did not find authentication.
          // Change status from 'idle' or 'loading' to 'failed' to signify this attempt is complete and unsuccessful.
          if (state.status === 'idle' || state.status === 'loading') {
            state.status = 'failed';
            state.error = 'No authentication data found in storage.';
          }
          // Ensure token and user are null if nothing was found.
          state.token = null;
          state.user = null;
        }
      } else {
        // Not in browser environment for localStorage access.
        // If status is 'idle', it remains 'idle'. Important for SSR or initial server context.
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null;
        state.user = null;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null;
        state.user = null;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        // Don't clear error here, might be a brief loading state
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.status = 'succeeded';
        state.user = action.payload; // Token is already in state if this was called
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
        state.token = null; // Critical: if fetching user with token fails, token is likely invalid
        state.user = null;
        if (typeof window !== 'undefined') {
           localStorage.removeItem('authToken');
           localStorage.removeItem('user');
        }
        console.error("Fetch current user failed:", action.payload);
      });
  },
});

export const { logout, loadUserFromStorage, clearAuthError } = authSlice.actions;
export default authSlice.reducer;