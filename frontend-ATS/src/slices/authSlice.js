import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    username: null,
    // token: localStorage.getItem("token") || null,
    token: null,
  },
  reducers: {
    settUsername: (state, action) => {
      state.username = action.payload;
    },
    setToken: (state, action) => { // Add action to set token
        state.token = action.payload;
        // localStorage.setItem("token", action.payload);
      },
      clearAuth: (state) => { // Optional: Clear both username and token (e.g., for logout)
        state.username = null;
        state.token = null;
        // localStorage.removeItem("token");
      },
  },
});

export const { settUsername, setToken, clearAuth} = authSlice.actions;
export default authSlice.reducer;