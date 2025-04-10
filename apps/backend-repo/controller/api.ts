import { Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as userRepo from "../repository/userCollection";
import { UpdateUserDTO } from "../entities/user";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { uid, email, displayName } = req.body;

    // Basic validation
    if (!uid || !email) {
      return void res.status(400).json({ error: "UID and email are required" });
    }

    // Check if user already exists
    const existingUser = await userRepo.findUserById(uid);
    if (existingUser) {
      return void res.status(409).json({ error: "User already exists", data: existingUser });
    }

    // Create the user with default values
    const newUser = await userRepo.createUser({
      uid,
      email,
      displayName: displayName || email.split("@")[0],
      totalAverageWeightRatings: 0,
      numberOfRents: 0,
      recentlyActive: Date.now(),
    });

    return void res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserData = async (req: AuthRequest, res: Response) => {
  try {
    // Get the user ID from the route params
    const userId = req.params.id;

    if (userId) {
      // Get specific user
      const user = await userRepo.findUserById(userId);

      if (!user) {
        console.log(`User not found with ID: ${userId}`);
        return void res.status(404).json({ error: `User not found with ID: ${userId}` });
      }

      // Update user activity timestamp when their profile is viewed
      await userRepo.updateUserActivity(userId);

      return void res.status(200).json({ data: user });
    } else {
      // Get all users
      const users = await userRepo.findAllUsers();
      return void res.status(200).json({ data: users });
    }
  } catch (error) {
    console.error("Error in getUserData:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users ordered by potential score with pagination
 */
export const getPotentialUsers = async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const lastVisibleId = req.query.lastVisible as string;

    let lastVisible = null;
    if (lastVisibleId) {
      // Get the document to use as cursor for pagination
      const lastDoc = await userRepo.findUserById(lastVisibleId);
      if (!lastDoc) {
        return void res.status(400).json({ error: "Invalid lastVisible document ID" });
      }
      // In a real implementation, you would need to get the actual DocumentSnapshot
      // This is a simplified version
      lastVisible = lastDoc;
    }

    const result = await userRepo.findUsersByPotentialScore(limit, lastVisible as any);

    return void res.status(200).json({
      data: result.users,
      pagination: {
        hasMore: result.users.length === limit,
        lastVisible: result.lastVisible ? result.lastVisible.id : null,
      },
    });
  } catch (error) {
    console.error("Error in getPotentialUsers:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return void res.status(400).json({ error: "User ID is required" });
    }

    const updateData: UpdateUserDTO = req.body;

    // Validate the request body
    if (Object.keys(updateData).length === 0) {
      return void res.status(400).json({ error: "No update data provided" });
    }

    // Update the recentlyActive timestamp whenever user data is updated
    updateData.recentlyActive = Date.now();

    // Update the user
    const updatedUser = await userRepo.updateUser(userId, updateData);

    if (!updatedUser) {
      return void res.status(404).json({ error: "User not found" });
    }

    return void res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserData:", error);
    return void res.status(500).json({ error: "Internal server error" });
  }
};
