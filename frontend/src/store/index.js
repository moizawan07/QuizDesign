import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { quizApiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [quizApiSlice.reducerPath]: quizApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizApiSlice.middleware),
});
