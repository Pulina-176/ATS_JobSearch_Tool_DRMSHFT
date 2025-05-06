import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    username: null,
    token: null,
    userId: null,
  },
  reducers: {
    settUsername: (state, action) => {
      state.username = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload); // optional persistence
    },
    clearAuth: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { settUsername, setToken, clearAuth, setUserId } = authSlice.actions;
export default authSlice.reducer;