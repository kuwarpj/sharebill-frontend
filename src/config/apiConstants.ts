export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const Routes = {
  SEND_OPT: "/auth/sendotp",
  VERIFY_OPT: "/auth/verify-and-signup",
  LOGIN: "/auth/login",

  //Groups API
  GET_USER_GROUP: "/api/groups/usergroup",
  CREATE_GROUP: "/api/groups/create",
  GET_GROUP_BY_ID : '/api/groups',



  GET_GROUP_EXPENSE : '/api/expenses/group'
};

export default Routes;
