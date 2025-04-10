import baseAPI from "./userApi";
import type { User, UpdateUserDTO } from "@ebuddy/shared-types";

// Re-export the types
export type { User, UpdateUserDTO };

// Response type for paginated potential users
export interface PotentialUsersResponse {
  users: User[];
  pagination: {
    hasMore: boolean;
    lastVisible: string | null;
  };
}

// get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await baseAPI.get("/users/fetch-user-data");
    return response.data.data;
  } catch (error) {
    console.error("error fetching all users:", error);
    throw error;
  }
};

// get user by id
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await baseAPI.get(`/users/fetch-user-data/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`error fetching user with id ${id}:`, error);
    throw error;
  }
};

// get potential users (ranked by composite score)
export const getPotentialUsers = async (limit: number = 10, lastVisible?: string): Promise<PotentialUsersResponse> => {
  try {
    const params: Record<string, string | number> = { limit };
    if (lastVisible) {
      params.lastVisible = lastVisible;
    }

    const response = await baseAPI.get("/users/potential-users", { params });
    return {
      users: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("error fetching potential users:", error);
    throw error;
  }
};

// update user
export const updateUser = async (id: string, data: UpdateUserDTO): Promise<User> => {
  try {
    const response = await baseAPI.put(`/users/update-user-data/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(`error updating user with id ${id}:`, error);
    throw error;
  }
};
