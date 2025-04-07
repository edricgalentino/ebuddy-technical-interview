import { db } from "../config/firebaseConfig";
import { User, CreateUserDTO, UpdateUserDTO } from "../entities/user";
import { DocumentData } from "firebase-admin/firestore";

const COLLECTION_NAME = "USERS";
const usersCollection = db.collection(COLLECTION_NAME);

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
    return snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...doc.data() }) as User);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  try {
    const now = new Date().toISOString();
    const newUser = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await usersCollection.add(newUser);
    return { id: docRef.id, ...newUser } as User;
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

    const updatedData = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    await usersCollection.doc(id).update(updatedData);

    // Get the updated document
    const updatedDoc = await usersCollection.doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  } catch (error) {
    console.error("Error updating user:", error);
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
