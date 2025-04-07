import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as userRepo from "../repository/userCollection";
import { UpdateUserDTO } from "../entities/user";

export const getUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    if (userId) {
      // Get specific user
      const user = await userRepo.findUserById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ data: user });
    } else {
      // Get all users
      const users = await userRepo.findAllUsers();
      return res.status(200).json({ data: users });
    }
  } catch (error) {
    console.error("Error in getUserData:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updateData: UpdateUserDTO = req.body;

    // Validate the request body
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    // Update the user
    const updatedUser = await userRepo.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserData:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
