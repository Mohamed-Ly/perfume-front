import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
// import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // user: userSlice,
    // يمكن إضافة slices أخرى لاحقاً
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
