import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    username: null,
    token: null,
  },
  reducers: {
    settUsername: (state, action) => {
      state.username = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { settUsername, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;