import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem("auth_user") ? JSON.parse(localStorage.getItem("auth_user")) : null,
  token: localStorage.getItem("auth_token") || null,
  loading: false, // Since it loads synchronously from localStorage, we don't strictly need a true initial loading state like Context did, but keeping it for async if needed.
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      // Optional: remove other quiz related tokens
      localStorage.removeItem("quiz_attempted");
      localStorage.removeItem("selectedQuizId");
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
