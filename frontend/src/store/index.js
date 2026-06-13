import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { quizApiSlice } from './apiSlice';

const appReducer = combineReducers({
  auth: authReducer,
  [quizApiSlice.reducerPath]: quizApiSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    // Clear all Redux state (including RTK Query cache) on logout
    // This prevents a new user from seeing the previous user's cached data
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizApiSlice.middleware),
});
