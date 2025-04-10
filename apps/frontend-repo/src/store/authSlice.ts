import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import axios from "axios";

// define the state interface
interface AuthState {
  user: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// async thunks
export const login = createAsyncThunk("auth/login", async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    // store token in localStorage for api calls
    localStorage.setItem("authToken", token);

    return {
      user: userCredential.user,
      token,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "login failed");
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, displayName }: { email: string; password: string; displayName?: string }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      // Register with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Update display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Store token in localStorage for API calls
      localStorage.setItem("authToken", token);

      // Create user on backend
      try {
        // Configure axios with the auth token
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        await axios.post(
          `${apiUrl}/users/create`,
          {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: displayName || userCredential.user.displayName || email.split("@")[0],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (backendError) {
        console.error("Failed to create user in backend:", backendError);
        // Continue anyway, as the Firebase user is created
      }

      return {
        user: userCredential.user,
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "registration failed");
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
  try {
    const auth = getAuth();
    await firebaseSignOut(auth);

    // remove token from localStorage
    localStorage.removeItem("authToken");

    return null;
  } catch (error: any) {
    return rejectWithValue(error.message || "sign out failed");
  }
});

// create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<{ user: FirebaseUser | null; token: string | null }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // sign out
    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
    });
    builder.addCase(signOut.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
