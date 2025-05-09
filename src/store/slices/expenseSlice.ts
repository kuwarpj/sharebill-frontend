import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Expense } from '@/types';
import { apiClient } from '@/lib/apiClient';
import { EXPENSE_ENDPOINTS } from '@/config/apiConstants';
import type { RootState } from '../store'; // Import RootState for getState

// Request payload type, previously in services/api.ts
export interface AddExpensePayload { 
  groupId: string; 
  description: string; 
  amount: number; 
  paidById: string; 
  category?: string; 
  participantIds?: string[]; 
}

interface ExpenseState {
  expenses: Expense[]; // Typically expenses for the currentGroup
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: ExpenseState = {
  expenses: [],
  status: 'idle',
  error: null,
};

export const fetchExpensesByGroupId = createAsyncThunk<Expense[], string, { rejectValue: string, state: RootState }>(
  'expenses/fetchByGroupId',
  async (groupId: string, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const expenses = await apiClient<Expense[]>({
        method: 'GET',
        endpoint: EXPENSE_ENDPOINTS.BY_GROUP_ID(groupId),
        headers,
      });
      return expenses;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch expenses for group');
    }
  }
);

export const addNewExpense = createAsyncThunk<Expense, AddExpensePayload, { rejectValue: string, state: RootState }>(
  'expenses/addNewExpense',
  async (expenseData: AddExpensePayload, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const newExpense = await apiClient<Expense, AddExpensePayload>({
        method: 'POST',
        endpoint: EXPENSE_ENDPOINTS.BASE,
        body: expenseData,
        headers,
      });
      return newExpense;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    },
    clearExpenses: (state) => {
      state.expenses = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesByGroupId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchExpensesByGroupId.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchExpensesByGroupId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addNewExpense.pending, (state) => {
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(addNewExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.status = 'succeeded';
        state.expenses.unshift(action.payload); 
      })
      .addCase(addNewExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearExpenseError, clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
