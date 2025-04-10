import { db } from "../config/firebaseConfig";
import { User, CreateUserDTO, UpdateUserDTO } from "../entities/user";

// extend UpdateUserDTO to include potentialScore and updatedAt
interface ExtendedUpdateUserDTO extends UpdateUserDTO {
  potentialScore?: number;
  updatedAt?: string;
}

// type for Firestore document snapshot
type DocumentSnapshot = any;
type QueryDocumentSnapshot = any;

const COLLECTION_NAME = "USERS";
const usersCollection = db.collection(COLLECTION_NAME);

// example of constants for potential score calculation
const WEIGHT_RATING = 0.6;
const WEIGHT_RENTS = 0.3;
const WEIGHT_RECENCY = 0.1;
const MAX_RENTS = 100; // Normalize number of rents
const EPOCH_TIME_NORMALIZER = 1000000000; // Normalize epoch time

/**
 * Calculate potential score based on user metrics
 * Formula: (totalAverageWeightRatings * WEIGHT_RATING) +
 *          ((numberOfRents / MAX_RENTS) * WEIGHT_RENTS) +
 *          ((recentlyActive / EPOCH_TIME_NORMALIZER) * WEIGHT_RECENCY)
 */
export const calculatePotentialScore = (totalAverageWeightRatings: number, numberOfRents: number, recentlyActive: number): number => {
  return (
    totalAverageWeightRatings * WEIGHT_RATING + (numberOfRents / MAX_RENTS) * WEIGHT_RENTS + (recentlyActive / EPOCH_TIME_NORMALIZER) * WEIGHT_RECENCY
  );
};

export const findUserById = async (id: string): Promise<User | null> => {
  try {
    const userDoc = await usersCollection.doc(id).get();

    if (!userDoc.exists) {
      return null;
    }

    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const findAllUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as User);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

/**
 * Find users with pagination, ordered by potential score
 * @param limit Number of users to retrieve per page
 * @param lastVisible Last document from previous batch (for pagination)
 * @returns Array of users and the last visible document
 */
export const findUsersByPotentialScore = async (
  limit: number = 10,
  lastVisible?: DocumentSnapshot
): Promise<{ users: User[]; lastVisible: DocumentSnapshot | null }> => {
  try {
    let query = usersCollection.orderBy("potentialScore", "desc").limit(limit);

    // If we have a lastVisible document, start after it for pagination
    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map(
      (doc: QueryDocumentSnapshot) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as User
    );

    // Get the last document for pagination
    const newLastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return {
      users,
      lastVisible: newLastVisible,
    };
  } catch (error) {
    console.error("Error fetching users by potential score:", error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  try {
    const now = new Date().toISOString();
    const { uid, ...userDataWithoutUid } = userData;

    // Calculate the potential score
    const potentialScore = calculatePotentialScore(
      userData.totalAverageWeightRatings || 0,
      userData.numberOfRents || 0,
      userData.recentlyActive || Date.now()
    );

    const newUser = {
      ...userDataWithoutUid,
      potentialScore,
      createdAt: now,
      updatedAt: now,
    };

    // Use uid as the document ID
    await usersCollection.doc(uid).set(newUser);

    return { id: uid, ...newUser } as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: UpdateUserDTO): Promise<User | null> => {
  try {
    const userDoc = await usersCollection.doc(id).get();

    if (!userDoc.exists) {
      return null;
    }

    const currentData = userDoc.data() as any;

    // Create an object that will be used for the update
    const updatedData: ExtendedUpdateUserDTO = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate potential score if any of the ranking factors changed
    if (userData.totalAverageWeightRatings !== undefined || userData.numberOfRents !== undefined || userData.recentlyActive !== undefined) {
      const potentialScore = calculatePotentialScore(
        userData.totalAverageWeightRatings ?? (currentData.totalAverageWeightRatings || 0),
        userData.numberOfRents ?? (currentData.numberOfRents || 0),
        userData.recentlyActive ?? (currentData.recentlyActive || Date.now())
      );
      updatedData.potentialScore = potentialScore;
    }

    // Convert to a plain object for Firestore update because it doesn't support extended types
    const updateObject: { [key: string]: any } = {};
    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateObject[key] = value;
      }
    });

    // Update with the plain object
    await usersCollection.doc(id).update(updateObject);

    // Get the updated document
    const updatedDoc = await usersCollection.doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Update the recently active timestamp for a user
 * @param id User ID
 * @returns Updated user or null if user not found
 */
export const updateUserActivity = async (id: string): Promise<User | null> => {
  try {
    const userDoc = await usersCollection.doc(id).get();

    if (!userDoc.exists) {
      return null;
    }

    const currentData = userDoc.data() as any;
    const recentlyActive = Date.now();

    // Calculate new potential score
    const potentialScore = calculatePotentialScore(currentData.totalAverageWeightRatings || 0, currentData.numberOfRents || 0, recentlyActive);

    // Use a plain object for Firestore update
    const updateObject = {
      recentlyActive,
      potentialScore,
      updatedAt: new Date().toISOString(),
    };

    await usersCollection.doc(id).update(updateObject);

    // Get the updated document
    const updatedDoc = await usersCollection.doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  } catch (error) {
    console.error("Error updating user activity:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const userDoc = await usersCollection.doc(id).get();

    if (!userDoc.exists) {
      return false;
    }

    await usersCollection.doc(id).delete();
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
