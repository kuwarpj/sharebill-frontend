import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Group } from '@/types';
import { apiClient } from '@/lib/apiClient';
import { GROUP_ENDPOINTS } from '@/config/apiConstants';
import type { RootState } from '../store'; // Import RootState for getState

// Request payload type, previously in services/api.ts
export interface CreateGroupPayload { 
  groupName: string; 
  groupDescription?: string; 
  members: Array<{ email: string }>; 
}

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  status: 'idle',
  error: null,
};

export const fetchGroups = createAsyncThunk<Group[], void, { rejectValue: string, state: RootState }>(
  'groups/fetchGroups', 
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const groups = await apiClient<Group[]>({
        method: 'GET',
        endpoint: GROUP_ENDPOINTS.BASE,
        headers,
      });
      return groups;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch groups');
    }
  }
);

export const fetchGroupById = createAsyncThunk<Group, string, { rejectValue: string, state: RootState }>(
  'groups/fetchGroupById', 
  async (groupId: string, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const group = await apiClient<Group>({
        method: 'GET',
        endpoint: GROUP_ENDPOINTS.BY_ID(groupId),
        headers,
      });
      return group;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch group details');
    }
  }
);

export const createNewGroup = createAsyncThunk<Group, CreateGroupPayload, { rejectValue: string, state: RootState }>(
  'groups/createNewGroup',
  async (groupData: CreateGroupPayload, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const newGroup = await apiClient<Group, CreateGroupPayload>({
        method: 'POST',
        endpoint: GROUP_ENDPOINTS.BASE,
        body: groupData,
        headers,
      });
      return newGroup;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create group');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearGroupError: (state) => {
      state.error = null;
    },
    setCurrentGroup: (state, action: PayloadAction<Group | null>) => {
      state.currentGroup = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action: PayloadAction<Group[]>) => {
        state.status = 'succeeded';
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchGroupById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroupById.fulfilled, (state, action: PayloadAction<Group>) => {
        state.status = 'succeeded';
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.currentGroup = null;
      })
      .addCase(createNewGroup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createNewGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        state.status = 'succeeded';
        state.groups.push(action.payload); 
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearGroupError, setCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;
