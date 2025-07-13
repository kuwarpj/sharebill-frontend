// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { UserProfile } from "@/types";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";

const USER_LOCAL_STORAGE_KEY = "user";

interface AuthState {
  user: UserProfile | null;
}

const initialState: AuthState = {
  user: null,
};

// ✅ Thunk: Log the user out via API and clear local state
export const logoutUser = createAsyncThunk<void>(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await fetchAPI(Routes.LOGOUT, 'POST');
    } catch (err) {
      console.error("Logout API failed, proceeding to clear state anyway.");
    }

    // ✅ Dispatch internal reducer to clear state + localStorage
    dispatch(logout());
  }
);

// ✅ Main Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUserFromLocalStorage: (state) => {
      if (typeof window === "undefined") return;

      const userString = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
      if (userString) {
        try {
          state.user = JSON.parse(userString);
        } catch (e) {
          console.error("Invalid user in localStorage:", e);
          state.user = null;
          localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
        }
      }
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      }
    },
  },
});

export const { setUser, loadUserFromLocalStorage, logout } = authSlice.actions;
export default authSlice.reducer;
