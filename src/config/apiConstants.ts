
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const AUTH_ENDPOINTS = {
  LOGIN: `/auth/login`,
  SIGNUP: `/auth/signup`,
};

export const GROUP_ENDPOINTS = {
  BASE: `/api/groups`,
  BY_ID: (groupId: string) => `/api/groups/${groupId}`,
};

export const EXPENSE_ENDPOINTS = {
  BASE: `/api/expenses`,
  BY_GROUP_ID: (groupId: string) => `/api/expenses/group/${groupId}`,
};

export const USER_ENDPOINTS = {
  GET_ME: `/api/users/me`,
  // Add other user-specific routes here if needed
};
