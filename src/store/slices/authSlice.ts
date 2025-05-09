import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';
import { apiClient } from '@/lib/apiClient';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/config/apiConstants';
import { setCookie, getCookie, deleteCookie } from '@/lib/cookieUtils';

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

const AUTH_TOKEN_COOKIE_NAME = 'authToken';
const USER_LOCAL_STORAGE_KEY = 'user';

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
        setCookie(AUTH_TOKEN_COOKIE_NAME, response.token, { maxAge: 60 * 60 * 24 * 7, path: '/' }); // 7 days
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(response.user));
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
        setCookie(AUTH_TOKEN_COOKIE_NAME, response.token, { maxAge: 60 * 60 * 24 * 7, path: '/' }); // 7 days
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(response.user));
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
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No token found for fetching current user');
    }
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
      };
      const user = await apiClient<UserProfile>({
        method: 'GET',
        endpoint: USER_ENDPOINTS.GET_ME,
        headers,
      });
       if (typeof window !== 'undefined') {
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user)); 
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
      state.status = 'idle'; 
      state.error = null;
      if (typeof window !== 'undefined') {
        deleteCookie(AUTH_TOKEN_COOKIE_NAME, '/');
        localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      }
    },
    loadAuthDataFromCookies: (state) => {
      if (typeof document === 'undefined') return;

      const token = getCookie(AUTH_TOKEN_COOKIE_NAME);
      const userString = localStorage.getItem(USER_LOCAL_STORAGE_KEY);

      if (token) {
        state.token = token;
        if (userString) {
          try {
            state.user = JSON.parse(userString);
          } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            state.user = null;
            localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
          }
        }
        // If token exists, status becomes succeeded. AppLayout will handle fetching user if state.user is null.
        state.status = 'succeeded';
      } else {
        state.token = null;
        state.user = null;
        state.status = 'failed';
        state.error = 'No authentication token found in cookies.';
        localStorage.removeItem(USER_LOCAL_STORAGE_KEY); // Ensure user is cleared from LS if token is gone
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
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null; 
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
        state.token = null; 
        state.user = null;
        if (typeof window !== 'undefined') {
           deleteCookie(AUTH_TOKEN_COOKIE_NAME, '/');
           localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
        }
        console.error("Fetch current user failed:", action.payload);
      });
  },
});

export const { logout, loadAuthDataFromCookies, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
