import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth/auth";
import jsCookie from "js-cookie";

// دالة لتحميل بيانات المستخدم من localStorage
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error loading user from storage:", error);
    return null;
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ identifier, password });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل تسجيل الدخول";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logoutAll();
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "فشل تسجيل الخروج");
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUserFromStorage(), // تحميل بيانات المستخدم من localStorage
    accessToken: jsCookie.get("accessToken") || null,
    refreshToken: jsCookie.get("refreshToken") || null,
    isAuthenticated: !!(jsCookie.get("accessToken") && loadUserFromStorage()), // التحقق من وجود token وuser
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      // حفظ التوكنات في الكوكيز
      if (accessToken) {
        jsCookie.set("accessToken", accessToken, { expires: 1 });
      }
      if (refreshToken) {
        jsCookie.set("refreshToken", refreshToken, { expires: 7 });
      }

      // حفظ بيانات المستخدم في localStorage
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // إزالة التوكنات من الكوكيز
      jsCookie.remove("accessToken");
      jsCookie.remove("refreshToken");

      // إزالة بيانات المستخدم من localStorage
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;

        // فك تشفير الـ token للحصول على الـ role
        const decodedToken = JSON.parse(atob(action.payload.data.accessToken.split(".")[1]));
        const userRole = decodedToken?.role;

        if (userRole === "ADMIN") {
          state.isAuthenticated = true;
          state.user.role = userRole;

          // حفظ التوكنات في الكوكيز
          jsCookie.set("accessToken", action.payload.data.accessToken, { expires: 1 });
          jsCookie.set("refreshToken", action.payload.data.refreshToken, { expires: 7 });

          // حفظ بيانات المستخدم في localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...action.payload.data.user,
              role: userRole,
            })
          );
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          localStorage.removeItem("user");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;

        jsCookie.remove("accessToken");
        jsCookie.remove("refreshToken");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;

        jsCookie.remove("accessToken");
        jsCookie.remove("refreshToken");
        localStorage.removeItem("user");
      });
  },
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
