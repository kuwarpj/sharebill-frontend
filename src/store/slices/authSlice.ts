import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "@/types";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";

const USER_LOCAL_STORAGE_KEY = "user";

interface AuthState {
  user: UserProfile | null;
}

const isBrowser = typeof window !== "undefined";
const getStoredUser = (): UserProfile | null => {
  if (!isBrowser) return null;
  try {
    const stored = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
};

export const logoutUser = createAsyncThunk<void>(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await fetchAPI(Routes.LOGOUT, "POST");
    } catch (err) {
      console.error("Logout API failed, clearing anyway.");
    }
    dispatch(logout());
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      if (isBrowser) {
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      if (isBrowser) {
        localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
