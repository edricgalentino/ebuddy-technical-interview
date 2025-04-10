import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, getUserById, updateUser, UpdateUserDTO, getAllUsers, getPotentialUsers, PotentialUsersResponse } from "../apis/user";

// define the state interface
interface UserState {
  users: User[];
  potentialUsers: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  pagination: {
    hasMore: boolean;
    lastVisible: string | null;
  };
}

// initial state
const initialState: UserState = {
  users: [],
  potentialUsers: [],
  selectedUser: null,
  loading: false,
  error: null,
  success: null,
  pagination: {
    hasMore: false,
    lastVisible: null,
  },
};

// async thunks
export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await getAllUsers();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "failed to fetch users");
  }
});

export const fetchUserById = createAsyncThunk("user/fetchUserById", async (id: string, { rejectWithValue }) => {
  try {
    return await getUserById(id);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "failed to fetch user");
  }
});

export const fetchPotentialUsers = createAsyncThunk(
  "user/fetchPotentialUsers",
  async ({ limit, lastVisible }: { limit?: number; lastVisible?: string }, { rejectWithValue }) => {
    try {
      return await getPotentialUsers(limit, lastVisible);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed to fetch potential users");
    }
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ id, data }: { id: string; data: UpdateUserDTO }, { rejectWithValue }) => {
    try {
      return await updateUser(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed to update user");
    }
  }
);

// create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearPotentialUsersPagination: (state) => {
      state.pagination = {
        hasMore: false,
        lastVisible: null,
      };
    },
  },
  extraReducers: (builder) => {
    // fetch all users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetch user by id
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetch potential users
    builder.addCase(fetchPotentialUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPotentialUsers.fulfilled, (state, action: PayloadAction<PotentialUsersResponse>) => {
      state.loading = false;
      // If lastVisible is null, it's a fresh request, otherwise append to existing list
      if (!action.payload.pagination.lastVisible || !state.pagination.lastVisible) {
        state.potentialUsers = action.payload.users;
      } else {
        state.potentialUsers = [...state.potentialUsers, ...action.payload.users].filter(
          (user, index, self) => index === self.findIndex((t) => t.id === user.id)
        );
      }
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchPotentialUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // update user
    builder.addCase(updateUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.selectedUser = action.payload;
      state.success = "user updated successfully";
      // update user in users array
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      // update in potential users array if exists
      const potentialIndex = state.potentialUsers.findIndex((user) => user.id === action.payload.id);
      if (potentialIndex !== -1) {
        state.potentialUsers[potentialIndex] = action.payload;
      }
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearSuccess, clearSelectedUser, clearPotentialUsersPagination } = userSlice.actions;
export default userSlice.reducer;
