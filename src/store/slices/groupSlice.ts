import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Group } from '@/types';
import { GROUP_ENDPOINTS } from '@/config/apiConstants';
import { apiClient } from '@/lib/apiClients';

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

export const fetchGroups = createAsyncThunk<Group[], void, { rejectValue: string }>(
  'groups/fetchGroups', 
  async (_, { rejectWithValue }) => {
    try {
      const groups = await apiClient<Group[]>({
        method: 'GET',
        endpoint: GROUP_ENDPOINTS.BASE,
      });
      return groups;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch groups');
    }
  }
);

export const fetchGroupById = createAsyncThunk<Group, string, { rejectValue: string }>(
  'groups/fetchGroupById', 
  async (groupId: string, { rejectWithValue }) => {
    try {
      const group = await apiClient<Group>({
        method: 'GET',
        endpoint: GROUP_ENDPOINTS.BY_ID(groupId),
      });
      return group;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch group details');
    }
  }
);

export const createNewGroup = createAsyncThunk<Group, CreateGroupPayload, { rejectValue: string }>(
  'groups/createNewGroup',
  async (groupData: CreateGroupPayload, { rejectWithValue }) => {
    try {
      const newGroup = await apiClient<Group, CreateGroupPayload>({
        method: 'POST',
        endpoint: GROUP_ENDPOINTS.BASE,
        body: groupData,
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
        // state.error = null; // Don't clear error if currentGroup is just updating
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
        state.groups.push(action.payload); // Add to the list of groups
        // Optionally, set as currentGroup or redirect, handled by component
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearGroupError, setCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;