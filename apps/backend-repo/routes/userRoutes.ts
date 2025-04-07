import { Router } from "express";
import { getUserData, updateUserData } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Endpoint to fetch user data
router.get("/", getUserData);
router.get("/:id", getUserData);

// Endpoint to update user data
router.put("/:id", updateUserData);

export default router;
