import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  // disable serializable check for redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
