/**
 * User interface for the Firestore USERS collection
 */
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
  totalAverageWeightRatings: number;
  numberOfRents: number;
  recentlyActive: number;
  potentialScore?: number;
  status?: "online" | "offline" | "away";
}

/**
 * DTO for creating a new user
 */
export interface CreateUserDTO {
  uid: string;
  email: string;
  displayName?: string;
  totalAverageWeightRatings?: number;
  numberOfRents?: number;
  recentlyActive?: number;
  status?: "online" | "offline" | "away";
}

/**
 * DTO for updating an existing user
 */
export interface UpdateUserDTO {
  email?: string;
  displayName?: string;
  totalAverageWeightRatings?: number;
  numberOfRents?: number;
  recentlyActive?: number;
  status?: "online" | "offline" | "away";
}
